/**
 * Test a chat model for the configured provider (or override).
 * Usage:
 *   node scripts/test-chat-model.mjs
 *   node scripts/test-chat-model.mjs openai/gpt-oss-120b
 *   AI_CHAT_PROVIDER=huggingface node scripts/test-chat-model.mjs openai/gpt-oss-120b:cerebras
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

const modelArg = process.argv[2];
const provider = (process.env.AI_CHAT_PROVIDER || "grok").toLowerCase();
const model = modelArg || process.env.AI_CHAT_MODEL || "grok-4.6";
const prompt = process.argv[3] || "Reply with exactly one word: ok";

console.log("Provider:", provider);
console.log("Model:", model);
console.log("Prompt:", prompt);

async function testXai() {
  const key = process.env.XAI_API_KEY || process.env.GROK_API_KEY;
  if (!key) return { skip: true, reason: "no XAI_API_KEY" };
  const res = await fetch("https://api.x.ai/v1/responses", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model,
      input: [{ role: "user", content: prompt }],
    }),
  });
  const body = await res.text();
  return { status: res.status, body };
}

async function testHuggingface() {
  const key = process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY;
  if (!key) return { skip: true, reason: "no HF_TOKEN" };
  const hfModel = model.includes(":") || model.includes("/") ? model : `openai/${model}:cerebras`;
  const res = await fetch("https://router.huggingface.co/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: hfModel,
      max_tokens: 64,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const body = await res.text();
  return { status: res.status, body, hfModel };
}

function parseXaiText(json) {
  for (const item of json.output || []) {
    if (item.type === "message" && item.role === "assistant") {
      for (const part of item.content || []) {
        if (part.type === "output_text") return part.text;
      }
    }
  }
  return null;
}

let result;
if (provider === "huggingface" || provider === "hf" || model.includes("gpt-oss")) {
  result = await testHuggingface();
  if (result.skip && provider !== "huggingface" && provider !== "hf") {
    console.log("\n[gpt-oss] Not available on xAI — trying Hugging Face:", result.reason);
    result = await testHuggingface();
  }
} else {
  result = await testXai();
}

if (result.skip) {
  console.error("\nSKIP:", result.reason);
  if (model.includes("gpt-oss")) {
    console.error(
      "openai/gpt-oss-120b is hosted on Hugging Face Inference, not xAI Grok.\n" +
        "Add HF_TOKEN to .env.local and run:\n" +
        "  AI_CHAT_PROVIDER=huggingface AI_CHAT_MODEL=openai/gpt-oss-120b:cerebras node scripts/test-chat-model.mjs",
    );
  }
  process.exit(2);
}

console.log("\nHTTP", result.status);
if (result.hfModel) console.log("HF model id:", result.hfModel);

if (result.status >= 200 && result.status < 300) {
  try {
    const json = JSON.parse(result.body);
    const text =
      json.choices?.[0]?.message?.content ||
      parseXaiText(json) ||
      JSON.stringify(json).slice(0, 200);
    console.log("Reply:", text);
    console.log("\nOK");
    process.exit(0);
  } catch {
    console.log(result.body.slice(0, 500));
  }
}

console.log(result.body.slice(0, 800));
process.exit(1);
