/**
 * Great-circle distance between two WGS84 points (km).
 */
export function haversineKm(lat1, lon1, lat2, lon2) {
  const toRad = (d) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistance(km) {
  if (km == null || Number.isNaN(km)) return "";
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

/** Rough city driving estimate for “20–25 mins” style copy. */
export function estimateTravelTimeRange(km) {
  if (km == null || Number.isNaN(km)) return "";
  const minutes = (km / 32) * 60;
  const low = Math.max(5, Math.round(minutes * 0.85));
  const high = Math.max(low + 2, Math.round(minutes * 1.2));
  return `${low}–${high} mins`;
}

export function findNearestDealer(dealerList, lat, lng) {
  let nearest = null;
  let minKm = Infinity;

  for (const dealer of dealerList) {
    if (dealer.lat == null || dealer.lng == null) continue;
    const km = haversineKm(lat, lng, dealer.lat, dealer.lng);
    if (km < minKm) {
      minKm = km;
      nearest = dealer;
    }
  }

  if (!nearest) return null;
  return { dealer: nearest, distanceKm: minKm };
}

export const USER_LOCATION_STORAGE_KEY = "avalon-user-location";
export const NEAR_STORE_SESSION_KEY = "avalon-near-store-session";

export function readStoredUserLocation() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_LOCATION_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (
      typeof data?.lat !== "number" ||
      typeof data?.lng !== "number" ||
      typeof data?.ts !== "number"
    ) {
      return null;
    }
    const ageMs = Date.now() - data.ts;
    if (ageMs > 7 * 24 * 60 * 60 * 1000) return null;
    return { lat: data.lat, lng: data.lng };
  } catch {
    return null;
  }
}

export function storeUserLocation(lat, lng) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      USER_LOCATION_STORAGE_KEY,
      JSON.stringify({ lat, lng, ts: Date.now() }),
    );
  } catch {
    /* quota / private mode */
  }
}
