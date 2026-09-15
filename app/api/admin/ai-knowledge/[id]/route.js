import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/requireAdminApi";
import { createAdminClient } from "@/lib/supabase/admin";
import { approveAndEnableDocument } from "@/lib/ai/pipeline";

export async function GET(_request, context) {
  const { response } = await requireAdminApi();
  if (response) return response;

  const { id } = await context.params;
  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "SUPABASE_NOT_CONFIGURED" }, { status: 503 });

  const { data: doc, error } = await admin.from("ai_knowledge_documents").select("*").eq("id", id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });

  const { data: chunks } = await admin
    .from("ai_knowledge_chunks")
    .select("id, chunk_id, content_type, content, metadata, embedding_id, created_at")
    .eq("document_id", id)
    .order("created_at");

  return NextResponse.json({ document: doc, chunks: chunks || [] });
}

export async function PATCH(request, context) {
  const { response } = await requireAdminApi();
  if (response) return response;

  const { id } = await context.params;
  const body = await request.json().catch(() => ({}));
  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "SUPABASE_NOT_CONFIGURED" }, { status: 503 });

  if (body.approve) {
    await approveAndEnableDocument(id);
    return NextResponse.json({ ok: true });
  }

  const patch = {};
  if (typeof body.is_enabled === "boolean") patch.is_enabled = body.is_enabled;
  if (Object.keys(patch).length) {
    await admin.from("ai_knowledge_documents").update(patch).eq("id", id);
    if (patch.is_enabled === false) {
      await admin.from("ai_knowledge_chunks").update({ is_enabled: false }).eq("document_id", id);
    }
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_request, context) {
  const { response } = await requireAdminApi();
  if (response) return response;

  const { id } = await context.params;
  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "SUPABASE_NOT_CONFIGURED" }, { status: 503 });

  const { data: doc } = await admin.from("ai_knowledge_documents").select("storage_path, storage_bucket").eq("id", id).single();
  if (doc?.storage_path) {
    await admin.storage.from(doc.storage_bucket || "ai-knowledge").remove([doc.storage_path]);
  }
  await admin.from("ai_knowledge_documents").delete().eq("id", id);

  return NextResponse.json({ ok: true });
}
