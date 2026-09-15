import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/requireAdminApi";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request) {
  const { response } = await requireAdminApi();
  if (response) return response;

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const pageSize = Math.min(50, Number(searchParams.get("pageSize") || 20));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "SUPABASE_NOT_CONFIGURED" }, { status: 503 });

  const { data, error, count } = await admin
    .from("ai_knowledge_chunks")
    .select("id, chunk_id, content_type, content, metadata, product_id, document_id, is_enabled, updated_at", {
      count: "exact",
    })
    .order("updated_at", { ascending: false })
    .range(from, to);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ chunks: data, total: count, page, pageSize });
}
