import { NextResponse } from "next/server";
import { detectIntent } from "@/lib/ai/intents";
import { recommendProducts, productToCard } from "@/lib/ai/recommend";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const question = String(body.question || "");
  const { filters } = detectIntent(question);
  const recs = await recommendProducts({ ...filters, ...body.filters }, body.limit || 5);
  return NextResponse.json({
    products: recs.map((r) => productToCard(r.product, r.knowledge)),
    filters,
  });
}
