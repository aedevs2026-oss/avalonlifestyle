"use client";

import { useState } from "react";

const SAMPLES = [
  "Which mattress is suitable for side sleepers?",
  "Compare Prince and King.",
  "What warranty does this mattress have?",
  "Tell me about Avalon.",
  "Show mattresses under ₹30,000.",
  "Enakku medium firm mattress venum.",
];

export default function AiChatTestConsole() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function ask(q) {
    const text = (q || question).trim();
    if (!text) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/ai-chat/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Request failed");
      setResult(json);
      setQuestion(text);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ai-panel ai-test-console">
      <div className="flex flex-wrap gap-2 mb-4">
        {SAMPLES.map((s) => (
          <button key={s} type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => ask(s)}>
            {s}
          </button>
        ))}
      </div>

      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          ask();
        }}
      >
        <input
          className="admin-input flex-1"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a test question…"
        />
        <button type="submit" className="admin-btn admin-btn-primary" disabled={loading}>
          {loading ? "…" : "Send"}
        </button>
      </form>

      {error ? <p className="admin-alert-error mt-4">{error}</p> : null}

      {result ? (
        <div className="ai-test-pipeline mt-6">
          <section>
            <h3>User question</h3>
            <p>{question}</p>
          </section>
          <section>
            <h3>Detected intent</h3>
            <pre>{result.intent}</pre>
          </section>
          <section>
            <h3>Filters</h3>
            <pre>{JSON.stringify(result.filters, null, 2)}</pre>
          </section>
          <section>
            <h3>Retrieved products</h3>
            <pre>{JSON.stringify(result.retrievedProducts || result.products, null, 2)}</pre>
          </section>
          <section>
            <h3>Retrieved chunks</h3>
            <pre>{JSON.stringify(result.chunks, null, 2)}</pre>
          </section>
          <section>
            <h3>Final answer</h3>
            <p className="ai-answer">{result.answer}</p>
            <p className="text-xs text-[var(--admin-muted)]">
              Source: {result.answerSource} · {result.responseTimeMs}ms
            </p>
          </section>
        </div>
      ) : null}
    </div>
  );
}
