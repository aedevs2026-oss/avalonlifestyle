import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/requireAdminApi";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request) {
  const { response } = await requireAdminApi();
  if (response) return response;

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "SUPABASE_NOT_CONFIGURED" }, { status: 503 });

  const { searchParams } = new URL(request.url);
  if (searchParams.get("stats") === "1") {
    const [docs, chunks, products, categories, jobs] = await Promise.all([
      admin.from("ai_knowledge_documents").select("*", { count: "exact", head: true }),
      admin.from("ai_knowledge_chunks").select("*", { count: "exact", head: true }),
      admin.from("products").select("*", { count: "exact", head: true }),
      admin.from("categories").select("*", { count: "exact", head: true }),
      admin.from("ai_processing_jobs").select("*", { count: "exact", head: true }),
    ]);

    const { count: embCount } = await admin
      .from("ai_knowledge_chunks")
      .select("*", { count: "exact", head: true })
      .not("embedding", "is", null);

    const { count: failedDocs } = await admin
      .from("ai_knowledge_documents")
      .select("*", { count: "exact", head: true })
      .eq("status", "FAILED");

    const { data: lastDoc } = await admin
      .from("ai_knowledge_documents")
      .select("last_indexed_at")
      .order("last_indexed_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    return NextResponse.json({
      totalDocuments: docs.count ?? 0,
      totalChunks: chunks.count ?? 0,
      totalEmbeddings: embCount ?? 0,
      totalProducts: products.count ?? 0,
      totalCategories: categories.count ?? 0,
      totalJobs: jobs.count ?? 0,
      failedRecords: failedDocs ?? 0,
      lastIndexTime: lastDoc?.last_indexed_at || null,
    });
  }

  const { data, error } = await admin
    .from("ai_knowledge_documents")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ documents: data });
}
