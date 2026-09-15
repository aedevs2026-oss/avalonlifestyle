/**
 * Service-role CRUD test for products table + payload mapping.
 * Run: node scripts/test-product-crud.mjs
 */
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { createServiceRoleClient } from "../lib/supabase/nodeClient.js";
import { emptyProductForm, formToPayload } from "../lib/admin/productForm.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

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
  console.error("Missing .env.local");
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const db = createServiceRoleClient(url, key);

const testSlug = `crud-test-${Date.now()}`;
const form = {
  ...emptyProductForm(),
  slug: testSlug,
  name: "CRUD Test Mattress",
  product_type: "Memory Foam",
  price: 12345,
  tagline: "Automated test",
  description: "Created by test-product-crud.mjs",
  thickness: "8 Inches",
  warranty: "10 Years",
  specs: "Test specs",
  shortSpecs: "Test short",
  highlightsText: "Highlight one\nHighlight two",
  layersText: "Layer A\nLayer B",
  productImage: "/products/1000276737.jpg",
  is_published: false,
  is_featured: false,
};

const payload = formToPayload(form);

console.log("1. INSERT…");
const { data: inserted, error: insertErr } = await db
  .from("products")
  .insert({
    slug: testSlug,
    name: form.name,
    product_type: form.product_type,
    payload,
    is_published: false,
    sort_order: 999,
  })
  .select("id, slug, payload")
  .single();

if (insertErr) {
  console.error("INSERT failed:", insertErr.message);
  process.exit(1);
}
console.log("   OK id=", inserted.id, "price=", inserted.payload?.price);

console.log("2. UPDATE price…");
const nextPayload = formToPayload({ ...form, price: 54321 }, inserted.payload);
const { error: updateErr } = await db
  .from("products")
  .update({ payload: nextPayload, updated_at: new Date().toISOString() })
  .eq("id", inserted.id);
if (updateErr) {
  console.error("UPDATE failed:", updateErr.message);
  process.exit(1);
}
console.log("   OK");

console.log("3. DELETE…");
const { error: delErr } = await db.from("products").delete().eq("id", inserted.id);
if (delErr) {
  console.error("DELETE failed:", delErr.message);
  process.exit(1);
}
console.log("   OK");

console.log("\nProduct CRUD (database) passed.");
