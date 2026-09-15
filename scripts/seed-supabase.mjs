/**
 * Sync ALL current frontend data into Supabase (admin panel source of truth).
 *
 * Prerequisites:
 *   - .env.local with NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
 *   - Migrations 001 + 002 applied
 *
 * Usage: npm run seed
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function loadEnvLocal() {
  try {
    const raw = readFileSync(join(root, ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    /* no .env.local */
  }
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const snapshot = await import("../lib/seed/frontendSnapshot.js");

const {
  dealers,
  products,
  mattressCategories,
  mattressCollectionOrder,
  companySettings,
  emailSettings,
  brandingSettings,
  brochureDownloads,
  storyEntries,
  faqSettings,
  resourceVideos,
  categoryThumbnailByName,
} = snapshot;

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function seedSiteSettings() {
  const rows = [
    { key: "company", value: companySettings },
    { key: "email", value: emailSettings },
    { key: "branding", value: brandingSettings },
    { key: "faqs", value: faqSettings },
    {
      key: "contact",
      value: {
        main_email: emailSettings.main_email,
        dealer_suggestions_count: emailSettings.dealer_suggestions_count,
        default_radius_km: emailSettings.dealer_search_radius_km,
      },
    },
  ];
  for (const row of rows) {
    const { error } = await supabase.from("site_settings").upsert({
      ...row,
      updated_at: new Date().toISOString(),
    });
    if (error) throw error;
  }
  console.log(`Seeded ${rows.length} site_settings keys`);
}

async function seedCategories() {
  const rows = mattressCategories
    .filter((name) => name !== "All Mattresses")
    .map((name, i) => ({
      slug: slugify(name),
      name,
      description: `Avalon ${name} mattresses`,
      image_url: categoryThumbnailByName[name] || null,
      sort_order: i,
      is_active: true,
      updated_at: new Date().toISOString(),
    }));
  const { error } = await supabase.from("categories").upsert(rows, { onConflict: "slug" });
  if (error) throw error;
  console.log(`Seeded ${rows.length} categories`);
  return rows;
}

async function fetchCategoryIdByName() {
  const { data, error } = await supabase.from("categories").select("id, name");
  if (error) throw error;
  return new Map((data || []).map((c) => [c.name, c.id]));
}

async function seedProducts(categoryMap) {
  const orderIndex = Object.fromEntries(mattressCollectionOrder.map((slug, i) => [slug, i]));

  for (const p of products) {
    const { image, layersImage, slug, name, type, ...rest } = p;
    const payload = { ...rest, image, layersImage };
    const sortOrder = orderIndex[slug] ?? 100;
    const row = {
      slug,
      name,
      product_type: type,
      category_id: categoryMap.get(type) ?? null,
      payload,
      is_published: true,
      is_featured: mattressCollectionOrder.includes(slug),
      sort_order: sortOrder,
      seo_title: `${name} Mattress | Avalon Premium Mattress`,
      seo_description: p.description || p.tagline || p.specs,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from("products").upsert(row, { onConflict: "slug" });
    if (error) throw error;
  }
  console.log(`Seeded ${products.length} products (featured: ${mattressCollectionOrder.length})`);
}

async function seedDealers() {
  const rows = dealers.map((d) => ({
    legacy_id: d.id,
    dealer_code: `AVL-${String(d.id).padStart(3, "0")}`,
    name: d.name,
    address: d.address,
    city: d.city,
    pincode: d.pincode,
    phone: d.phone,
    lat: d.lat,
    lng: d.lng,
    hours_week: d.hoursWeek,
    hours_sun: d.hoursSun,
    email: companySettings.email,
    whatsapp: companySettings.phone,
    is_active: true,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase.from("dealers").upsert(rows, { onConflict: "legacy_id" });
  if (error) throw error;
  console.log(`Seeded ${rows.length} dealers`);
}

async function seedBrochures() {
  await supabase.from("brochures").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  const rows = brochureDownloads.map((b, i) => ({
    title: b.title,
    file_url: b.file_url || "#",
    file_size_label: b.file_size_label,
    cover_image_url: b.cover_image_url,
    description: b.description,
    kind: b.kind,
    category_label: b.category_label,
    version: b.version,
    sort_order: i,
    is_published: true,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase.from("brochures").insert(rows);
  if (error) throw error;
  console.log(`Seeded ${rows.length} brochures/catalogues`);
}

async function seedStories() {
  await supabase.from("stories").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  const articleRows = storyEntries.map((s) => ({
    slug: s.slug,
    title: s.title,
    excerpt: s.excerpt,
    body: s.excerpt,
    image_url: s.image_url,
    category_label: s.category_label,
    is_featured: s.is_featured,
    is_published: true,
    status: "published",
    sort_order: s.sort_order,
    updated_at: new Date().toISOString(),
  }));

  const videoRows = resourceVideos.map((v) => ({
    slug: slugify(v.title),
    title: v.title,
    excerpt: v.excerpt,
    body: v.excerpt,
    image_url: v.image_url,
    video_url: v.video_url,
    category_label: "Video",
    is_featured: false,
    is_published: true,
    status: "published",
    sort_order: v.sort_order,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase.from("stories").insert([...articleRows, ...videoRows]);
  if (error) throw error;
  console.log(`Seeded ${articleRows.length + videoRows.length} stories`);
}

console.log("Avalon — syncing frontend snapshot to Supabase…\n");

try {
  await seedSiteSettings();
  await seedCategories();
  const categoryMap = await fetchCategoryIdByName();
  await seedProducts(categoryMap);
  await seedDealers();
  await seedBrochures();
  await seedStories();
  console.log("\nDone. Open /admin to review all records.");
} catch (err) {
  console.error("\nSeed failed:", err.message || err);
  if (err.code === "PGRST204" || err.message?.includes("column")) {
    console.error("Tip: run supabase/migrations/002_align_frontend_schema.sql in Supabase SQL editor.");
  }
  process.exit(1);
}
