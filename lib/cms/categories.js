import { createAdminClient } from "@/lib/supabase/admin";
import { assets } from "@/lib/assets";

/** Matches Mattresses page filter thumbnails (public folder today). */
export const staticCategoryImages = {
  "All Mattresses": assets.products.prince,
  "Pocket Spring": assets.products.king,
  "Memory Foam": assets.products.celeste,
  Latex: assets.products.brittany,
  "Gel Memory Foam": assets.products.prada,
  "Bonnell Spring": assets.products.elita,
  "Ortho Support": assets.products.magna,
};

/**
 * Map category name → image URL for mattress filter chips.
 * Uses Supabase `categories.image_url` when set, else static `/public` assets.
 */
export async function getCategoryImageMap() {
  const map = { ...staticCategoryImages };
  const admin = createAdminClient();
  if (!admin) return map;

  const { data, error } = await admin
    .from("categories")
    .select("name, image_url")
    .eq("is_active", true);

  if (error || !data) return map;

  for (const row of data) {
    if (row.image_url) {
      map[row.name] = row.image_url;
    }
  }

  return map;
}
