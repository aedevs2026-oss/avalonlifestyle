import { createAdminClient } from "@/lib/supabase/admin";
import { knowledgeToSearchText, productRowToKnowledge } from "@/lib/ai/productKnowledge";
import { vectorSearchChunks } from "@/lib/ai/retrieval";
import { recommendProducts } from "@/lib/ai/recommend";
import { INTENTS } from "@/lib/ai/intents";

export async function fetchPublishedProducts() {
  const db = createAdminClient();
  if (!db) return [];
  const { data, error } = await db
    .from("products")
    .select("*, categories:category_id(name)")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("[groundedContext] products", error);
    return [];
  }
  return data || [];
}

/** Products whose name/slug appears in the user message */
export function matchProductsInQuestion(question, products) {
  const q = String(question || "").toLowerCase();
  const matched = [];
  for (const p of products) {
    const name = String(p.name || "").toLowerCase();
    const slug = String(p.slug || "").toLowerCase().replace(/-/g, " ");
    if (!name) continue;
    if (q.includes(name) || (slug && q.includes(slug))) {
      matched.push(p);
      continue;
    }
    const tokens = name.split(/\s+/).filter((t) => t.length > 3);
    if (tokens.some((t) => q.includes(t))) matched.push(p);
  }
  return matched;
}

function scoreFaqs(question, faqs) {
  const terms = String(question || "")
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 3);
  return (faqs || [])
    .map((f) => {
      const text = `${f.question} ${f.answer}`.toLowerCase();
      const score = terms.reduce((s, t) => s + (text.includes(t) ? 1 : 0), 0);
      return { faq: f, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

export async function buildGroundedContext(question, { intent, filters }) {
  if (intent === INTENTS.DEALER_SEARCH) {
    return {
      contextText:
        "### NOTE\nUse dealer directory data for this question. Do not list mattress products unless the customer asked about products.",
      chunks: [],
      focusProducts: [],
    };
  }

  const products = await fetchPublishedProducts();
  const mentioned = matchProductsInQuestion(question, products);

  let recommended = [];
  if (
    intent === INTENTS.PRODUCT_RECOMMENDATION ||
    intent === INTENTS.PRODUCT_SEARCH ||
    intent === INTENTS.PRODUCT_DETAILS
  ) {
    const recs = await recommendProducts(filters, 6);
    recommended = recs.filter((r) => r.score > 0).map((r) => r.product);
    if (!recommended.length && recs.length) {
      recommended = recs.slice(0, 4).map((r) => r.product);
    }
  }

  const focusMap = new Map();
  for (const p of [...mentioned, ...recommended]) {
    if (p?.id) focusMap.set(p.id, p);
  }
  const defaultSlice =
    intent === INTENTS.FURNITURE_RECOMMENDATION ? [] : products.slice(0, 10);
  const focusProducts = focusMap.size ? [...focusMap.values()] : defaultSlice;

  const catalogBlock = focusProducts
    .map((p) => {
      const k = productRowToKnowledge(p, p.categories ? { name: p.categories.name } : null);
      return `## Product: ${k.product_name}\n${knowledgeToSearchText(k)}`;
    })
    .join("\n\n");

  const chunks = await vectorSearchChunks(question, { limit: 12 });
  const chunkBlock = chunks.length
    ? chunks.map((c, i) => `[Chunk ${i + 1} | ${c.content_type}]\n${c.content}`).join("\n\n")
    : "";

  const db = createAdminClient();
  let companyBlock = "";
  let faqBlock = "";
  if (db) {
    const { data: sections } = await db
      .from("ai_company_knowledge")
      .select("title, body")
      .eq("is_published", true)
      .order("sort_order");
    if (sections?.length) {
      companyBlock = sections.map((s) => `## ${s.title}\n${s.body || ""}`).join("\n\n");
    }

    const { data: faqs } = await db.from("ai_faqs").select("question, answer, category").eq("is_published", true);
    const topFaqs = scoreFaqs(question, faqs);
    if (topFaqs.length) {
      faqBlock = topFaqs.map(({ faq }) => `Q: ${faq.question}\nA: ${faq.answer}`).join("\n\n");
    }
  }

  const parts = [];
  if (catalogBlock) parts.push("### PUBLISHED PRODUCT CATALOGUE (authoritative)\n" + catalogBlock);
  if (faqBlock) parts.push("### APPROVED FAQs\n" + faqBlock);
  if (companyBlock) parts.push("### COMPANY INFORMATION\n" + companyBlock);
  if (chunkBlock) parts.push("### ADDITIONAL APPROVED KNOWLEDGE\n" + chunkBlock);

  if (!parts.length) {
    parts.push(
      "### NOTE\nNo product or knowledge data is indexed yet. Ask the customer to browse /mattresses or contact support.",
    );
  }

  return {
    contextText: parts.join("\n\n---\n\n"),
    chunks,
    focusProducts,
  };
}
