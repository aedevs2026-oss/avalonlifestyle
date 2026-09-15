"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminProfile } from "@/lib/admin/auth";
import { writeAuditLog } from "@/lib/admin/audit";

async function adminDb() {
  await requireAdminProfile();
  const client = createAdminClient();
  if (!client) throw new Error("SUPABASE_NOT_CONFIGURED");
  return client;
}

function revalidateAdmin() {
  revalidatePath("/admin", "layout");
}

export async function signOutAdmin() {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  await supabase.auth.signOut();
}

export async function saveEmailSettings(form) {
  const db = await adminDb();
  const value = {
    provider: form.provider === "resend" ? "resend" : "smtp",
    main_email: String(form.main_email || "").trim(),
    sales_email: String(form.sales_email || "").trim(),
    dealer_notification_enabled: Boolean(form.dealer_notification_enabled),
    customer_confirmation_enabled: Boolean(form.customer_confirmation_enabled),
    dealer_search_radius_km: Math.min(500, Math.max(1, Number(form.dealer_search_radius_km) || 25)),
    dealer_suggestions_count: Math.min(10, Math.max(1, Number(form.dealer_suggestions_count) || 3)),
    smtp_host: String(form.smtp_host || "").trim(),
    smtp_port: Number(form.smtp_port) || 587,
    smtp_secure: Boolean(form.smtp_secure),
    smtp_user: String(form.smtp_user || "").trim(),
    from_name: String(form.from_name || "").trim(),
    from_email: String(form.from_email || "").trim(),
  };
  const { error } = await db.from("site_settings").upsert({
    key: "email",
    value,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
  await writeAuditLog({ action: "settings.email.update", entityType: "site_settings", entityId: "email" });
  revalidateAdmin();
  return { ok: true };
}

function slugifyTitle(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function saveCompanySettings(form) {
  const db = await adminDb();
  const social = form.social && typeof form.social === "object" ? form.social : {};
  const value = {
    name: String(form.name || "").trim(),
    tagline: String(form.tagline || "").trim(),
    phone: String(form.phone || "").trim(),
    whatsapp: String(form.whatsapp || "").trim(),
    email: String(form.email || "").trim(),
    sales_email: String(form.sales_email || "").trim(),
    support_email: String(form.support_email || "").trim(),
    address: String(form.address || "").trim(),
    map_embed_query: String(form.map_embed_query || "").trim(),
    hours: String(form.hours || "").trim(),
    social: {
      instagram: String(form.instagram ?? social.instagram ?? "").trim(),
      facebook: String(form.facebook ?? social.facebook ?? "").trim(),
      youtube: String(form.youtube ?? social.youtube ?? "").trim(),
      linkedin: String(form.linkedin ?? social.linkedin ?? "").trim(),
    },
  };
  const { error } = await db.from("site_settings").upsert({
    key: "company",
    value,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
  await writeAuditLog({ action: "settings.company.update", entityType: "site_settings", entityId: "company" });
  revalidateAdmin();
  return { ok: true };
}

/** @deprecated */
export async function saveContactSettings(form) {
  return saveEmailSettings(form);
}

export async function sendTestEmail(to) {
  await requireAdminProfile();
  const { sendEmail } = await import("@/lib/email/send");
  const destination = String(to || "").trim();
  if (!destination) throw new Error("Recipient email is required");

  const result = await sendEmail({
    to: destination,
    subject: "Avalon Admin — SMTP test",
    html: "<p>This is a test email from your Avalon admin SMTP configuration.</p>",
    text: "This is a test email from your Avalon admin SMTP configuration.",
  });

  if (!result.ok && !result.skipped) {
    throw new Error(result.error || "Test email failed");
  }
  if (result.skipped) {
    throw new Error(result.reason || "Email is not configured. Set SMTP_PASSWORD in .env.local.");
  }
  return { ok: true, method: result.method };
}

export async function upsertCategory(form) {
  const db = await adminDb();
  const row = {
    id: form.id || undefined,
    slug: String(form.slug || "").trim(),
    name: String(form.name || "").trim(),
    description: String(form.description || "").trim() || null,
    image_url: String(form.image_url || "").trim() || null,
    banner_url: String(form.banner_url || "").trim() || null,
    sort_order: Number(form.sort_order) || 0,
    is_active: form.is_active !== false,
    updated_at: new Date().toISOString(),
  };
  const { error } = form.id
    ? await db.from("categories").update(row).eq("id", form.id)
    : await db.from("categories").insert(row);
  if (error) throw error;
  revalidateAdmin();
  return { ok: true };
}

export async function deleteCategory(id) {
  const db = await adminDb();
  const { error } = await db.from("categories").delete().eq("id", id);
  if (error) throw error;
  revalidateAdmin();
  return { ok: true };
}

export async function upsertProduct(form) {
  const db = await adminDb();
  let payload = {};
  try {
    payload = JSON.parse(form.payloadJson || "{}");
  } catch {
    throw new Error("Invalid product JSON payload");
  }

  const row = {
    id: form.id || undefined,
    slug: String(form.slug || "").trim(),
    name: String(form.name || "").trim(),
    product_type: String(form.product_type || "").trim() || null,
    category_id: form.category_id || null,
    payload,
    is_published: Boolean(form.is_published),
    is_featured: Boolean(form.is_featured),
    seo_title: String(form.seo_title || "").trim() || null,
    seo_description: String(form.seo_description || "").trim() || null,
    sort_order: Number(form.sort_order) || 0,
    updated_at: new Date().toISOString(),
  };

  const { error } = form.id
    ? await db.from("products").update(row).eq("id", form.id)
    : await db.from("products").insert(row);
  if (error) throw error;
  revalidateAdmin();
  return { ok: true };
}

export async function deleteProduct(id) {
  const db = await adminDb();
  const { error } = await db.from("products").delete().eq("id", id);
  if (error) throw error;
  revalidateAdmin();
  return { ok: true };
}

export async function upsertStory(form) {
  const db = await adminDb();
  const title = String(form.title || "").trim();
  const slug =
    String(form.slug || "").trim() ||
    slugifyTitle(title) ||
    `story-${Date.now()}`;
  const published = form.is_published !== false;
  const row = {
    id: form.id || undefined,
    slug,
    title,
    excerpt: String(form.excerpt || "").trim() || null,
    body: String(form.body || "").trim() || null,
    image_url: String(form.image_url || "").trim() || null,
    video_url: String(form.video_url || "").trim() || null,
    sort_order: Number(form.sort_order) || 0,
    is_published: published,
    status: published ? "published" : "draft",
    updated_at: new Date().toISOString(),
  };
  const { error } = form.id
    ? await db.from("stories").update(row).eq("id", form.id)
    : await db.from("stories").insert(row);
  if (error) throw error;
  revalidateAdmin();
  return { ok: true };
}

export async function deleteStory(id) {
  const db = await adminDb();
  const { error } = await db.from("stories").delete().eq("id", id);
  if (error) throw error;
  revalidateAdmin();
  return { ok: true };
}

export async function upsertBrochure(form) {
  const db = await adminDb();
  const row = {
    id: form.id || undefined,
    title: String(form.title || "").trim(),
    file_url: String(form.file_url || "").trim(),
    file_size_label: String(form.file_size_label || "").trim() || null,
    cover_image_url: String(form.cover_image_url || "").trim() || null,
    description: String(form.description || "").trim() || null,
    kind: String(form.kind || "brochure").trim(),
    sort_order: Number(form.sort_order) || 0,
    is_published: form.is_published !== false,
    updated_at: new Date().toISOString(),
  };
  const { error } = form.id
    ? await db.from("brochures").update(row).eq("id", form.id)
    : await db.from("brochures").insert(row);
  if (error) throw error;
  revalidateAdmin();
  return { ok: true };
}

export async function deleteBrochure(id) {
  const db = await adminDb();
  const { error } = await db.from("brochures").delete().eq("id", id);
  if (error) throw error;
  revalidateAdmin();
  return { ok: true };
}

export async function upsertDealer(form) {
  const db = await adminDb();
  const row = {
    id: form.id || undefined,
    legacy_id: form.legacy_id ? Number(form.legacy_id) : null,
    name: String(form.name || "").trim(),
    address: String(form.address || "").trim(),
    city: String(form.city || "").trim(),
    pincode: String(form.pincode || "").trim() || null,
    phone: String(form.phone || "").trim() || null,
    lat: form.lat !== "" && form.lat != null ? Number(form.lat) : null,
    lng: form.lng !== "" && form.lng != null ? Number(form.lng) : null,
    hours_week: String(form.hours_week || "").trim() || null,
    hours_sun: String(form.hours_sun || "").trim() || null,
    email: String(form.email || "").trim() || null,
    whatsapp: String(form.whatsapp || "").trim() || null,
    dealer_code: String(form.dealer_code || "").trim() || null,
    contact_person: String(form.contact_person || "").trim() || null,
    district: String(form.district || "").trim() || null,
    state: String(form.state || "").trim() || null,
    dealer_type: String(form.dealer_type || "").trim() || null,
    is_active: form.is_active !== false,
    updated_at: new Date().toISOString(),
  };
  const { error } = form.id
    ? await db.from("dealers").update(row).eq("id", form.id)
    : await db.from("dealers").insert(row);
  if (error) throw error;
  revalidateAdmin();
  return { ok: true };
}

export async function deleteDealer(id) {
  const db = await adminDb();
  const { error } = await db.from("dealers").delete().eq("id", id);
  if (error) throw error;
  revalidateAdmin();
  return { ok: true };
}

export async function updateContactSubmissionStatus({ id, status, admin_notes }) {
  const db = await adminDb();
  const { error } = await db
    .from("contact_submissions")
    .update({ status, admin_notes: admin_notes || null })
    .eq("id", id);
  if (error) throw error;
  revalidateAdmin();
  return { ok: true };
}

export async function updateDealerApplicationStatus({ id, status, admin_notes }) {
  const db = await adminDb();
  const { error } = await db
    .from("dealer_applications")
    .update({ status, admin_notes: admin_notes || null })
    .eq("id", id);
  if (error) throw error;
  await writeAuditLog({ action: "dealer_application.status", entityType: "dealer_applications", entityId: id, meta: { status } });
  revalidateAdmin();
  return { ok: true };
}

export async function convertDealerApplicationToDealer(applicationId) {
  const db = await adminDb();
  const { data: app, error: fetchError } = await db
    .from("dealer_applications")
    .select("*")
    .eq("id", applicationId)
    .single();
  if (fetchError || !app) throw fetchError || new Error("Application not found");

  const { data: dealer, error: insertError } = await db
    .from("dealers")
    .insert({
      name: app.business_name,
      contact_person: app.name,
      address: app.city ? `${app.city} (update address)` : "Update address",
      city: app.city || "Unknown",
      phone: app.phone,
      email: app.email,
      is_active: true,
    })
    .select("id")
    .single();
  if (insertError) throw insertError;

  await db
    .from("dealer_applications")
    .update({ status: "approved", admin_notes: `Converted to dealer ${dealer.id}` })
    .eq("id", applicationId);

  await writeAuditLog({
    action: "dealer_application.convert",
    entityType: "dealer_applications",
    entityId: applicationId,
    meta: { dealer_id: dealer.id },
  });
  revalidateAdmin();
  return { ok: true, dealerId: dealer.id };
}
