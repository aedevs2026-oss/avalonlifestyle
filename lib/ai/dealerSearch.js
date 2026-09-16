import { createAdminClient } from "@/lib/supabase/admin";

export async function searchDealers({ city, question, pincode, limit = 8 } = {}) {
  const db = createAdminClient();
  if (!db) return [];

  let place = String(city || (question ? extractCityFromQuestion(question) : "") || "").trim();
  place = normalizePlaceName(place);
  if (!isValidPlaceName(place)) place = "";

  let q = db.from("dealers").select("*").eq("is_active", true).order("city");
  if (pincode) q = q.eq("pincode", pincode);

  const fetchLimit = place ? 50 : limit;
  const { data, error } = await q.limit(fetchLimit);
  if (error) {
    console.error("[dealerSearch]", error);
    return [];
  }

  let rows = data || [];
  if (place) {
    const norm = place.toLowerCase();
    rows = rows.filter((d) => {
      const hay = [d.city, d.district, d.address, d.name].map((x) => String(x || "").toLowerCase());
      return hay.some((h) => h.includes(norm));
    });
  }

  return rows.slice(0, limit).map((d) => ({
    id: d.id,
    name: d.name,
    address: d.address,
    city: d.city,
    district: d.district,
    state: d.state,
    pincode: d.pincode,
    phone: d.phone,
    whatsapp: d.whatsapp,
    email: d.email,
    mapsUrl: d.maps_url,
    hoursWeek: d.hours_week,
    hoursSun: d.hours_sun,
  }));
}

const PLACE_ALIASES = {
  dharampuri: "dharmapuri",
  dharmpuri: "dharmapuri",
  dharampur: "dharmapuri",
  dharampuir: "dharmapuri",
};

const PLACE_STOP_WORDS = new Set([
  "find",
  "show",
  "get",
  "search",
  "locate",
  "list",
  "nearest",
  "buy",
  "where",
  "a",
  "an",
  "the",
  "my",
]);

export function normalizePlaceName(place) {
  const raw = String(place || "").replace(/\s+/g, " ").trim();
  if (!raw) return "";
  const key = raw.toLowerCase().replace(/[^a-z]/g, "");
  if (PLACE_ALIASES[key]) return PLACE_ALIASES[key];
  const first = raw.split(/\s+/)[0]?.toLowerCase();
  if (PLACE_STOP_WORDS.has(first) && raw.split(/\s+/).length <= 2) return "";
  return raw;
}

export function isValidPlaceName(place) {
  const n = normalizePlaceName(place);
  if (!n || n.length < 3) return false;
  const first = n.toLowerCase().split(/\s+/)[0];
  if (PLACE_STOP_WORDS.has(first)) return false;
  return true;
}

export function extractCityFromQuestion(question) {
  const q = String(question || "").trim();
  if (!q) return null;

  const clean = (s) =>
    normalizePlaceName(
      String(s || "")
        .replace(/\s+/g, " ")
        .replace(/\b(near|dealers?|showrooms?|stores?|me|avalon(?:\s+lifestyle)?|premium\s+mattress)\b/gi, "")
        .trim(),
    );

  // "Dharmapuri Near Dealers" / "Salem near dealer"
  let m = q.match(/^([A-Za-z][A-Za-z\s-]{1,40}?)\s+near\s+(?:dealer|dealers|showroom|store)s?\b/i);
  if (m) return clean(m[1]);

  m = q.match(
    /\b(?:in|near|at)\s+([A-Za-z][A-Za-z\s-]{1,40}?)(?:\s*,|\s+(?:dealer|dealers|showroom|store)s?\b|\s+avalon\b|[?.!]|$)/i,
  );
  if (m) return clean(m[1]);

  // "Near Dharmapuri Avalon" / "Avalon near Salem"
  m = q.match(/\bnear\s+([A-Za-z][A-Za-z\s-]{1,30}?)(?:\s+avalon\b)/i);
  if (m) return clean(m[1]);

  m = q.match(/\bavalon\s+(?:near|in|at)\s+([A-Za-z][A-Za-z\s-]{1,30}?)\b/i);
  if (m) return clean(m[1]);

  m = q.match(/\b(?:dealer|dealers|showroom|store)s?\s+(?:in|near|at)\s+([A-Za-z][A-Za-z\s-]{1,40}?)\b/i);
  if (m) return clean(m[1]);

  // "Dharmapuri dealers" (city before dealers, no "near")
  m = q.match(/^([A-Za-z][A-Za-z\s-]{1,40}?)\s+(?:dealer|dealers|showroom|store)s?\b/i);
  if (m) return clean(m[1]);

  return null;
}

/** User-facing dealer list when LLM is unavailable or for dealer intent. */
export function formatDealersAnswer(dealers, { city, replyLang = "en" } = {}) {
  const place = city ? city.replace(/\s+/g, " ").trim() : null;
  if (!dealers?.length) {
    if (replyLang === "ta") {
      return place
        ? `${place} அருகில் அங்கீகரிக்கப்பட்ட dealer விவரங்கள் எங்கள் பட்டியலில் இல்லை. Find a Dealer பக்கம் அல்லது support-ஐ தொடர்பு கொள்ளுங்கள்.`
        : "உங்கள் கேள்விக்கு பொருந்தும் dealer விவரங்கள் எங்கள் பட்டியலில் இல்லை.";
    }
    return place
      ? `I do not have approved dealers listed for ${place} in our directory. Try Find a Dealer on our website or contact customer support.`
      : "I do not have dealer locations matching that query in our approved directory.";
  }

  const intro =
    replyLang === "ta"
      ? place
        ? `${place} அருகிலுள்ள Avalon dealerகள்:`
        : "Avalon dealerகள்:"
      : place
        ? `Here are Avalon dealers near ${place}:`
        : "Here are Avalon dealers from our directory:";

  const lines = dealers.map((d) => {
    const phone = d.phone ? ` — ${d.phone}` : "";
    return `• ${d.name}: ${d.address}, ${d.city}${phone}`;
  });

  return [intro, ...lines].join("\n");
}

function looksLikeRawCatalogue(text) {
  const s = String(text || "");
  return s.includes("### PUBLISHED PRODUCT CATALOGUE") || /\bproduct_id:\s*[0-9a-f-]{36}\b/i.test(s);
}

export function isDealerContextDump(text) {
  return String(text || "").includes("### DEALERS");
}

export { looksLikeRawCatalogue };
