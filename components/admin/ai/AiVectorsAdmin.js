"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AiVectorsAdmin() {
  const [chunks, setChunks] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch(`/api/admin/ai-knowledge/chunks?page=${page}`)
      .then((r) => r.json())
      .then((j) => {
        setChunks(j.chunks || []);
        setTotal(j.total || 0);
      });
  }, [page]);

  return (
    <div className="ai-panel">
      <p className="text-sm text-[var(--admin-muted)] mb-4">
        {total} indexed chunks. Inspect metadata and disable sources from Upload or Products pages.
      </p>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Source</th>
              <th>Type</th>
              <th>Preview</th>
              <th>Status</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {chunks.map((c) => (
              <tr key={c.id}>
                <td>
                  {c.metadata?.product_name || c.metadata?.source_file || c.document_id || c.product_id || "—"}
                </td>
                <td>{c.content_type}</td>
                <td className="max-w-[280px] truncate">{c.content}</td>
                <td>{c.is_enabled ? "Active" : "Disabled"}</td>
                <td>{c.updated_at ? new Date(c.updated_at).toLocaleString() : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex gap-2 mt-4">
        <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          Previous
        </button>
        <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => setPage((p) => p + 1)}>
          Next
        </button>
        <Link href="/admin/ai-knowledge" className="admin-btn admin-btn-sm">Back to dashboard</Link>
      </div>
    </div>
  );
}
