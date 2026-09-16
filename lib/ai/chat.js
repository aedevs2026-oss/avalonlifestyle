import { getChatConfig } from "@/lib/ai/config";
import { geminiChat } from "@/lib/ai/gemini";
import { grokChat } from "@/lib/ai/grok";
import { huggingfaceChat } from "@/lib/ai/huggingface";

/**
 * Provider-agnostic chat completion for Ask Avalon.
 * @param {{ system: string, user: string, temperature?: number }} opts
 */
export async function chatComplete({ system, user, temperature = 0.25 }) {
  const { provider, model, ollamaBaseUrl, openaiApiKey } = getChatConfig();

  if (provider === "grok") {
    return grokChat({ system, user, model, temperature });
  }
  if (provider === "huggingface" || provider === "hf") {
    return huggingfaceChat({ system, user, model, temperature });
  }
  if (provider === "gemini") {
    return geminiChat({ system, user, model, temperature });
  }
  if (provider === "openai" && openaiApiKey) {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature,
        max_tokens: 1024,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });
    if (!res.ok) {
      console.error("[openai] chat", res.status, await res.text());
      return null;
    }
    const json = await res.json();
    return json.choices?.[0]?.message?.content?.trim() || null;
  }
  if (provider === "ollama" && ollamaBaseUrl) {
    const res = await fetch(`${ollamaBaseUrl.replace(/\/$/, "")}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        stream: false,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });
    if (!res.ok) {
      console.error("[ollama] chat", res.status, await res.text());
      return null;
    }
    const json = await res.json();
    return json.message?.content?.trim() || null;
  }

  return null;
}
