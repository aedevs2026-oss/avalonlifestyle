import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/requireAdminApi";
import { createAdminClient } from "@/lib/supabase/admin";
import { processDocumentStep, indexProductById } from "@/lib/ai/pipeline";

export const maxDuration = 120;

export async function POST(request, context) {
  const { response } = await requireAdminApi();
  if (response) return response;

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "SUPABASE_NOT_CONFIGURED" }, { status: 503 });

  const body = await request.json().catch(() => ({}));
  const productId = body.productId;

  if (productId) {
    try {
      const result = await indexProductById(productId);
      return NextResponse.json({ ok: true, ...result });
    } catch (e) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }

  const { id: documentId } = await context.params;
  try {
    const result = await processDocumentStep(documentId);
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
