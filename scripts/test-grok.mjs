/**
 * Smoke test xAI Grok (loads .env.local). Usage: node scripts/test-grok.mjs
 */
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

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

const key = process.env.XAI_API_KEY || process.env.GROK_API_KEY;
const model = process.env.AI_CHAT_MODEL || "grok-4.6";

if (!key) {
  console.error("Set XAI_API_KEY in .env.local");
  process.exit(2);
}

const res = await fetch("https://api.x.ai/v1/responses", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${key}`,
  },
  body: JSON.stringify({
    model,
    input: [
      { role: "system", content: "Reply in one short sentence." },
      { role: "user", content: "Say hello from Ask Avalon test." },
    ],
  }),
});

const body = await res.text();
console.log("HTTP", res.status);
if (!res.ok) {
  console.log(body);
  process.exit(1);
}

const json = JSON.parse(body);
let text = "";
for (const item of json.output || []) {
  if (item.type === "message" && item.role === "assistant") {
    for (const part of item.content || []) {
      if (part.type === "output_text") text += part.text;
    }
  }
}
console.log("Reply:", text || "(no text parsed)");
console.log("OK");
