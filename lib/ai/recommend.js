import { createAdminClient } from "@/lib/supabase/admin";
import { productRowToKnowledge } from "@/lib/ai/productKnowledge";

export function productListPrice(knowledge) {
  const price = Number(knowledge?.price);
  return Number.isNaN(price) ? null : price;
}

export function hasStrictProductFilters(filters) {
  return (
    filters?.budget_max != null ||
    Boolean(filters?.firmness) ||
    Boolean(filters?.sleeping_position) ||
    Boolean(filters?.customer_type)
  );
}

/** Hard gate: when budget is set, over-budget or unknown price does not qualify. */
export function passesProductFilters(knowledge, filters) {
  if (!filters) return true;
  if (filters.budget_max != null) {
    const price = productListPrice(knowledge);
    if (price == null || price > filters.budget_max) return false;
  }
  if (filters.firmness && knowledge.firmness) {
    if (!String(knowledge.firmness).toLowerCase().includes(String(filters.firmness).toLowerCase())) {
      return false;
    }
  }
  return true;
}

function scoreProduct(k, filters) {
  if (!passesProductFilters(k, filters)) return 0;

  let score = 0;
  if (filters.firmness && k.firmness) {
    if (String(k.firmness).toLowerCase().includes(String(filters.firmness).toLowerCase())) score += 3;
  }
  if (filters.budget_max != null && k.price != null) {
    const price = productListPrice(k);
    if (price != null && price <= filters.budget_max) score += 4;
  }
  if (filters.sleeping_position) {
    const pos = filters.sleeping_position.toLowerCase();
    const hay = [
      k.suitable_sleeping_position,
      k.description,
      k.short_description,
      Array.isArray(k.features) ? k.features.join(" ") : "",
      k.recommended_use,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    if (hay.includes(pos) || (hay.includes("side sleep") && pos === "side")) score += 3;
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

  if (!scored.length && products?.length && !hasStrictProductFilters(filters)) {
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
    productUrl: product.slug ? `/products/${product.slug}` : knowledge.product_url,
  };
}
