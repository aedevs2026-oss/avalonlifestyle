import { createAdminClient } from "@/lib/supabase/admin";
import { embedText } from "@/lib/ai/embeddings";

export async function vectorSearchChunks(question, { limit = 10, productId = null, categoryId = null, sourceType = null } = {}) {
  const db = createAdminClient();
  if (!db) return [];

  const embedding = await embedText(question);
  if (!embedding) {
    return keywordSearchChunks(question, { limit, productId, categoryId });
  }

  const { data, error } = await db.rpc("match_ai_knowledge_chunks", {
    query_embedding: `[${embedding.join(",")}]`,
    match_count: limit,
    filter_product_id: productId,
    filter_category_id: categoryId,
    filter_source_type: sourceType,
  });

  if (error) {
    console.error("[retrieval] rpc", error);
    return keywordSearchChunks(question, { limit, productId, categoryId });
  }
  return data || [];
}

export async function keywordSearchChunks(question, { limit = 10, productId = null, categoryId = null } = {}) {
  const db = createAdminClient();
  if (!db) return [];
  const terms = String(question || "")
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 3)
    .slice(0, 6);
  if (!terms.length) return [];

  let q = db.from("ai_knowledge_chunks").select("id, content, content_type, metadata, product_id, category_id").eq("is_enabled", true);
  if (productId) q = q.eq("product_id", productId);
  if (categoryId) q = q.eq("category_id", categoryId);

  const { data } = await q.limit(200);
  const scored = (data || [])
    .map((row) => {
      const text = row.content.toLowerCase();
      const score = terms.reduce((s, t) => s + (text.includes(t) ? 1 : 0), 0);
      return { ...row, similarity: score / terms.length };
    })
    .filter((r) => r.similarity > 0)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);

  return scored;
}
