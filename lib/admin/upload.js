"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminProfile } from "@/lib/admin/auth";
import { writeAuditLog } from "@/lib/admin/audit";

const ALLOWED_BUCKETS = new Set(["catalog-media", "brochures"]);

const MAX_BYTES = {
  "catalog-media": 10 * 1024 * 1024,
  brochures: 50 * 1024 * 1024,
};

function safeName(name) {
  return String(name || "file")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .slice(0, 120);
}

/**
 * Upload a file to Supabase Storage (admin only). Returns public URL.
 */
export async function uploadAdminMedia(formData) {
  await requireAdminProfile();
  const admin = createAdminClient();
  if (!admin) throw new Error("SUPABASE_NOT_CONFIGURED");

  const file = formData.get("file");
  const bucket = String(formData.get("bucket") || "catalog-media");
  const folder = String(formData.get("folder") || "uploads").replace(/[^a-zA-Z0-9/_-]/g, "");

  if (!(file instanceof File)) {
    throw new Error("No file provided");
  }
  if (!ALLOWED_BUCKETS.has(bucket)) {
    throw new Error("Invalid storage bucket");
  }
  if (file.size > MAX_BYTES[bucket]) {
    throw new Error("File is too large");
  }

  const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
  const path = `${folder}/${Date.now()}-${randomBytes(4).toString("hex")}-${safeName(file.name)}`.replace(
    /\.+$/,
    `.${ext}`,
  );

  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await admin.storage.from(bucket).upload(path, buffer, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });

  if (error) {
    console.error("[upload]", error);
    throw new Error(error.message || "Upload failed");
  }

  const { data: urlData } = admin.storage.from(bucket).getPublicUrl(path);

  await writeAuditLog({
    action: "storage.upload",
    entityType: "storage",
    entityId: `${bucket}/${path}`,
    meta: { bytes: file.size, contentType: file.type },
  });

  revalidatePath("/mattresses");
  revalidatePath("/product-catalog");
  revalidatePath("/resources");
  revalidatePath("/admin", "layout");

  return {
    ok: true,
    url: urlData.publicUrl,
    path,
    bucket,
  };
}
