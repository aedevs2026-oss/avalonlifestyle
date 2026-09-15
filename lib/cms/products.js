import { createAdminClient } from "@/lib/supabase/admin";
import {
  products as staticProducts,
  mattressCollectionOrder as staticOrder,
} from "@/lib/products";

/** Map DB row → exact frontend product shape used by ProductCard / ProductDetailClient. */
export function mapRowToFrontendProduct(row) {
  const payload = row.payload && typeof row.payload === "object" ? row.payload : {};
  return {
    ...payload,
    slug: row.slug,
    name: row.name,
    type: row.product_type ?? payload.type,
    _dbId: row.id,
    _isFeatured: row.is_featured,
    _seoTitle: row.seo_title,
    _seoDescription: row.seo_description,
  };
}

export async function fetchPublishedProducts() {
  const admin = createAdminClient();
  if (!admin) return null;

  const { data, error } = await admin
    .from("products")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error || !data?.length) return null;
  return data.map(mapRowToFrontendProduct);
}

export async function getProductsForSite() {
  const fromDb = await fetchPublishedProducts();
  if (fromDb?.length) return fromDb;
  return staticProducts;
}

export async function getProductBySlugForSite(slug) {
  const list = await getProductsForSite();
  return list.find((p) => p.slug === slug) ?? null;
}

export async function getMattressCollectionOrder() {
  const fromDb = await fetchPublishedProducts();
  if (fromDb?.length) {
    const featured = fromDb.filter((p) => p._isFeatured).map((p) => p.slug);
    if (featured.length) return featured;
    return fromDb.map((p) => p.slug);
  }
  return staticOrder;
}

export async function getMattressCategoriesForSite() {
  const admin = createAdminClient();
  if (!admin) {
    const { mattressCategories } = await import("@/lib/products");
    return mattressCategories;
  }

  const { data } = await admin
    .from("categories")
    .select("name")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (!data?.length) {
    const { mattressCategories } = await import("@/lib/products");
    return mattressCategories;
  }

  return ["All Mattresses", ...data.map((c) => c.name)];
}
