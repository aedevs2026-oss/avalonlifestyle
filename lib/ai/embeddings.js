import { getEmbeddingConfig, isEmbeddingConfigured } from "@/lib/ai/config";
import { geminiEmbed } from "@/lib/ai/gemini";

/**
 * @param {string} text
 * @returns {Promise<number[]|null>}
 */
export async function embedText(text) {
  const input = String(text || "").trim();
  if (!input || !isEmbeddingConfigured()) return null;

  const { provider, model, ollamaBaseUrl, openaiApiKey } = getEmbeddingConfig();

  if (provider === "gemini") {
    const { dimension } = getEmbeddingConfig();
    return geminiEmbed({ text: input, model, outputDimensionality: dimension });
  }

  if (provider === "openai") {
    const res = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model, input }),
    });
    if (!res.ok) {
      console.error("[embeddings] openai", await res.text());
      return null;
    }
    const json = await res.json();
    return json.data?.[0]?.embedding ?? null;
  }

  if (provider === "ollama") {
    const res = await fetch(`${ollamaBaseUrl.replace(/\/$/, "")}/api/embeddings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, prompt: input }),
    });
    if (!res.ok) {
      console.error("[embeddings] ollama", await res.text());
      return null;
    }
    const json = await res.json();
    return json.embedding ?? null;
  }

  return null;
}

export async function embedBatch(texts, { batchSize = 8 } = {}) {
  const out = [];
  for (let i = 0; i < texts.length; i += batchSize) {
    const slice = texts.slice(i, i + batchSize);
    const batch = await Promise.all(slice.map((t) => embedText(t)));
    out.push(...batch);
  }
  return out;
}

/** pgvector insert format */
export function vectorToPg(embedding) {
  if (!embedding?.length) return null;
  return `[${embedding.join(",")}]`;
}
