export const INTENTS = {
  PRODUCT_RECOMMENDATION: "product_recommendation",
  PRODUCT_SEARCH: "product_search",
  PRODUCT_DETAILS: "product_details",
  PRODUCT_COMPARISON: "product_comparison",
  CATEGORY_SEARCH: "category_search",
  MATERIAL_QUESTION: "material_question",
  TECHNOLOGY_QUESTION: "technology_question",
  WARRANTY_QUESTION: "warranty_question",
  CARE_QUESTION: "care_question",
  FAQ: "faq",
  ABOUT_AVALON: "about_avalon",
  DEALER_SEARCH: "dealer_search",
  FURNITURE_RECOMMENDATION: "furniture_recommendation",
  GENERAL_SUPPORT: "general_support",
  HUMAN_HANDOFF: "human_handoff",
};

const BUDGET_RE = /(?:₹|rs\.?|inr)\s*([\d,]+(?:\.\d+)?)\s*(k|lakh|lac)?|([\d,]+)\s*(?:k|lakh|lac)\b|under\s*([\d,]+)/i;
const FIRMNESS_RE = /\b(soft|medium[- ]?soft|medium|medium[- ]?firm|firm|extra[- ]?firm)\b/i;

export function detectIntent(question) {
  const q = String(question || "").toLowerCase();
  const filters = extractFilters(question);

  if (/\b(human|agent|representative|callback|speak to someone)\b/.test(q)) {
    return { intent: INTENTS.HUMAN_HANDOFF, filters };
  }
  if (/\b(compare|vs\.?|versus|difference between)\b/.test(q)) {
    return { intent: INTENTS.PRODUCT_COMPARISON, filters };
  }
  if (/\b(dealer|store|showroom|near me|where (can i|to) buy)\b/.test(q)) {
    return { intent: INTENTS.DEALER_SEARCH, filters };
  }
  if (/\b(warranty|guarantee)\b/.test(q)) {
    return { intent: INTENTS.WARRANTY_QUESTION, filters };
  }
  if (/\b(care|clean|maintain)\b/.test(q)) {
    return { intent: INTENTS.CARE_QUESTION, filters };
  }
  if (/\b(about avalon|who is avalon|brand story|mission|vision)\b/.test(q)) {
    return { intent: INTENTS.ABOUT_AVALON, filters };
  }
  if (/\b(furniture|sofa|bed)\b/.test(q) && !/\bmattress\b/.test(q)) {
    return { intent: INTENTS.FURNITURE_RECOMMENDATION, filters };
  }
  if (/\b(faq|frequently)\b/.test(q)) {
    return { intent: INTENTS.FAQ, filters };
  }
  if (/\b(material|fabric|foam|latex|coir)\b/.test(q)) {
    return { intent: INTENTS.MATERIAL_QUESTION, filters };
  }
  if (/\b(technology|pocket spring|memory foam|hr foam)\b/.test(q)) {
    return { intent: INTENTS.TECHNOLOGY_QUESTION, filters };
  }
  if (/\b(category|collection|range)\b/.test(q)) {
    return { intent: INTENTS.CATEGORY_SEARCH, filters };
  }
  if (
    /\b(recommend|suggest|best|suitable|side sleeper|back sleeper|couple|venum|venum|nalla|irukkum)\b/.test(
      q,
    ) ||
    filters.budget_max ||
    filters.firmness
  ) {
    return { intent: INTENTS.PRODUCT_RECOMMENDATION, filters };
  }
  if (/\b(price|cost|how much)\b/.test(q)) {
    return { intent: INTENTS.PRODUCT_DETAILS, filters };
  }
  return { intent: INTENTS.PRODUCT_SEARCH, filters };
}

export function extractFilters(question) {
  const q = String(question || "");
  const filters = {
    category: /\bmattress\b/i.test(q) ? "mattress" : null,
    firmness: null,
    customer_type: null,
    sleeping_position: null,
    budget_max: null,
    language: detectLanguage(q),
  };

  const firm = FIRMNESS_RE.exec(q);
  if (firm) filters.firmness = firm[1].replace(/\s+/g, "-");

  if (/\bcouple\b/i.test(q)) filters.customer_type = "couple";
  if (/\bside sleep/i.test(q)) filters.sleeping_position = "side";
  if (/\bback sleep/i.test(q)) filters.sleeping_position = "back";
  if (/\bstomach sleep/i.test(q)) filters.sleeping_position = "stomach";

  const budget = BUDGET_RE.exec(q);
  if (budget) {
    let num = Number(String(budget[1] || budget[3] || budget[4]).replace(/,/g, ""));
    const unit = (budget[2] || budget[3] || "").toLowerCase();
    if (unit === "k") num *= 1000;
    if (unit === "lakh" || unit === "lac") num *= 100000;
    if (!Number.isNaN(num) && num > 0) filters.budget_max = num;
  }

  return filters;
}

function detectLanguage(q) {
  if (/\b(enakku|entha|irukkum|venum|kulla)\b/i.test(q)) return "tanglish";
  if (/[\u0B80-\u0BFF]/.test(q)) return "ta";
  return "en";
}
