import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getContactSettings } from "@/lib/data/dealers";
import { sendDealerApplicationNotification } from "@/lib/email/send";

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

  const application = {
    name: String(body.name || "").trim(),
    business_name: String(body.business || body.business_name || "").trim(),
    email: String(body.email || "").trim(),
    phone: String(body.phone || "").trim(),
    city: String(body.city || "").trim(),
    business_type: String(body.businessType || body.business_type || "").trim(),
    message: String(body.message || "").trim(),
    status: "pending",
  };

  if (!application.name || !application.business_name || !application.email || !application.phone) {
    return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
  }

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json(
      { error: "Enquiry service is not configured. Please email us directly." },
      { status: 503 },
    );
  }

  const { data: row, error } = await admin
    .from("dealer_applications")
    .insert(application)
    .select("id")
    .single();

  if (error) {
    console.error("[dealer-enquiry]", error);
    return NextResponse.json({ error: "Could not submit enquiry." }, { status: 500 });
  }

  const settings = await getContactSettings();
  await sendDealerApplicationNotification({
    to: settings.main_email,
    application,
  });

  return NextResponse.json({ ok: true, id: row.id });
}
