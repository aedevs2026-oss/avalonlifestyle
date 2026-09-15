import { createAdminClient } from "@/lib/supabase/admin";
import { chunkDocumentText } from "@/lib/ai/chunking";
import { extractTextFromBuffer } from "@/lib/ai/extract";
import { embedBatch, vectorToPg } from "@/lib/ai/embeddings";
import { productToChunks } from "@/lib/ai/productKnowledge";
import { newChunkId } from "@/lib/ai/extract";

async function setDocStatus(db, docId, status, fields = {}) {
  await db
    .from("ai_knowledge_documents")
    .update({ status, updated_at: new Date().toISOString(), ...fields })
    .eq("id", docId);
}

async function setJob(db, jobId, patch) {
  if (!jobId) return;
  await db.from("ai_processing_jobs").update(patch).eq("id", jobId);
}

export async function processDocumentStep(documentId, jobId = null) {
  const db = createAdminClient();
  if (!db) throw new Error("SUPABASE_NOT_CONFIGURED");

  const { data: doc, error } = await db
    .from("ai_knowledge_documents")
    .select("*")
    .eq("id", documentId)
    .single();
  if (error || !doc) throw new Error("Document not found");

  const { data: file, error: dlErr } = await db.storage.from(doc.storage_bucket).download(doc.storage_path);
  if (dlErr || !file) throw new Error(dlErr?.message || "Could not download file");

  const buffer = Buffer.from(await file.arrayBuffer());

  await setJob(db, jobId, { status: "EXTRACTING", progress_pct: 15, started_at: new Date().toISOString() });
  await setDocStatus(db, documentId, "EXTRACTING");

  const { text, warnings, structured } = await extractTextFromBuffer(buffer, doc.file_name, doc.file_type);

  await setJob(db, jobId, { status: "STRUCTURING", progress_pct: 35 });
  await setDocStatus(db, documentId, "STRUCTURING", {
    extracted_text: text?.slice(0, 500000) || "",
    structured_data: structured || {},
    warnings,
  });

  await setJob(db, jobId, { status: "CHUNKING", progress_pct: 50 });
  await setDocStatus(db, documentId, "CHUNKING");

  await db.from("ai_knowledge_chunks").delete().eq("document_id", documentId);

  const meta = {
    source_type: "document",
    source_file: doc.file_name,
    document_id: documentId,
    language: "en",
  };
  const rawChunks = chunkDocumentText(text, meta);
  const chunkRows = rawChunks.map((c) => ({
    chunk_id: c.chunk_id || newChunkId("doc"),
    document_id: documentId,
    content: c.content,
    content_type: c.content_type,
    metadata: c.metadata,
    is_enabled: doc.is_approved && doc.is_enabled,
    language: "en",
  }));

  if (chunkRows.length) {
    const { error: insErr } = await db.from("ai_knowledge_chunks").insert(chunkRows);
    if (insErr) throw new Error(insErr.message);
  }

  await setJob(db, jobId, { status: "EMBEDDING", progress_pct: 70 });
  await setDocStatus(db, documentId, "EMBEDDING", { chunk_count: chunkRows.length });

  const embeddings = await embedBatch(chunkRows.map((r) => r.content));
  let embeddingCount = 0;

  for (let i = 0; i < chunkRows.length; i++) {
    const emb = embeddings[i];
    if (!emb) continue;
    const { error: upErr } = await db
      .from("ai_knowledge_chunks")
      .update({
        embedding: vectorToPg(emb),
        embedding_id: chunkRows[i].chunk_id,
        updated_at: new Date().toISOString(),
      })
      .eq("chunk_id", chunkRows[i].chunk_id);
    if (!upErr) embeddingCount += 1;
  }

  await setJob(db, jobId, { status: "INDEXING", progress_pct: 90 });
  await setDocStatus(db, documentId, "INDEXING", { embedding_count: embeddingCount });

  const recordCount = structured?.rows?.length || structured?.sheets ? Object.keys(structured.sheets || {}).length : 0;

  await setDocStatus(db, documentId, "COMPLETED", {
    record_count: recordCount,
    chunk_count: chunkRows.length,
    embedding_count: embeddingCount,
    last_indexed_at: new Date().toISOString(),
  });
  await setJob(db, jobId, {
    status: "COMPLETED",
    progress_pct: 100,
    finished_at: new Date().toISOString(),
    message: `Indexed ${chunkRows.length} chunks`,
  });

  return { chunkCount: chunkRows.length, embeddingCount, warnings };
}

export async function approveAndEnableDocument(documentId) {
  const db = createAdminClient();
  if (!db) throw new Error("SUPABASE_NOT_CONFIGURED");
  await db
    .from("ai_knowledge_documents")
    .update({ is_approved: true, is_enabled: true, updated_at: new Date().toISOString() })
    .eq("id", documentId);
  await db
    .from("ai_knowledge_chunks")
    .update({ is_enabled: true })
    .eq("document_id", documentId);
}

export async function indexProductById(productId, jobId = null) {
  const db = createAdminClient();
  if (!db) throw new Error("SUPABASE_NOT_CONFIGURED");

  const { data: product, error } = await db.from("products").select("*").eq("id", productId).single();
  if (error || !product) throw new Error("Product not found");
  if (!product.is_published) {
    await disableProductChunks(productId);
    return { chunkCount: 0 };
  }

  let category = null;
  if (product.category_id) {
    const { data: cat } = await db.from("categories").select("*").eq("id", product.category_id).single();
    category = cat;
  }

  await setJob(db, jobId, { status: "CHUNKING", progress_pct: 40 });

  await db.from("ai_knowledge_chunks").delete().eq("product_id", productId);

  const chunks = productToChunks(product, category).map((c) => ({
    chunk_id: newChunkId("prd"),
    product_id: productId,
    category_id: product.category_id,
    content: c.content,
    content_type: c.content_type,
    metadata: c.metadata,
    is_enabled: true,
    language: "en",
  }));

  if (chunks.length) {
    const { error: insErr } = await db.from("ai_knowledge_chunks").insert(chunks);
    if (insErr) throw new Error(insErr.message);
  }

  await setJob(db, jobId, { status: "EMBEDDING", progress_pct: 70 });
  const embeddings = await embedBatch(chunks.map((c) => c.content));
  let embeddingCount = 0;
  for (let i = 0; i < chunks.length; i++) {
    const emb = embeddings[i];
    if (!emb) continue;
    await db
      .from("ai_knowledge_chunks")
      .update({ embedding: vectorToPg(emb), embedding_id: chunks[i].chunk_id })
      .eq("chunk_id", chunks[i].chunk_id);
    embeddingCount += 1;
  }

  await db.from("ai_product_knowledge").upsert(
    {
      product_id: productId,
      slug: product.slug,
      data: product.payload || {},
      is_enabled: true,
      is_approved: true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "product_id" },
  );

  await setJob(db, jobId, {
    status: "COMPLETED",
    progress_pct: 100,
    finished_at: new Date().toISOString(),
  });

  return { chunkCount: chunks.length, embeddingCount };
}

export async function disableProductChunks(productId) {
  const db = createAdminClient();
  if (!db) return;
  await db.from("ai_knowledge_chunks").delete().eq("product_id", productId);
  await db.from("ai_product_knowledge").update({ is_enabled: false }).eq("product_id", productId);
}

export async function reindexAllPublishedProducts() {
  const db = createAdminClient();
  if (!db) throw new Error("SUPABASE_NOT_CONFIGURED");
  const { data: products } = await db.from("products").select("id").eq("is_published", true);
  const results = [];
  for (const p of products || []) {
    results.push(await indexProductById(p.id));
  }
  const { data: categories } = await db.from("categories").select("id").eq("is_active", true);
  for (const c of categories || []) {
    results.push(await indexCategoryById(c.id));
  }
  await indexCompanyAndFaqs();
  return results;
}

export async function indexCategoryById(categoryId) {
  const db = createAdminClient();
  if (!db) throw new Error("SUPABASE_NOT_CONFIGURED");
  const { data: category } = await db.from("categories").select("*").eq("id", categoryId).single();
  if (!category) throw new Error("Category not found");

  await db.from("ai_knowledge_chunks").delete().eq("category_id", categoryId).is("product_id", null);

  const content = [
    category.name,
    category.description,
    category.seo_description,
  ]
    .filter(Boolean)
    .join("\n\n");

  if (!content) return { chunkCount: 0 };

  const chunk_id = newChunkId("cat");
  const row = {
    chunk_id,
    category_id: categoryId,
    content,
    content_type: "category_information",
    metadata: {
      source_type: "category",
      category_id: categoryId,
      category_name: category.name,
      language: "en",
      content_type: "category_information",
    },
    is_enabled: category.is_active,
    language: "en",
  };

  await db.from("ai_knowledge_chunks").insert(row);
  const [emb] = await embedBatch([content]);
  if (emb) {
    await db.from("ai_knowledge_chunks").update({ embedding: vectorToPg(emb), embedding_id: chunk_id }).eq("chunk_id", chunk_id);
  }

  await db.from("ai_category_knowledge").upsert(
    {
      category_id: categoryId,
      data: { name: category.name, description: category.description },
      is_enabled: category.is_active,
      is_approved: true,
    },
    { onConflict: "category_id" },
  );

  return { chunkCount: 1 };
}

export async function indexCompanyAndFaqs() {
  const db = createAdminClient();
  if (!db) throw new Error("SUPABASE_NOT_CONFIGURED");

  await db.from("ai_knowledge_chunks").delete().eq("content_type", "company_information");
  await db.from("ai_knowledge_chunks").delete().eq("content_type", "faq");

  const { data: sections } = await db.from("ai_company_knowledge").select("*").eq("is_published", true);
  for (const s of sections || []) {
    const content = `${s.title}\n\n${s.body || ""}`.trim();
    if (!content) continue;
    const chunk_id = newChunkId("co");
    await db.from("ai_knowledge_chunks").insert({
      chunk_id,
      company_section_id: s.id,
      content,
      content_type: "company_information",
      metadata: { source_type: "company", section_key: s.section_key, language: s.language },
      is_enabled: true,
      language: s.language,
    });
    const [emb] = await embedBatch([content]);
    if (emb) {
      await db.from("ai_knowledge_chunks").update({ embedding: vectorToPg(emb) }).eq("chunk_id", chunk_id);
    }
  }

  const { data: faqs } = await db.from("ai_faqs").select("*").eq("is_published", true);
  for (const f of faqs || []) {
    const content = `Q: ${f.question}\nA: ${f.answer}`;
    const chunk_id = newChunkId("faq");
    await db.from("ai_knowledge_chunks").insert({
      chunk_id,
      faq_id: f.id,
      content,
      content_type: "faq",
      metadata: { source_type: "faq", category: f.category, language: f.language },
      is_enabled: true,
      language: f.language,
    });
    const [emb] = await embedBatch([content]);
    if (emb) {
      await db.from("ai_knowledge_chunks").update({ embedding: vectorToPg(emb) }).eq("chunk_id", chunk_id);
    }
  }
}
