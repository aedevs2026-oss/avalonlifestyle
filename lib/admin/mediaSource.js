/**
 * How image URLs are stored after seed vs future admin uploads.
 * Seed uses site-relative paths under `public/` (e.g. `/products/...`).
 * Admin "Upload to Supabase" stores full Storage URLs.
 */

export function isPublicSitePath(url) {
  if (!url || typeof url !== "string") return false;
  const t = url.trim();
  return t.startsWith("/") && !t.startsWith("//");
}

export function isSupabaseStorageUrl(url) {
  if (!url || typeof url !== "string") return false;
  return /supabase\.co\/storage\//i.test(url);
}

export function mediaSourceLabel(url) {
  if (!url) return "—";
  if (isPublicSitePath(url)) return "Public folder";
  if (isSupabaseStorageUrl(url)) return "Supabase Storage";
  return "URL";
}
