import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { requireAdminApi } from "@/lib/admin/requireAdminApi";
import { createAdminClient } from "@/lib/supabase/admin";
import { AI_UPLOAD } from "@/lib/ai/config";
import { extFromName } from "@/lib/ai/extract";

export const runtime = "nodejs";
export const maxDuration = 60;

function safeName(name) {
  return String(name || "file").replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 120);
}

export async function POST(request) {
  const { profile, response } = await requireAdminApi();
  if (response) return response;

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "SUPABASE_NOT_CONFIGURED" }, { status: 503 });

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const ext = extFromName(file.name);
  if (!AI_UPLOAD.allowedExt.has(ext)) {
    return NextResponse.json({ error: "File type not allowed" }, { status: 400 });
  }
  if (file.size > AI_UPLOAD.maxBytes) {
    return NextResponse.json({ error: "File too large" }, { status: 400 });
  }

  const path = `uploads/${Date.now()}-${randomBytes(4).toString("hex")}-${safeName(file.name)}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: upErr } = await admin.storage.from("ai-knowledge").upload(path, buffer, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });
  if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });

  const { data: doc, error: docErr } = await admin
    .from("ai_knowledge_documents")
    .insert({
      file_name: file.name,
      file_type: file.type || ext,
      file_size_bytes: file.size,
      storage_path: path,
      status: "UPLOADED",
      uploaded_by: profile.user_id,
      uploaded_by_email: profile.email,
    })
    .select("*")
    .single();

  if (docErr) return NextResponse.json({ error: docErr.message }, { status: 500 });

  const { data: job } = await admin
    .from("ai_processing_jobs")
    .insert({
      document_id: doc.id,
      job_type: "document",
      status: "UPLOADED",
      message: "Queued for processing",
    })
    .select("*")
    .single();

  return NextResponse.json({ document: doc, job });
}
