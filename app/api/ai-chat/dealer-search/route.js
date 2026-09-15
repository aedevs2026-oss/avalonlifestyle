import { NextResponse } from "next/server";
import { extractCityFromQuestion, searchDealers } from "@/lib/ai/dealerSearch";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const city = body.city || extractCityFromQuestion(body.question || "");
  const dealers = await searchDealers({ city, pincode: body.pincode, limit: body.limit || 8 });
  return NextResponse.json({ dealers });
}
