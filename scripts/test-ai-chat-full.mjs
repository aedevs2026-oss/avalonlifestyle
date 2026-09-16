/**
 * Full Ask Avalon API test suite (dev server required).
 * Usage: npm run dev  &&  npm run test:ai-chat:full
 */
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function loadEnv() {
  for (const f of [".env.local", ".env"]) {
    const p = resolve(root, f);
    if (!existsSync(p)) continue;
    for (const line of readFileSync(p, "utf8").split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const i = t.indexOf("=");
      if (i < 0) continue;
      const key = t.slice(0, i).trim();
      if (!process.env[key]) process.env[key] = t.slice(i + 1).trim();
    }
  }
}

loadEnv();

const BASE = process.env.TEST_BASE_URL || "http://localhost:3000";

const results = [];
let passed = 0;
let failed = 0;

function assert(name, ok, detail = "") {
  if (ok) {
    passed += 1;
    results.push({ name, ok: true, detail });
  } else {
    failed += 1;
    results.push({ name, ok: false, detail });
    console.error(`FAIL: ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

function isRawCatalogueDump(answer) {
  const s = String(answer || "");
  return s.includes("### PUBLISHED PRODUCT CATALOGUE") || /\bproduct_id:\s*[0-9a-f-]{36}\b/i.test(s);
}

async function chat(question, extra = {}) {
  const res = await fetch(`${BASE}/api/ai-chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, ...extra }),
  });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, json };
}

async function main() {
  console.log("Ask Avalon full test suite →", BASE);
  console.log("Chat provider (env):", process.env.AI_CHAT_PROVIDER || "(default)");

  try {
    await fetch(BASE);
  } catch (e) {
    console.error("Server not reachable:", e.message);
    process.exit(2);
  }

  // --- Validation ---
  {
    const { status } = await chat("");
    assert("empty question returns 400", status === 400, `got ${status}`);
  }

  {
    const { status, json } = await chat("ping");
    assert("ping returns 200", status === 200);
    assert("ping has answer text", Boolean(json.answer));
    assert("ping not catalogue dump", !isRawCatalogueDump(json.answer));
  }

  // --- Comparison ---
  {
    const { status, json } = await chat("Compare Prince and King mattresses");
    assert("compare HTTP 200", status === 200);
    assert("compare intent", json.intent === "product_comparison", json.intent);
    assert("compare 2 products", json.products?.length === 2, String(json.products?.length));
    assert("compare table headers", json.comparison?.headers?.length === 2);
    const urls = (json.products || []).map((p) => p.productUrl);
    assert("compare product URLs /products/", urls.every((u) => u?.startsWith("/products/")), urls.join(", "));
    assert("compare answer not raw dump", !isRawCatalogueDump(json.answer));
    assert("compare answer present", (json.answer || "").length > 10);
  }

  // --- Dealers ---
  {
    const { json } = await chat("Near Dharmapuri Avalon");
    assert("near dharmapuri avalon intent", json.intent === "dealer_search", json.intent);
    assert("near dharmapuri avalon dealers", (json.dealers?.length ?? 0) >= 1);
    assert("near dharmapuri avalon not NOT_AVAILABLE only", !/^Information not available\./i.test(String(json.answer || "").trim()));
  }

  {
    const { json } = await chat("Dharmapuri Near Dealers");
    assert("dharmapuri intent dealer_search", json.intent === "dealer_search", json.intent);
    assert("dharmapuri has dealers", (json.dealers?.length ?? 0) >= 1);
    const onlyD = (json.dealers || []).every((d) =>
      [d.city, d.address, d.district].some((f) => String(f || "").toLowerCase().includes("dharmapuri")),
    );
    assert("dharmapuri dealers filtered", onlyD, (json.dealers || []).map((d) => d.city).join(", "));
    assert("dharmapuri no catalogue dump", !isRawCatalogueDump(json.answer));
  }

  {
    const { json } = await chat("dealers near Chennai");
    assert("chennai dealers intent", json.intent === "dealer_search");
    assert("chennai has dealers", (json.dealers?.length ?? 0) >= 1);
  }

  {
    const { json } = await chat("Find a dealer");
    assert("find a dealer intent", json.intent === "dealer_search");
    assert("find a dealer lists directory", (json.dealers?.length ?? 0) >= 1);
  }

  {
    const { json } = await chat("Avalon near Salem");
    assert("avalon near salem intent", json.intent === "dealer_search");
    assert("avalon near salem dealers", (json.dealers?.length ?? 0) >= 1);
  }

  {
    const { json } = await chat("dharampuri dealer");
    assert("dharampuri typo intent", json.intent === "dealer_search");
    assert("dharampuri typo finds dealer", (json.dealers?.length ?? 0) >= 1);
  }

  {
    const { json } = await chat("Prince vs King");
    assert("prince vs king compare", json.intent === "product_comparison");
    assert("prince vs king products", json.products?.length === 2);
    assert(
      "prince vs king answer usable",
      Boolean(json.comparison) &&
        (json.answer || "").length > 15 &&
        !isRawCatalogueDump(json.answer) &&
        !/^Information not available\./i.test(String(json.answer || "").trim()),
    );
  }

  // --- Budget ---
  {
    const { json } = await chat("Show mattresses under 25000");
    assert("under 25k intent recommendation/search", ["product_recommendation", "product_search"].includes(json.intent));
    const names = (json.products || []).map((p) => p.name).join(", ");
    assert("under 25k no Prince/King", !/prince|king/i.test(names), names || "none");
    for (const p of json.products || []) {
      if (p.price != null) {
        assert(`under 25k price ${p.name}`, Number(p.price) <= 25000, String(p.price));
      }
    }
    assert("under 25k answer not dump", !isRawCatalogueDump(json.answer));
  }

  {
    const { json } = await chat("under 25k");
    assert("under 25k shorthand", (json.products || []).every((p) => !/prince|king/i.test(p.name)));
  }

  {
    const { json } = await chat("Show mattresses under ₹30000");
    assert("under 30k has products or polite answer", (json.products?.length ?? 0) > 0 || (json.answer || "").length > 20);
    for (const p of json.products || []) {
      if (p.price != null) assert(`under 30k ${p.name}`, Number(p.price) <= 30000, String(p.price));
    }
  }

  // --- Product Q&A intents ---
  {
    const { json } = await chat("What is the warranty on the Prince mattress?");
    assert("warranty intent", json.intent === "warranty_question", json.intent);
    assert("warranty answer", (json.answer || "").length > 5);
  }

  {
    const { json } = await chat("What material is used in the King mattress?");
    assert("material intent", json.intent === "material_question", json.intent);
  }

  {
    const { json } = await chat("Tell me about Avalon Premium Mattress");
    assert("about intent", ["about_avalon", "general_support", "faq"].includes(json.intent), json.intent);
  }

  {
    const { json } = await chat("Recommend a medium firm Avalon mattress");
    assert("recommend intent", json.intent === "product_recommendation", json.intent);
  }

  // --- Tamil / language ---
  {
    const { json } = await chat("Prince mattress warranty enna?", { preferredLanguage: "ta" });
    assert("tamil pref answer length", (json.answer || "").length > 10);
    assert("tamil pref not dump", !isRawCatalogueDump(json.answer));
  }

  {
    const { json } = await chat("₹30,000 kulla nalla mattress recommend pannunga", { preferredLanguage: "auto" });
    assert("tanglish budget intent", json.intent === "product_recommendation", json.intent);
  }

  // --- Handoff ---
  {
    const { json } = await chat("I would like to speak with an Avalon representative");
    assert("handoff intent", json.intent === "human_handoff", json.intent);
    assert("handoff payload", Boolean(json.handoff?.message || json.handoff));
  }

  {
    const { json } = await chat("I want to track my order");
    assert("track order handoff", json.intent === "human_handoff", json.intent);
  }

  {
    const { json } = await chat("furniture sofa");
    assert("furniture intent", json.intent === "furniture_recommendation", json.intent);
    assert("furniture no mattress cards", (json.products?.length ?? 0) === 0, String(json.products?.length));
  }

  {
    const { json } = await chat("best mattress under 15000");
    assert("under 15k has product or clear answer", (json.products?.length ?? 0) > 0 || (json.answer || "").length > 20);
    for (const p of json.products || []) {
      if (p.price != null) assert(`under 15k ${p.name}`, Number(p.price) <= 15000, String(p.price));
    }
  }

  {
    const longQ = "a".repeat(2001);
    const { status } = await chat(longQ);
    assert("overlong question 400", status === 400, String(status));
  }

  // --- Care / technology ---
  {
    const { json } = await chat("How do I care for my Avalon mattress?");
    assert("care intent", json.intent === "care_question", json.intent);
  }

  // --- Admin auth ---
  {
    const adminRes = await fetch(`${BASE}/api/admin/ai-chat/test`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: "Compare Prince and King" }),
    });
    assert("admin test requires auth", adminRes.status === 401, String(adminRes.status));
  }

  // --- Summary ---
  console.log("\n========== SUMMARY ==========");
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  if (failed > 0) {
    console.log("\nFailed checks:");
    for (const r of results.filter((x) => !x.ok)) {
      console.log(" -", r.name, r.detail ? `(${r.detail})` : "");
    }
  }

  const dumpWarnings = results.filter((r) => r.name.includes("dump") && !r.ok);
  if (dumpWarnings.length) {
    console.log("\nTip: Raw catalogue answers usually mean LLM quota (Grok/Gemini). Set AI_CHAT_PROVIDER=huggingface in .env.local.");
  }

  process.exit(failed > 0 ? 1 : 0);
}

main();
