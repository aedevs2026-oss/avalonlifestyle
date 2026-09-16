import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/requireAdminApi";
import { runAvalonChat } from "@/lib/ai/answer";

export async function POST(request) {
  const { response } = await requireAdminApi();
  if (response) return response;

  const body = await request.json().catch(() => ({}));
  const question = String(body.question || "").trim();
  if (!question) return NextResponse.json({ error: "question required" }, { status: 400 });

  const preferredLanguage = ["en", "ta", "auto"].includes(body.preferredLanguage) ? body.preferredLanguage : "auto";

  const result = await runAvalonChat(question, {
    conversationId: body.conversationId,
    debug: true,
    preferredLanguage,
  });

  return NextResponse.json(result);
}
