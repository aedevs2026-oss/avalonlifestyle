import { createAdminClient } from "@/lib/supabase/admin";
import { productRowToKnowledge } from "@/lib/ai/productKnowledge";

function scoreProduct(k, filters) {
  let score = 0;
  if (filters.firmness && k.firmness) {
    if (String(k.firmness).toLowerCase().includes(String(filters.firmness).toLowerCase())) score += 3;
  }
  if (filters.budget_max != null && k.price != null) {
    const price = Number(k.price);
    if (!Number.isNaN(price) && price <= filters.budget_max) score += 4;
    else if (!Number.isNaN(price) && price <= filters.budget_max * 1.1) score += 1;
  }
  if (filters.sleeping_position && k.suitable_sleeping_position) {
    if (String(k.suitable_sleeping_position).toLowerCase().includes(filters.sleeping_position)) score += 2;
  }
  if (filters.customer_type && k.suitable_customer_type) {
    if (String(k.suitable_customer_type).toLowerCase().includes(filters.customer_type)) score += 1;
  }
  if (k.is_published) score += 1;
  return score;
}

export async function recommendProducts(filters, limit = 5) {
  const db = createAdminClient();
  if (!db) return [];

  const { data: products } = await db
    .from("products")
    .select("*, categories:category_id(name)")
    .eq("is_published", true);

  const scored = (products || [])
    .map((p) => {
      const k = productRowToKnowledge(p, p.categories ? { name: p.categories.name } : null);
      return { product: p, knowledge: k, score: scoreProduct(k, filters) };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  if (!scored.length && products?.length) {
    return products.slice(0, limit).map((p) => ({
      product: p,
      knowledge: productRowToKnowledge(p, p.categories ? { name: p.categories.name } : null),
      score: 0,
    }));
  }

  return scored;
}

export function productToCard(product, knowledge) {
  const p = product.payload || {};
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: knowledge.category_name,
    image: p.image || null,
    shortDescription: knowledge.short_description,
    price: knowledge.price != null ? knowledge.price : null,
    mattressType: knowledge.mattress_type || p.type || null,
    height: knowledge.height || null,
    firmness: knowledge.firmness || null,
    material: knowledge.material || null,
    keySpecs: [knowledge.height, knowledge.firmness, knowledge.material].filter(Boolean),
    productUrl: knowledge.product_url,
  };
}
