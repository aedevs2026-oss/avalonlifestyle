import { randomUUID } from "crypto";
import { getChatConfig, NOT_AVAILABLE } from "@/lib/ai/config";
import { INTENTS, detectIntent } from "@/lib/ai/intents";
import { vectorSearchChunks } from "@/lib/ai/retrieval";
import { buildComparisonTable, extractCompareNames, findProductsByNames } from "@/lib/ai/compare";
import { recommendProducts, productToCard } from "@/lib/ai/recommend";
import { extractCityFromQuestion, searchDealers } from "@/lib/ai/dealerSearch";
import { createAdminClient } from "@/lib/supabase/admin";
import { geminiChat } from "@/lib/ai/gemini";

const HANDOFF = {
  message:
    "I want to make sure you get the right information. Would you like to speak with an Avalon representative?",
  actions: ["whatsapp", "call", "callback", "find_dealer"],
};

async function logChat(entry) {
  const db = createAdminClient();
  if (!db) return;
  try {
    await db.from("ai_chat_logs").insert(entry);
  } catch (e) {
    console.error("[ai_chat_logs]", e);
  }
}

async function generateWithModel(system, user, context) {
  const { provider, model, ollamaBaseUrl, openaiApiKey } = getChatConfig();
  const userPrompt = `${context ? `Approved context:\n${context}\n\n` : ""}Question: ${user}\n\nAnswer using ONLY the approved context. Never invent prices, warranty, specs, or dealers. If missing, say "${NOT_AVAILABLE}".`;

  if (provider === "gemini") {
    return geminiChat({
      system,
      user: userPrompt,
      model,
      temperature: 0.2,
    });
  }

  if (provider === "openai" && openaiApiKey) {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: `${context}\n\nQuestion: ${user}` },
        ],
        temperature: 0.2,
      }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.choices?.[0]?.message?.content || null;
  }

  if (provider === "ollama") {
    const res = await fetch(`${ollamaBaseUrl.replace(/\/$/, "")}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        stream: false,
        messages: [
          { role: "system", content: system },
          { role: "user", content: prompt },
        ],
      }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.message?.content || null;
  }

  return null;
}

export async function runAvalonChat(question, { conversationId, debug = false } = {}) {
  const start = Date.now();
  const convId = conversationId || randomUUID();
  const { intent, filters } = detectIntent(question);
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

  if (intent === INTENTS.HUMAN_HANDOFF) {
    handoff = HANDOFF;
    answer = HANDOFF.message;
    answerSource = "handoff";
  } else if (intent === INTENTS.PRODUCT_COMPARISON) {
    const names = extractCompareNames(question);
    const matched = await findProductsByNames(names.length ? names : question.split(/\s+/).slice(0, 4));
    if (matched.length < 2) {
      answer =
        "I could not find two matching published Avalon products to compare. Please use exact product names from our catalogue.";
      fallbackUsed = true;
    } else {
      const table = buildComparisonTable(matched.slice(0, 2));
      products = table.products.map((k, i) => productToCard(matched[i], k));
      comparison = table;
      answer = "Here is a side-by-side comparison from our approved catalogue.";
      answerSource = "comparison";
    }
  } else if (intent === INTENTS.DEALER_SEARCH) {
    const city = extractCityFromQuestion(question) || filters.city;
    dealers = await searchDealers({ city });
    if (!dealers.length) {
      answer =
        "I do not have dealer locations matching that query in our approved directory. Try Find a Dealer on our website or contact customer support.";
      fallbackUsed = true;
    } else {
      answer = "Here are Avalon dealers from our directory.";
      answerSource = "dealers";
    }
  } else if (intent === INTENTS.ABOUT_AVALON) {
    const db = createAdminClient();
    let sections = [];
    if (db) {
      const { data } = await db
        .from("ai_company_knowledge")
        .select("title, body")
        .eq("is_published", true)
        .order("sort_order");
      sections = data || [];
    }
    if (sections?.length) {
      answer = sections.map((s) => `${s.title}\n${s.body || ""}`.trim()).join("\n\n");
      answerSource = "company";
    } else {
      chunks = await vectorSearchChunks(question, { limit: 6, sourceType: "company" });
      answer = chunks.length
        ? chunks.map((c) => c.content).join("\n\n")
        : `Avalon Premium Mattress — Better Sleep. A Brighter Tomorrow. ${NOT_AVAILABLE} for detailed company information until it is added in Admin → AI Knowledge → Avalon Information.`;
      if (!chunks.length) fallbackUsed = true;
      answerSource = chunks.length ? "vector" : "fallback";
    }
  } else if (intent === INTENTS.PRODUCT_RECOMMENDATION || intent === INTENTS.PRODUCT_SEARCH) {
    const recs = await recommendProducts(filters, 4);
    products = recs.map((r) => productToCard(r.product, r.knowledge));
    if (!products.length) {
      answer = "I do not have enough published product information to recommend models yet. Please check our mattresses catalogue.";
      fallbackUsed = true;
    } else {
      answer = "Based on your requirements, these Avalon mattresses are the closest matches from our approved catalogue.";
      answerSource = "recommendation";
    }
  } else if (intent === INTENTS.FAQ) {
    chunks = await vectorSearchChunks(question, { limit: 5, sourceType: "faq" });
    answer = chunks.length ? chunks.map((c) => c.content).join("\n\n") : NOT_AVAILABLE;
    if (!chunks.length) fallbackUsed = true;
    answerSource = chunks.length ? "faq" : "fallback";
  } else {
    chunks = await vectorSearchChunks(question, { limit: chatCfg.maxContextChunks });
    const context = chunks.map((c) => c.content).join("\n\n");
    const system =
      "You are Ask Avalon, a helpful assistant for Avalon Premium Mattress. Use ONLY approved context. Never invent prices, warranty, specs, or dealers.";

    const modelAnswer = await generateWithModel(system, question, context);
    if (modelAnswer) {
      answer = modelAnswer;
      answerSource = "model+retrieval";
    } else if (context) {
      answer = context.slice(0, 2500);
      answerSource = "vector";
    } else {
      answer = `I could not find approved information for that question. ${NOT_AVAILABLE}`;
      handoff = HANDOFF;
      fallbackUsed = true;
      answerSource = "fallback";
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
  }

  return result;
}
