import { createAdminClient } from "@/lib/supabase/admin";

export async function searchDealers({ city, pincode, limit = 8 } = {}) {
  const db = createAdminClient();
  if (!db) return [];

  let q = db.from("dealers").select("*").eq("is_active", true).order("city");
  if (city) q = q.ilike("city", `%${city}%`);
  if (pincode) q = q.eq("pincode", pincode);

  const { data, error } = await q.limit(limit);
  if (error) {
    console.error("[dealerSearch]", error);
    return [];
  }
  return (data || []).map((d) => ({
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

export function extractCityFromQuestion(question) {
  const q = String(question || "");
  const m = q.match(/\b(?:in|near|at)\s+([A-Za-z][A-Za-z\s]{2,30})/i);
  return m ? m[1].trim() : null;
}
