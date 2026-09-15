import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  dealersWithDistanceLabels,
  getActiveDealers,
  getEmailSettings,
} from "@/lib/data/dealers";
import {
  sendContactNotification,
  sendCustomerConfirmation,
  sendDealerLeadNotification,
} from "@/lib/email/send";

const RATE_LIMIT_MS = 60_000;
const ipHits = new Map();

function rateLimit(ip) {
  const now = Date.now();
  const last = ipHits.get(ip) || 0;
  if (now - last < RATE_LIMIT_MS) return false;
  ipHits.set(ip, now);
  return true;
}

export async function POST(request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests. Try again shortly." }, { status: 429 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const phone = String(body.phone || "").trim();
  const city = String(body.city || "").trim();
  const state = String(body.state || "").trim();
  const pincode = String(body.pincode || "").trim();
  const subject = String(body.subject || "general").trim();
  const message = String(body.message || "").trim();
  const sourcePage = String(body.source_page || body.sourcePage || "").trim();
  const productSlug = String(body.product_slug || "").trim();
  const userLat = body.lat != null ? Number(body.lat) : null;
  const userLng = body.lng != null ? Number(body.lng) : null;

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
  }

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json(
      { error: "Contact service is not configured. Please call us directly." },
      { status: 503 },
    );
  }

  const settings = await getEmailSettings();
  const dealers = await getActiveDealers();

  let lat = userLat;
  let lng = userLng;
  if ((lat == null || lng == null) && typeof body.clientLocation === "object") {
    lat = Number(body.clientLocation.lat);
    lng = Number(body.clientLocation.lng);
  }

  const radiusKm = settings.dealer_search_radius_km ?? 25;
  const suggestionCount = settings.dealer_suggestions_count ?? 3;
  const nearestDealers = dealersWithDistanceLabels(
    dealers,
    lat,
    lng,
    suggestionCount,
    lat != null && lng != null ? radiusKm : null,
  );

  const submission = {
    name,
    email,
    phone,
    city,
    state: state || null,
    pincode: pincode || null,
    subject,
    message,
    product_slug: productSlug || null,
    source_page: sourcePage || null,
    user_lat: lat,
    user_lng: lng,
    nearest_dealers: nearestDealers,
    status: "new",
    notification_log: [],
  };

  const notificationLog = [];

  const { data: row, error } = await admin
    .from("contact_submissions")
    .insert(submission)
    .select("id")
    .single();

  if (error) {
    console.error("[contact]", error);
    return NextResponse.json({ error: "Could not save your message." }, { status: 500 });
  }

  const mainTo = settings.main_email || settings.sales_email;
  const mainResult = await sendContactNotification({
    to: mainTo,
    submission,
    nearestDealers,
  });
  notificationLog.push({ channel: "main_email", to: mainTo, ...mainResult });

  if (settings.sales_email && settings.sales_email !== mainTo) {
    const salesResult = await sendContactNotification({
      to: settings.sales_email,
      submission,
      nearestDealers,
    });
    notificationLog.push({ channel: "sales_email", to: settings.sales_email, ...salesResult });
  }

  if (settings.dealer_notification_enabled) {
    for (const dealer of nearestDealers) {
      if (!dealer.email) continue;
      const dealerResult = await sendDealerLeadNotification({
        to: dealer.email,
        submission,
        distanceLabel: dealer.distanceLabel,
      });
      notificationLog.push({
        channel: "dealer_email",
        to: dealer.email,
        dealer: dealer.name,
        ...dealerResult,
      });
    }
  }

  if (settings.customer_confirmation_enabled) {
    const confirmResult = await sendCustomerConfirmation({ to: email, name });
    notificationLog.push({ channel: "customer_confirmation", to: email, ...confirmResult });
  }

  await admin
    .from("contact_submissions")
    .update({ notification_log: notificationLog })
    .eq("id", row.id);

  return NextResponse.json({
    ok: true,
    id: row.id,
    nearestDealers,
  });
}
