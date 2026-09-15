"use client";

import { useState } from "react";

export default function AiProductsSync({ products = [] }) {
  const [status, setStatus] = useState("");

  async function reindexProduct(id) {
    setStatus("Indexing…");
    const res = await fetch(`/api/admin/ai-knowledge/${id}/reindex`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: id }),
    });
    const json = await res.json();
    setStatus(res.ok ? `Indexed ${json.chunkCount ?? 0} chunks` : json.error);
  }

  return (
    <div className="ai-panel">
      <p className="text-sm text-[var(--admin-muted)] mb-4">
        Product knowledge is built from published catalogue rows only. Unpublished products are excluded from chatbot retrieval.
      </p>
      {status ? <p className="admin-alert-info mb-4">{status}</p> : null}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Published</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.slug}</td>
                <td>{p.is_published ? "Yes" : "No"}</td>
                <td>
                  <button type="button" className="admin-btn admin-btn-sm" disabled={!p.is_published} onClick={() => reindexProduct(p.id)}>
                    Re-index product
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
