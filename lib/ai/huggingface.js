/** Hugging Face Inference Providers (OpenAI-compatible) — server-only */

const CHAT_URL = "https://router.huggingface.co/v1/chat/completions";

export function getHfApiKey() {
  return process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY || "";
}

export function isHuggingfaceConfigured() {
  return Boolean(getHfApiKey());
}

/**
 * @param {{ system: string, user: string, model: string, temperature?: number }} opts
 * @returns {Promise<string|null>}
 */
export async function huggingfaceChat({ system, user, model, temperature = 0.2 }) {
  const key = getHfApiKey();
  if (!key) return null;

  const res = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
      temperature,
      max_tokens: 1024,
      messages: [
        { role: "system", content: String(system || "").trim() },
        { role: "user", content: String(user || "").trim() },
      ],
    }),
  });

  const raw = await res.text();
  if (!res.ok) {
    console.error("[huggingface] chat", res.status, raw.slice(0, 500));
    return null;
  }

  try {
    const json = JSON.parse(raw);
    return json.choices?.[0]?.message?.content?.trim() || null;
  } catch (e) {
    console.error("[huggingface] parse", e);
    return null;
  }
}
