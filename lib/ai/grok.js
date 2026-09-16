/** xAI Grok — server-only (XAI_API_KEY). Uses POST /v1/responses */

const BASE = "https://api.x.ai/v1";

export function getXaiApiKey() {
  return process.env.XAI_API_KEY || process.env.GROK_API_KEY || "";
}

export function isGrokConfigured() {
  return Boolean(getXaiApiKey());
}

/**
 * @param {unknown} json
 * @returns {string|null}
 */
export function parseGrokResponseText(json) {
  if (!json || typeof json !== "object") return null;
  const chunks = [];

  for (const item of json.output || []) {
    if (item?.type !== "message" || item.role !== "assistant") continue;
    for (const part of item.content || []) {
      if (part?.type === "output_text" && part.text) chunks.push(part.text);
      else if (typeof part === "string") chunks.push(part);
      else if (part?.text) chunks.push(part.text);
    }
  }

  if (!chunks.length && typeof json.output_text === "string") {
    chunks.push(json.output_text);
  }

  const text = chunks.join("").trim();
  return text || null;
}

/**
 * @param {{ system: string, user: string, model: string, temperature?: number }} opts
 * @returns {Promise<string|null>}
 */
export async function grokChat({ system, user, model, temperature = 0.2 }) {
  const key = getXaiApiKey();
  if (!key) return null;

  const input = [
    { role: "system", content: String(system || "").trim() },
    { role: "user", content: String(user || "").trim() },
  ];

  const res = await fetch(`${BASE}/responses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
      input,
      temperature,
      max_output_tokens: 1024,
    }),
  });

  const raw = await res.text();
  if (!res.ok) {
    console.error("[grok] chat", res.status, raw.slice(0, 500));
    return null;
  }

  try {
    const json = JSON.parse(raw);
    return parseGrokResponseText(json);
  } catch (e) {
    console.error("[grok] parse", e);
    return null;
  }
}
