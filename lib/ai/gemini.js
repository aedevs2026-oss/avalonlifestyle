/** Google Gemini API — server-only (GEMINI_API_KEY). */

const BASE = "https://generativelanguage.googleapis.com/v1beta";

export function getGeminiApiKey() {
  return process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";
}

export function isGeminiConfigured() {
  return Boolean(getGeminiApiKey());
}

/**
 * @param {{ system: string, user: string, model: string, temperature?: number }} opts
 * @returns {Promise<string|null>}
 */
export async function geminiChat({ system, user, model, temperature = 0.2 }) {
  const key = getGeminiApiKey();
  if (!key) return null;

  const url = `${BASE}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: system }],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: user }],
        },
      ],
      generationConfig: {
        temperature,
        maxOutputTokens: 1024,
      },
    }),
  });

  if (!res.ok) {
    console.error("[gemini] chat", res.status, await res.text());
    return null;
  }

  const json = await res.json();
  const parts = json.candidates?.[0]?.content?.parts;
  if (!parts?.length) return null;
  return parts.map((p) => p.text || "").join("").trim() || null;
}

/**
 * @param {{ text: string, model?: string }} opts
 * @returns {Promise<number[]|null>}
 */
export async function geminiEmbed({ text, model = "gemini-embedding-001", outputDimensionality = 768 }) {
  const key = getGeminiApiKey();
  if (!key) return null;

  const input = String(text || "").trim();
  if (!input) return null;

  const url = `${BASE}/models/${encodeURIComponent(model)}:embedContent?key=${encodeURIComponent(key)}`;

  const body = {
    model: `models/${model}`,
    content: { parts: [{ text: input }] },
  };
  if (outputDimensionality > 0) {
    body.outputDimensionality = outputDimensionality;
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    console.error("[gemini] embed", res.status, await res.text());
    return null;
  }

  const json = await res.json();
  return json.embedding?.values ?? null;
}
