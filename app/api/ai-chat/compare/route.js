import { NextResponse } from "next/server";
import { buildComparisonTable, extractCompareNames, findProductsByNames } from "@/lib/ai/compare";
import { productToCard } from "@/lib/ai/recommend";
import { productRowToKnowledge } from "@/lib/ai/productKnowledge";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const question = body.question || "";
  const names = body.names || extractCompareNames(question);
  const matched = await findProductsByNames(names);
  if (matched.length < 2) {
    return NextResponse.json({ error: "Need two matching published products" }, { status: 404 });
  }
  const table = buildComparisonTable(matched.slice(0, 2));
  const products = matched.slice(0, 2).map((p, i) => productToCard(p, productRowToKnowledge(p, p.categories)));
  return NextResponse.json({ table, products });
}
