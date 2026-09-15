"use client";

import { useState } from "react";

export default function AiComparisonsAdmin() {
  const [a, setA] = useState("Prince");
  const [b, setB] = useState("King");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function runCompare(e) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/ai-chat/compare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ names: [a, b] }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Comparison failed");
      setResult(null);
      return;
    }
    setResult(json.table);
  }

  return (
    <div className="ai-panel">
      <p className="text-sm text-[var(--admin-muted)] mb-4">
        Comparisons use published product fields only. Missing values show as “Information not available.”
      </p>
      <form onSubmit={runCompare} className="flex flex-wrap gap-2 mb-6">
        <input className="admin-input" value={a} onChange={(e) => setA(e.target.value)} placeholder="Product A" />
        <input className="admin-input" value={b} onChange={(e) => setB(e.target.value)} placeholder="Product B" />
        <button type="submit" className="admin-btn admin-btn-primary">Compare</button>
      </form>
      {error ? <p className="admin-alert-error">{error}</p> : null}
      {result ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Field</th>
                {result.headers.map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row) => (
                <tr key={row.field}>
                  <td>{row.field}</td>
                  {row.values.map((v, i) => (
                    <td key={i}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
