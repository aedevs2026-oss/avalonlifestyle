import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/requireAdminApi";
import {
  indexCompanyAndFaqs,
  reindexAllPublishedProducts,
} from "@/lib/ai/pipeline";

export const maxDuration = 300;

export async function POST() {
  const { response } = await requireAdminApi();
  if (response) return response;

  try {
    const products = await reindexAllPublishedProducts();
    await indexCompanyAndFaqs();
    return NextResponse.json({ ok: true, productsIndexed: products.length });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
