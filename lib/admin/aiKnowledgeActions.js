"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminProfile } from "@/lib/admin/auth";
import { indexCompanyAndFaqs } from "@/lib/ai/pipeline";

async function db() {
  await requireAdminProfile();
  const client = createAdminClient();
  if (!client) throw new Error("SUPABASE_NOT_CONFIGURED");
  return client;
}

function rev() {
  revalidatePath("/admin/ai-knowledge", "layout");
}

export async function upsertAiFaq(form) {
  const client = await db();
  const row = {
    question: String(form.question || "").trim(),
    answer: String(form.answer || "").trim(),
    category: String(form.category || "").trim() || null,
    priority: Number(form.priority) || 0,
    is_published: Boolean(form.is_published),
    language: String(form.language || "en").trim(),
    updated_at: new Date().toISOString(),
  };
  if (!row.question || !row.answer) throw new Error("Question and answer are required.");

  if (form.id) {
    const { error } = await client.from("ai_faqs").update(row).eq("id", form.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await client.from("ai_faqs").insert(row);
    if (error) throw new Error(error.message);
  }

  try {
    await indexCompanyAndFaqs();
  } catch (e) {
    console.error("[ai index faqs]", e);
  }
  rev();
  return { ok: true };
}

export async function deleteAiFaq(id) {
  const client = await db();
  const { error } = await client.from("ai_faqs").delete().eq("id", id);
  if (error) throw new Error(error.message);
  try {
    await indexCompanyAndFaqs();
  } catch (e) {
    console.error("[ai index faqs]", e);
  }
  rev();
  return { ok: true };
}

export async function upsertAiCompanySection(form) {
  const client = await db();
  const row = {
    section_key: String(form.section_key || "").trim(),
    title: String(form.title || "").trim(),
    body: String(form.body || "").trim() || null,
    language: String(form.language || "en").trim(),
    is_published: Boolean(form.is_published),
    sort_order: Number(form.sort_order) || 0,
    updated_at: new Date().toISOString(),
  };
  if (!row.section_key || !row.title) throw new Error("Section key and title are required.");

  const { error } = await client.from("ai_company_knowledge").upsert(row, { onConflict: "section_key" });
  if (error) throw new Error(error.message);

  try {
    await indexCompanyAndFaqs();
  } catch (e) {
    console.error("[ai index company]", e);
  }
  rev();
  return { ok: true };
}

export async function deleteAiCompanySection(sectionKey) {
  const client = await db();
  const { error } = await client.from("ai_company_knowledge").delete().eq("section_key", sectionKey);
  if (error) throw new Error(error.message);
  try {
    await indexCompanyAndFaqs();
  } catch (e) {
    console.error("[ai index company]", e);
  }
  rev();
  return { ok: true };
}
