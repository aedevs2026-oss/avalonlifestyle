import { randomUUID } from "crypto";
import { getChatConfig, NOT_AVAILABLE } from "@/lib/ai/config";
import { INTENTS, detectIntent } from "@/lib/ai/intents";
import { localizedDealerEmptyMessage, localizedHandoffMessage, resolveReplyLanguage } from "@/lib/ai/language";
import { buildComparisonTable, extractCompareNames, findProductsByNames } from "@/lib/ai/compare";
import { hasStrictProductFilters, passesProductFilters, recommendProducts, productToCard } from "@/lib/ai/recommend";
import {
  extractCityFromQuestion,
  formatDealersAnswer,
  isValidPlaceName,
  looksLikeRawCatalogue,
  normalizePlaceName,
  searchDealers,
} from "@/lib/ai/dealerSearch";
import { createAdminClient } from "@/lib/supabase/admin";
import { buildGroundedContext } from "@/lib/ai/groundedContext";
import { synthesizeGroundedAnswer } from "@/lib/ai/groundedAnswer";
import { productRowToKnowledge } from "@/lib/ai/productKnowledge";

function productRowToCard(p) {
  return productToCard(p, productRowToKnowledge(p, p.categories ? { name: p.categories.name } : null));
}

const HANDOFF_ACTIONS = ["whatsapp", "call", "callback", "find_dealer"];

async function logChat(entry) {
  const db = createAdminClient();
  if (!db) return;
  try {
    await db.from("ai_chat_logs").insert(entry);
  } catch (e) {
    console.error("[ai_chat_logs]", e);
  }
}

const GROUNDED_INTENTS = new Set([
  INTENTS.PRODUCT_RECOMMENDATION,
  INTENTS.PRODUCT_SEARCH,
  INTENTS.PRODUCT_DETAILS,
  INTENTS.WARRANTY_QUESTION,
  INTENTS.CARE_QUESTION,
  INTENTS.MATERIAL_QUESTION,
  INTENTS.TECHNOLOGY_QUESTION,
  INTENTS.FAQ,
  INTENTS.ABOUT_AVALON,
  INTENTS.CATEGORY_SEARCH,
  INTENTS.FURNITURE_RECOMMENDATION,
  INTENTS.GENERAL_SUPPORT,
]);

export async function runAvalonChat(question, { conversationId, debug = false, preferredLanguage = "auto" } = {}) {
  const start = Date.now();
  const convId = conversationId || randomUUID();
  const { intent, filters } = detectIntent(question);
  const replyLang = resolveReplyLanguage(preferredLanguage, question);
  const chatCfg = getChatConfig();

  if (!chatCfg.enabled) {
    return {
      conversationId: convId,
      intent,
      filters,
      answer: "Ask Avalon is temporarily unavailable.",
      products: [],
      chunks: debug ? [] : undefined,
      handoff: null,
    };
  }

  let answer = "";
  let products = [];
  let comparison = null;
  let dealers = [];
  let chunks = [];
  let answerSource = "structured";
  let fallbackUsed = false;
  let handoff = null;

  const grounded = await buildGroundedContext(question, { intent, filters });
  chunks = grounded.chunks;

  if (intent === INTENTS.HUMAN_HANDOFF) {
    handoff = { message: localizedHandoffMessage(replyLang), actions: HANDOFF_ACTIONS };
    answer = handoff.message;
    answerSource = "handoff";
  } else if (intent === INTENTS.PRODUCT_COMPARISON) {
    const names = extractCompareNames(question);
    const matched = await findProductsByNames(names.length ? names : question.split(/\s+/).slice(0, 4));
    if (matched.length < 2) {
      const synth = await synthesizeGroundedAnswer(question, grounded.contextText, {
        intent,
        language: filters.language,
        replyLang,
        filters,
        productCards: products,
      });
      answer = synth.answer;
      answerSource = synth.answerSource;
      fallbackUsed = synth.answerSource === "fallback";
    } else {
      const table = buildComparisonTable(matched.slice(0, 2));
      products = table.products.map((k, i) => productToCard(matched[i], k));
      comparison = table;
      const synth = await synthesizeGroundedAnswer(
        question,
        `${grounded.contextText}\n\nComparison table fields are shown in the chat UI.`,
        { intent, language: filters.language, replyLang, filters, productCards: products },
      );
      answer =
        synth.answer && !looksLikeRawCatalogue(synth.answer)
          ? synth.answer
          : "Here is a side-by-side comparison from our approved catalogue — see the table below for key specs.";
      answerSource = "comparison+llm";
    }
  } else if (intent === INTENTS.DEALER_SEARCH) {
    const rawCity = extractCityFromQuestion(question) || filters.city;
    const city = rawCity && isValidPlaceName(rawCity) ? normalizePlaceName(rawCity) : null;
    dealers = await searchDealers({ city, question });
    const structured = formatDealersAnswer(dealers, { city, replyLang });
    if (!dealers.length) {
      answer = localizedDealerEmptyMessage(replyLang);
      fallbackUsed = true;
      answerSource = "dealers+empty";
    } else {
      const dealerText = dealers
        .map((d) => `${d.name}, ${d.address}, ${d.city}${d.phone ? `, phone: ${d.phone}` : ""}`)
        .join("\n");
      const synth = await synthesizeGroundedAnswer(
        question,
        `### DEALERS (authoritative)\n${dealerText}`,
        { intent, language: filters.language, replyLang, filters, productCards: [] },
      );
      if (synth.answerSource?.endsWith("+grounded") && synth.answer && !looksLikeRawCatalogue(synth.answer)) {
        answer = synth.answer;
        answerSource = "dealers+llm";
      } else {
        answer = structured;
        answerSource = "dealers+structured";
      }
    }
  } else if (GROUNDED_INTENTS.has(intent)) {
    if (intent === INTENTS.FURNITURE_RECOMMENDATION) {
      products = [];
    } else if (
      intent === INTENTS.PRODUCT_RECOMMENDATION ||
      intent === INTENTS.PRODUCT_SEARCH ||
      intent === INTENTS.PRODUCT_DETAILS
    ) {
      const recs = await recommendProducts(filters, 6);
      const ranked = recs.filter((r) => r.score > 0);
      products = ranked.slice(0, 4).map((r) => productToCard(r.product, r.knowledge));
    }
    if (
      !products.length &&
      grounded.focusProducts?.length &&
      !hasStrictProductFilters(filters) &&
      intent !== INTENTS.FURNITURE_RECOMMENDATION
    ) {
      products = grounded.focusProducts.slice(0, 4).map(productRowToCard);
    }
    if (!products.length && grounded.focusProducts?.length && filters.budget_max != null) {
      const withinBudget = grounded.focusProducts.filter((p) => {
        const k = productRowToKnowledge(p, p.categories ? { name: p.categories.name } : null);
        return passesProductFilters(k, filters);
      });
      products = withinBudget.slice(0, 4).map(productRowToCard);
    }

    const synth = await synthesizeGroundedAnswer(question, grounded.contextText, {
      intent,
      language: filters.language,
      replyLang,
      filters,
      productCards: products,
    });
    answer = synth.answer;
    answerSource = synth.answerSource;
    if (looksLikeRawCatalogue(answer)) {
      answer =
        products.length > 0
          ? `Here are some options from our catalogue — see the cards below. For details, open a product or ask about a specific model.`
          : `I could not generate a full reply right now. Try a specific product or dealer question, or visit our website. ${NOT_AVAILABLE}`;
      answerSource = "fallback+sanitized";
      fallbackUsed = true;
    }
    if (answer.includes(NOT_AVAILABLE) || synth.answerSource === "fallback") fallbackUsed = true;
  } else {
    const synth = await synthesizeGroundedAnswer(question, grounded.contextText, {
      intent,
      language: filters.language,
      replyLang,
      filters,
      productCards: products,
    });
    answer = synth.answer;
    answerSource = synth.answerSource;
    if (!answer || synth.answerSource === "fallback") {
      handoff = { message: localizedHandoffMessage(replyLang), actions: HANDOFF_ACTIONS };
      answer = handoff.message;
      fallbackUsed = true;
    }
  }

  const responseTime = Date.now() - start;

  await logChat({
    conversation_id: convId,
    user_question: question,
    detected_intent: intent,
    filters,
    retrieved_product_ids: products.map((p) => p.id).filter(Boolean),
    retrieved_chunk_ids: chunks.map((c) => c.id).filter(Boolean),
    retrieval_score: chunks[0]?.similarity ?? null,
    response_time_ms: responseTime,
    model: chatCfg.model,
    answer_source: answerSource,
    fallback_used: fallbackUsed,
    answer_preview: String(answer).slice(0, 500),
  });

  const result = {
    conversationId: convId,
    intent,
    filters,
    answer,
    products,
    comparison,
    dealers,
    handoff,
    responseTimeMs: responseTime,
    answerSource,
  };

  if (debug) {
    result.chunks = chunks.map((c) => ({
      id: c.id,
      content_type: c.content_type,
      preview: c.content?.slice(0, 200),
      similarity: c.similarity,
      metadata: c.metadata,
    }));
    result.retrievedProducts = products;
    result.contextPreview = grounded.contextText?.slice(0, 1500);
  }

  return result;
}
