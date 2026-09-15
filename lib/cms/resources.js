import { createAdminClient } from "@/lib/supabase/admin";
import { assets } from "@/lib/assets";

const staticDownloads = [
  { title: "Product Catalogue 2024", size: "12.5 MB", image: assets.products.prince, file_url: null },
  { title: "Mattress Collection Brochure", size: "8.2 MB", image: assets.products.king, file_url: null },
  { title: "Furniture Collection Brochure", size: "6.4 MB", image: assets.home.sofa, file_url: null },
  { title: "Materials & Technology Guide", size: "4.2 MB", image: assets.mattresses.detail, file_url: null },
  { title: "Warranty Information", size: "2.1 MB", image: assets.home.manufacturing, file_url: null },
];

export async function getResourceDownloads() {
  const admin = createAdminClient();
  if (!admin) return staticDownloads;

  const { data, error } = await admin
    .from("brochures")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error || !data?.length) return staticDownloads;

  return data.map((row) => ({
    id: row.id,
    title: row.title,
    size: row.file_size_label || "",
    image: row.cover_image_url || assets.products.prince,
    file_url: row.file_url,
    description: row.description,
    kind: row.kind,
  }));
}
