import { readStoredUserLocation } from "@/lib/geo";

/** Best-effort location for dealer matching (stored GPS or live prompt). */
export async function resolveClientLocation() {
  const stored = readStoredUserLocation();
  if (stored) return stored;

  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return null;
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(null),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 600_000 },
    );
  });
}
