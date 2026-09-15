/**
 * HTTP smoke test for Ask Avalon (dev server must be running on BASE_URL).
 * Usage: npm run dev &  npm run test:ai-chat
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

const questions = [
  "Compare Prince and King mattresses",
  "Tell me about Avalon",
  "Which mattress suits side sleepers?",
];

async function main() {
  let failed = 0;

  const health = await fetch(`${BASE}/api/ai-chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question: "ping" }),
  }).catch((e) => {
    console.error("Server not reachable at", BASE, e.message);
    process.exit(2);
  });

  if (!health.ok) {
    console.error("API error", health.status, await health.text());
    process.exit(1);
  }

  for (const q of questions) {
    console.log("\n---", q);
    const res = await fetch(`${BASE}/api/ai-chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: q }),
    });
    const json = await res.json();
    if (!res.ok) {
      console.error("FAIL", json);
      failed += 1;
      continue;
    }
    console.log("intent:", json.intent);
    console.log("answer:", String(json.answer).slice(0, 180));
    console.log("products:", json.products?.length ?? 0, "comparison:", Boolean(json.comparison));
    if (!json.answer) failed += 1;
  }

  console.log("\nAdmin test route (expect 401 without login):");
  const adminRes = await fetch(`${BASE}/api/admin/ai-chat/test`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question: questions[0] }),
  });
  console.log("status:", adminRes.status, adminRes.status === 401 ? "(OK — auth required)" : await adminRes.text().then((t) => t.slice(0, 120)));

  process.exit(failed > 0 ? 1 : 0);
}

main();
