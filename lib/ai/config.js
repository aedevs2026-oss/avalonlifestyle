/** Server-only AI / embedding configuration (no secrets to client). */

import { isGeminiConfigured } from "@/lib/ai/gemini";

export function getEmbeddingConfig() {
  const provider = (process.env.EMBEDDING_PROVIDER || (isGeminiConfigured() ? "gemini" : "none")).toLowerCase();
  return {
    provider,
    model: process.env.EMBEDDING_MODEL || (provider === "gemini" ? "gemini-embedding-001" : "nomic-embed-text"),
    dimension: Number(process.env.EMBEDDING_DIMENSION || 768),
    ollamaBaseUrl: process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434",
    openaiApiKey: process.env.OPENAI_API_KEY || "",
  };
}

export function getChatConfig() {
  const provider = (process.env.AI_CHAT_PROVIDER || (isGeminiConfigured() ? "gemini" : "rules")).toLowerCase();
  return {
    provider,
    model:
      process.env.AI_CHAT_MODEL ||
      (provider === "gemini" ? "gemini-3.6-flash" : provider === "openai" ? "gpt-4o-mini" : "llama3.2"),
    ollamaBaseUrl: process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434",
    openaiApiKey: process.env.OPENAI_API_KEY || "",
    enabled: process.env.AI_KNOWLEDGE_ENABLED !== "false",
    maxContextChunks: Number(process.env.AI_MAX_CONTEXT_CHUNKS || 10),
  };
}

export function isEmbeddingConfigured() {
  const c = getEmbeddingConfig();
  if (c.provider === "none" || c.provider === "off") return false;
  if (c.provider === "gemini") return isGeminiConfigured();
  if (c.provider === "openai") return Boolean(c.openaiApiKey);
  if (c.provider === "ollama") return Boolean(c.ollamaBaseUrl);
  return false;
}

export function isChatLlmConfigured() {
  const c = getChatConfig();
  if (c.provider === "rules") return false;
  if (c.provider === "gemini") return isGeminiConfigured();
  if (c.provider === "openai") return Boolean(c.openaiApiKey);
  if (c.provider === "ollama") return Boolean(c.ollamaBaseUrl);
  return false;
}

export const AI_UPLOAD = {
  maxBytes: 50 * 1024 * 1024,
  allowedExt: new Set([
    "pdf",
    "docx",
    "xlsx",
    "csv",
    "txt",
    "json",
    "jpg",
    "jpeg",
    "png",
    "webp",
  ]),
};

export const NOT_AVAILABLE = "Information not available.";
