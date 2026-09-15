import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/requireAdminApi";
import { createAdminClient } from "@/lib/supabase/admin";
import { processDocumentStep } from "@/lib/ai/pipeline";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(request) {
  const { response } = await requireAdminApi();
  if (response) return response;

  const body = await request.json().catch(() => ({}));
  const documentId = body.documentId;
  const jobId = body.jobId || null;
  if (!documentId) return NextResponse.json({ error: "documentId required" }, { status: 400 });

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "SUPABASE_NOT_CONFIGURED" }, { status: 503 });

  await admin.from("ai_knowledge_documents").update({ status: "PROCESSING" }).eq("id", documentId);
  if (jobId) {
    await admin.from("ai_processing_jobs").update({ status: "PROCESSING", progress_pct: 5 }).eq("id", jobId);
  }

  try {
    const result = await processDocumentStep(documentId, jobId);
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    await admin
      .from("ai_knowledge_documents")
      .update({ status: "FAILED", error_message: e.message })
      .eq("id", documentId);
    if (jobId) {
      await admin
        .from("ai_processing_jobs")
        .update({ status: "FAILED", error_message: e.message, finished_at: new Date().toISOString() })
        .eq("id", jobId);
    }
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
