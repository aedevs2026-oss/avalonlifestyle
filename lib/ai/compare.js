import { createAdminClient } from "@/lib/supabase/admin";
import {
  COMPARISON_FIELDS,
  formatComparisonValue,
  productRowToKnowledge,
} from "@/lib/ai/productKnowledge";

function normalizeName(s) {
  return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export async function findProductsByNames(names) {
  const db = createAdminClient();
  if (!db) return [];
  const { data: products } = await db
    .from("products")
    .select("*, categories:category_id(name)")
    .eq("is_published", true);
  const wanted = names.map(normalizeName).filter(Boolean);
  const matched = [];
  for (const p of products || []) {
    const n = normalizeName(p.name);
    const slug = normalizeName(p.slug);
    if (wanted.some((w) => n.includes(w) || w.includes(n) || slug === w.replace(/\s/g, "-"))) {
      matched.push(p);
    }
  }
  return matched;
}

export function extractCompareNames(question) {
  const q = String(question || "");
  const m = q.match(/compare\s+(.+?)\s+(?:and|vs\.?|versus|with)\s+(.+?)(?:\?|$)/i);
  if (m) return [m[1].trim(), m[2].trim()];
  const m2 = q.match(/(.+?)\s+vs\.?\s+(.+?)(?:\?|$)/i);
  if (m2) return [m2[1].replace(/^compare\s+/i, "").trim(), m2[2].trim()];
  return [];
}

export function buildComparisonTable(products) {
  const knowledge = products.map((p) =>
    productRowToKnowledge(p, p.categories ? { name: p.categories.name } : null), // supabase relation alias
  );
  const names = knowledge.map((k) => k.product_name || "Product");

  const rows = COMPARISON_FIELDS.map(({ key, label }) => ({
    field: label,
    values: knowledge.map((k) => formatComparisonValue(k[key])),
  }));

  return { headers: names, rows, products: knowledge };
}
