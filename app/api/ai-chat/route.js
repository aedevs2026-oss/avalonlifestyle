import { NextResponse } from "next/server";
import { runAvalonChat } from "@/lib/ai/answer";
import { getChatConfig } from "@/lib/ai/config";

export async function POST(request) {
  if (!getChatConfig().enabled) {
    return NextResponse.json({ error: "Chat unavailable" }, { status: 503 });
  }

  const body = await request.json().catch(() => ({}));
  const question = String(body.question || "").trim();
  if (!question || question.length > 2000) {
    return NextResponse.json({ error: "Invalid question" }, { status: 400 });
  }

  const result = await runAvalonChat(question, {
    conversationId: body.conversationId,
    debug: false,
  });

  return NextResponse.json({
    conversationId: result.conversationId,
    answer: result.answer,
    intent: result.intent,
    products: result.products,
    comparison: result.comparison,
    dealers: result.dealers,
    handoff: result.handoff,
  });
}
