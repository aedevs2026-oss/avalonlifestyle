import { getChatConfig, NOT_AVAILABLE } from "@/lib/ai/config";

import { isChatLlmConfigured } from "@/lib/ai/config";

import { chatComplete } from "@/lib/ai/chat";

import { ASK_AVALON_SYSTEM } from "@/lib/ai/prompts";

import { replyLanguageInstruction } from "@/lib/ai/language";



function toPlainChatText(text) {
  return String(text || "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/^\s*#{1,6}\s+/gm, "")
    .replace(/^\s*[-*]\s+\*\*/gm, "- ")
    .trim();
}

function formatInr(amount) {

  const n = Number(amount);

  if (Number.isNaN(n)) return String(amount);

  return `₹${n.toLocaleString("en-IN")}`;

}



function buildAnswerHints({ intent, filters, productCards } = {}) {

  const lines = [];



  if (filters?.budget_max != null) {

    const cap = formatInr(filters.budget_max);

    lines.push(`Customer asked for mattresses at or under ${cap} only.`);

    const names = (productCards || []).map((p) => p.name).filter(Boolean);

    if (names.length) {

      lines.push(`Only discuss these catalogue picks (all within budget): ${names.join(", ")}.`);

    } else {

      lines.push(

        `No products were selected within ${cap}. Tell the customer clearly that none of the published models in your context are at or under ${cap}. Do not mention Prince, King, or other models above the budget. Suggest browsing the catalogue or contacting support. You may include "${NOT_AVAILABLE}" if needed.`,

      );

    }

  }



  if (intent === "product_comparison") {

    lines.push(

      "This is a product comparison: keep it brief and conversational. The comparison table is already shown in the chat UI — your text should add a short summary, not repeat every field.",

    );

  }



  if (intent === "product_recommendation" || intent === "product_search") {

    lines.push("Recommend at most 2–3 options unless the customer asked for a list.");

  }



  return lines.length ? `EXTRA INSTRUCTIONS:\n${lines.join("\n")}` : "";

}



/**

 * Synthesize an answer from approved context using Gemini (or plain context fallback).

 */

export async function synthesizeGroundedAnswer(

  question,

  contextText,

  { intent, language = "en", replyLang, filters, productCards } = {},

) {

  const lang = replyLang || language;

  const trimmed = String(contextText || "").trim();

  if (!trimmed) {

    return {

      answer: `I could not find approved Avalon information for that question. ${NOT_AVAILABLE}`,

      answerSource: "fallback",

    };

  }



  const hints = buildAnswerHints({ intent, filters, productCards });



  const userBlock = `Detected intent: ${intent || "general"}

${replyLanguageInstruction(lang)}

${hints ? `${hints}\n` : ""}

APPROVED CONTEXT:

${trimmed}



CUSTOMER QUESTION:

${question}`;



  if (isChatLlmConfigured()) {

    const { provider } = getChatConfig();

    const answer = await chatComplete({
      system: ASK_AVALON_SYSTEM,
      user: userBlock,
      temperature: 0.25,
    });

    if (answer) {
      return { answer: toPlainChatText(answer), answerSource: `${provider}+grounded` };
    }

  }



  return {
    answer: fallbackAnswerFromContext(trimmed, intent),
    answerSource: "context_only",
  };
}

function fallbackAnswerFromContext(trimmed, intent) {
  if (trimmed.includes("### DEALERS")) {
    const body = trimmed
      .replace(/^#+\s*DEALERS[^\n]*\n/i, "")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .slice(0, 12)
      .join("\n");
    if (body) {
      return `Here are dealers from our directory:\n${body}`;
    }
  }

  if (trimmed.includes("PUBLISHED PRODUCT CATALOGUE") || /\bproduct_id:\s*[0-9a-f-]{36}\b/i.test(trimmed)) {
    return `I could not finish a full reply right now. Please use the product cards in chat if shown, or visit Find a Dealer / our catalogue on the website. ${NOT_AVAILABLE}`;
  }

  if (intent === "dealer_search") {
    return `Please use Find a Dealer on our website for showroom locations. ${NOT_AVAILABLE}`;
  }

  const short = trimmed.replace(/^#+\s+/gm, "").slice(0, 400);
  return short.length > 80
    ? `${short}…`
    : `I could not generate a full reply right now. ${NOT_AVAILABLE}`;
}


