import { useSyncExternalStore } from "react";

export const WISHLIST_STORAGE_KEY = "avalon-wishlist";

export function readWishlistSlugs() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((s) => typeof s === "string" && s.length > 0)
      : [];
  } catch {
    return [];
  }
}

export function writeWishlistSlugs(slugs) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(slugs));
    window.dispatchEvent(new CustomEvent("avalon-wishlist-change"));
  } catch {
    /* private mode / quota */
  }
}

export function isInWishlist(slug) {
  return readWishlistSlugs().includes(slug);
}

export function toggleWishlistSlug(slug) {
  const current = readWishlistSlugs();
  const exists = current.includes(slug);
  const next = exists ? current.filter((s) => s !== slug) : [...current, slug];
  writeWishlistSlugs(next);
  return !exists;
}

function subscribeWishlist(onStoreChange) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("avalon-wishlist-change", onStoreChange);
  return () => window.removeEventListener("avalon-wishlist-change", onStoreChange);
}

/** SSR-safe wishlist membership (false on server / initial hydration). */
export function useWishlistContains(slug) {
  return useSyncExternalStore(
    subscribeWishlist,
    () => isInWishlist(slug),
    () => false,
  );
}
