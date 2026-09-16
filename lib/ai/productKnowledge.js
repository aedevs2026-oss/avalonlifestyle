import { NOT_AVAILABLE } from "@/lib/ai/config";

/** Build structured product knowledge from DB row only — no invented fields. */
export function productRowToKnowledge(row, category = null) {
  const p = row?.payload && typeof row.payload === "object" ? row.payload : {};
  const sizes = Array.isArray(p.sizes) ? p.sizes : [];

  const price = p.price != null && p.price !== "" ? p.price : null;
  const offerPrice = p.offerPrice != null ? p.offerPrice : null;

  return {
    product_id: row.id,
    product_name: row.name || null,
    product_slug: row.slug || null,
    product_code: p.sku || p.productCode || null,
    category_id: row.category_id || null,
    category_name: category?.name || null,
    subcategory: p.subcategory || null,
    description: p.description || null,
    short_description: p.tagline || p.shortSpecs || null,
    mattress_type: row.product_type || p.type || null,
    mattress_size: sizes.map((s) => s.name).filter(Boolean).join(", ") || null,
    height: p.thickness || null,
    firmness: p.firmness || null,
    comfort_level: p.comfort || null,
    material: p.fabric || p.material || null,
    technology: p.technology || null,
    construction: p.construction || (Array.isArray(p.layers) ? p.layers.join("; ") : null),
    support_system: p.support || null,
    features: Array.isArray(p.highlights) ? p.highlights : null,
    benefits: p.benefits || null,
    suitable_sleeping_position: p.sleepingPosition || null,
    suitable_customer_type: p.customerType || null,
    recommended_use: p.usage || null,
    price,
    offer_price: offerPrice,
    dimensions: sizes.map((s) => `${s.name}: ${s.dimensions}`).join("; ") || null,
    warranty: p.warranty || null,
    care_instructions: p.care || null,
    available_sizes: sizes.length ? sizes : null,
    available_variants: p.variants || null,
    images: [p.image, p.layersImage].filter(Boolean),
    product_url: row.slug ? `/products/${row.slug}` : null,
    dealer_availability: null,
    stock_availability: null,
    is_published: Boolean(row.is_published),
  };
}

export function knowledgeToSearchText(k) {
  const lines = [];
  for (const [key, val] of Object.entries(k)) {
    if (val == null || val === "") continue;
    if (Array.isArray(val)) {
      if (val.length) lines.push(`${key}: ${val.join(", ")}`);
    } else if (typeof val === "object") {
      lines.push(`${key}: ${JSON.stringify(val)}`);
    } else {
      lines.push(`${key}: ${val}`);
    }
  }
  return lines.join("\n");
}

/** Semantic chunk definitions for a product */
export function productToChunks(row, category, documentId = null) {
  const k = productRowToKnowledge(row, category);
  const baseMeta = {
    source_type: "product",
    product_id: row.id,
    product_name: row.name,
    category_id: row.category_id,
    category_name: category?.name || null,
    source_file: documentId ? String(documentId) : "catalogue_db",
    language: "en",
  };

  const chunks = [];

  const overview = [k.product_name, k.short_description, k.description].filter(Boolean).join("\n\n");
  if (overview) {
    chunks.push({
      content_type: "product_overview",
      content: overview,
      metadata: { ...baseMeta, content_type: "product_overview" },
    });
  }

  const specs = [
    k.mattress_type && `Type: ${k.mattress_type}`,
    k.height && `Height: ${k.height}`,
    k.firmness && `Firmness: ${k.firmness}`,
    k.material && `Material: ${k.material}`,
    k.technology && `Technology: ${k.technology}`,
    k.construction && `Construction: ${k.construction}`,
    k.support_system && `Support: ${k.support_system}`,
    k.dimensions && `Dimensions: ${k.dimensions}`,
    k.price != null && `Price: ${k.price}`,
    k.warranty && `Warranty: ${k.warranty}`,
  ]
    .filter(Boolean)
    .join("\n");

  if (specs) {
    chunks.push({
      content_type: "product_specification",
      content: `${k.product_name} specifications:\n${specs}`,
      metadata: { ...baseMeta, content_type: "product_specification" },
    });
  }

  if (k.features?.length) {
    chunks.push({
      content_type: "product_benefits",
      content: `${k.product_name} features:\n${k.features.join("\n")}`,
      metadata: { ...baseMeta, content_type: "product_benefits" },
    });
  }

  if (k.warranty) {
    chunks.push({
      content_type: "warranty",
      content: `${k.product_name} warranty: ${k.warranty}`,
      metadata: { ...baseMeta, content_type: "warranty" },
    });
  }

  if (k.care_instructions) {
    chunks.push({
      content_type: "care_instructions",
      content: `${k.product_name} care: ${k.care_instructions}`,
      metadata: { ...baseMeta, content_type: "care_instructions" },
    });
  }

  if (k.recommended_use) {
    chunks.push({
      content_type: "product_overview",
      content: `${k.product_name} recommended use: ${k.recommended_use}`,
      metadata: { ...baseMeta, content_type: "recommended_use" },
    });
  }

  return chunks;
}

export const COMPARISON_FIELDS = [
  { key: "price", label: "Price" },
  { key: "height", label: "Mattress height" },
  { key: "firmness", label: "Firmness" },
  { key: "material", label: "Material" },
  { key: "mattress_type", label: "Mattress type" },
  { key: "technology", label: "Technology" },
  { key: "support_system", label: "Support" },
  { key: "comfort_level", label: "Comfort" },
  { key: "warranty", label: "Warranty" },
  { key: "mattress_size", label: "Available sizes" },
  { key: "features", label: "Features" },
  { key: "benefits", label: "Benefits" },
];

export function formatComparisonValue(val) {
  if (val == null || val === "") return NOT_AVAILABLE;
  if (Array.isArray(val)) return val.length ? val.join(", ") : NOT_AVAILABLE;
  return String(val);
}
