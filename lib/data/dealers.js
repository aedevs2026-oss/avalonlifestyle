import { createAdminClient } from "@/lib/supabase/admin";
import { dealers as staticDealers } from "@/lib/products";
import { findNearestDealers, formatDistance } from "@/lib/geo";

function mapDbDealer(row) {
  return {
    id: row.legacy_id ?? row.id,
    dbId: row.id,
    dealerCode: row.dealer_code,
    name: row.name,
    contactPerson: row.contact_person,
    address: row.address,
    city: row.city,
    district: row.district,
    state: row.state,
    pincode: row.pincode,
    lat: row.lat,
    lng: row.lng,
    phone: row.phone,
    whatsapp: row.whatsapp,
    email: row.email,
    hoursWeek: row.hours_week,
    hoursSun: row.hours_sun,
    mapsUrl: row.maps_url,
    dealerType: row.dealer_type,
  };
}

/** Dealers for maps, contact suggestions, and find-a-dealer (DB with static fallback). */
export async function getActiveDealers() {
  const admin = createAdminClient();
  if (!admin) {
    return staticDealers;
  }

  const { data, error } = await admin
    .from("dealers")
    .select("*")
    .eq("is_active", true)
    .order("city", { ascending: true });

  if (error || !data?.length) {
    return staticDealers;
  }

  return data.map(mapDbDealer);
}

export async function getEmailSettings() {
  const admin = createAdminClient();
  const fallback = {
    provider: process.env.EMAIL_PROVIDER || "smtp",
    main_email: process.env.MAIN_CONTACT_EMAIL || "theavalonlifestyle@gmail.com",
    sales_email: "",
    dealer_notification_enabled: true,
    customer_confirmation_enabled: true,
    dealer_search_radius_km: 25,
    dealer_suggestions_count: 3,
    smtp_host: process.env.SMTP_HOST || "smtp.gmail.com",
    smtp_port: Number(process.env.SMTP_PORT) || 587,
    smtp_secure: process.env.SMTP_SECURE === "true",
    smtp_user: process.env.SMTP_USER || "",
    from_name: process.env.SMTP_FROM_NAME || "Avalon Premium Mattress",
    from_email: process.env.SMTP_FROM || process.env.MAIN_CONTACT_EMAIL || "theavalonlifestyle@gmail.com",
  };

  if (!admin) return fallback;

  const { data: emailRow } = await admin
    .from("site_settings")
    .select("value")
    .eq("key", "email")
    .maybeSingle();

  const { data: legacyContact } = await admin
    .from("site_settings")
    .select("value")
    .eq("key", "contact")
    .maybeSingle();

  return {
    ...fallback,
    ...(legacyContact?.value || {}),
    ...(emailRow?.value || {}),
  };
}

/** @deprecated use getEmailSettings */
export async function getContactSettings() {
  return getEmailSettings();
}

export function dealersWithDistanceLabels(dealerList, lat, lng, limit, maxRadiusKm = null) {
  return findNearestDealers(dealerList, lat, lng, limit, maxRadiusKm).map((d) => ({
    id: d.id,
    dbId: d.dbId,
    name: d.name,
    address: d.address,
    city: d.city,
    phone: d.phone,
    email: d.email,
    distanceKm: d.distanceKm,
    distanceLabel: formatDistance(d.distanceKm),
  }));
}
