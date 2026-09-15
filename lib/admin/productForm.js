/**
 * Map DB product rows ↔ admin form fields (frontend payload shape in lib/products.js).
 */

export const BADGE_COLORS = ["red", "green", "blue"];

export function emptyProductForm() {
  return {
    id: "",
    slug: "",
    name: "",
    product_type: "",
    category_id: "",
    sort_order: 0,
    is_published: false,
    is_featured: false,
    seo_title: "",
    seo_description: "",
    productImage: "",
    layersImage: "",
    price: "",
    tagline: "",
    description: "",
    thickness: "",
    warranty: "",
    usage: "",
    fabric: "",
    specs: "",
    shortSpecs: "",
    badge: "",
    badgeColor: "",
    rating: "",
    reviews: "",
    highlightsText: "",
    layersText: "",
    sizes: [{ name: "King", dimensions: "180 × 200 cm", price: "" }],
  };
}

export function productRowToForm(row) {
  const p = row?.payload && typeof row.payload === "object" ? row.payload : {};
  const sizes =
    Array.isArray(p.sizes) && p.sizes.length > 0
      ? p.sizes.map((s) => ({
          name: s.name || "",
          dimensions: s.dimensions || "",
          price: s.price ?? "",
        }))
      : [{ name: "King", dimensions: "180 × 200 cm", price: p.price ?? "" }];

  return {
    id: row.id || "",
    slug: row.slug || "",
    name: row.name || "",
    product_type: row.product_type || p.type || "",
    category_id: row.category_id || "",
    sort_order: row.sort_order ?? 0,
    is_published: Boolean(row.is_published),
    is_featured: Boolean(row.is_featured),
    seo_title: row.seo_title || "",
    seo_description: row.seo_description || "",
    productImage: p.image || "",
    layersImage: p.layersImage || "",
    price: p.price ?? "",
    tagline: p.tagline || "",
    description: p.description || "",
    thickness: p.thickness || "",
    warranty: p.warranty || "",
    usage: p.usage || "",
    fabric: p.fabric || "",
    specs: p.specs || "",
    shortSpecs: p.shortSpecs || "",
    badge: p.badge || "",
    badgeColor: p.badgeColor || "",
    rating: p.rating ?? "",
    reviews: p.reviews ?? "",
    highlightsText: (p.highlights || []).join("\n"),
    layersText: (p.layers || []).join("\n"),
    sizes,
  };
}

export function formToPayload(form, existingPayload = {}) {
  const sizes = (form.sizes || [])
    .filter((s) => s.name || s.dimensions)
    .map((s) => {
      const dimensions = String(s.dimensions || "").trim();
      const name = String(s.name || "").trim();
      const price = Number(s.price) || Number(form.price) || 0;
      return {
        id: dimensions.replace(/\s/g, "") || name.replace(/\s/g, "") || "size",
        name,
        dimensions,
        price,
      };
    });

  const basePrice = Number(form.price) || sizes[0]?.price || 0;
  const badge = String(form.badge || "").trim();
  const badgeColor = String(form.badgeColor || "").trim();

  const payload = {
    ...existingPayload,
    type: String(form.product_type || "").trim() || existingPayload.type,
    image: String(form.productImage || "").trim() || existingPayload.image,
    layersImage: String(form.layersImage || "").trim() || existingPayload.layersImage,
    thickness: String(form.thickness || "").trim(),
    warranty: String(form.warranty || "").trim(),
    usage: String(form.usage || "").trim(),
    specs: String(form.specs || "").trim(),
    shortSpecs: String(form.shortSpecs || "").trim(),
    tagline: String(form.tagline || "").trim(),
    description: String(form.description || "").trim(),
    price: basePrice,
    rating: form.rating !== "" && form.rating != null ? Number(form.rating) : undefined,
    reviews: form.reviews !== "" && form.reviews != null ? Number(form.reviews) : undefined,
    highlights: String(form.highlightsText || "")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean),
    layers: String(form.layersText || "")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean),
    sizes: sizes.length ? sizes : existingPayload.sizes || [],
    badge: badge || null,
    badgeColor: badge ? badgeColor || "red" : null,
  };

  const fabric = String(form.fabric || "").trim();
  if (fabric) payload.fabric = fabric;
  else delete payload.fabric;

  if (payload.rating == null || Number.isNaN(payload.rating)) delete payload.rating;
  if (payload.reviews == null || Number.isNaN(payload.reviews)) delete payload.reviews;

  return payload;
}
