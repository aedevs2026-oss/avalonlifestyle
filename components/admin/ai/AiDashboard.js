"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AiDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("/api/admin/ai-knowledge?stats=1")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  async function reindexAll() {
    await fetch("/api/admin/ai-knowledge/reindex-all", { method: "POST" });
    const s = await fetch("/api/admin/ai-knowledge?stats=1").then((r) => r.json());
    setStats(s);
  }

  const cards = [
    { label: "Documents", value: stats?.totalDocuments },
    { label: "Products (catalogue)", value: stats?.totalProducts },
    { label: "Categories", value: stats?.totalCategories },
    { label: "Chunks", value: stats?.totalChunks },
    { label: "Embeddings", value: stats?.totalEmbeddings },
    { label: "Failed records", value: stats?.failedRecords },
  ];

  return (
    <div className="ai-panel">
      <div className="ai-hero">
        <div>
          <h2 className="ai-hero-title">AI Knowledge Control Center</h2>
          <p className="ai-hero-sub">
            Upload approved Avalon sources, index published products, and verify Ask Avalon before customers use it.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="admin-btn admin-btn-primary" onClick={reindexAll}>
            Re-index all knowledge
          </button>
          <Link href="/admin/ai-knowledge/upload" className="admin-btn admin-btn-secondary">
            Upload knowledge
          </Link>
          <Link href="/admin/ai-knowledge/test" className="admin-btn admin-btn-ghost">
            Open test console
          </Link>
        </div>
      </div>

      <div className="ai-stat-grid">
        {cards.map((c) => (
          <div key={c.label} className="ai-stat-card">
            <span className="ai-stat-label">{c.label}</span>
            <span className="ai-stat-value">{c.value ?? "—"}</span>
          </div>
        ))}
      </div>

      <p className="text-sm text-[var(--admin-muted)] mt-4">
        Last index: {stats?.lastIndexTime ? new Date(stats.lastIndexTime).toLocaleString() : "Not yet indexed"}
      </p>
    </div>
  );
}
