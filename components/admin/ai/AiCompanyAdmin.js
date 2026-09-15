"use client";

import { useState } from "react";
import { deleteAiCompanySection, upsertAiCompanySection } from "@/lib/admin/aiKnowledgeActions";
import AdminFeedback from "@/components/admin/AdminFeedback";

const SECTION_HINTS = [
  { key: "about", title: "About Avalon" },
  { key: "brand_story", title: "Brand story" },
  { key: "tagline", title: "Tagline" },
  { key: "warranty_policy", title: "Warranty policy" },
  { key: "delivery", title: "Delivery information" },
  { key: "support", title: "Customer support" },
];

export default function AiCompanyAdmin({ initialSections = [] }) {
  const [form, setForm] = useState({
    section_key: "about",
    title: "",
    body: "",
    language: "en",
    is_published: false,
    sort_order: 0,
  });
  const [msg, setMsg] = useState({ type: "", text: "" });

  function loadHint(h) {
    const existing = initialSections.find((s) => s.section_key === h.key);
    setForm(
      existing || {
        section_key: h.key,
        title: h.title,
        body: "",
        language: "en",
        is_published: false,
        sort_order: 0,
      },
    );
  }

  async function save(e) {
    e.preventDefault();
    try {
      await upsertAiCompanySection(form);
      setMsg({ type: "success", text: "Company knowledge saved." });
      window.location.reload();
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    }
  }

  return (
    <div className="ai-panel">
      <AdminFeedback message={msg.type === "success" ? msg.text : ""} error={msg.type === "error" ? msg.text : ""} />
      <p className="text-sm text-[var(--admin-muted)] mb-4">
        Enter only verified Avalon content. Official tagline: “Better Sleep. A Brighter Tomorrow.” — publish only when approved.
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {SECTION_HINTS.map((h) => (
          <button key={h.key} type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => loadHint(h)}>
            {h.title}
          </button>
        ))}
      </div>
      <form onSubmit={save} className="admin-card">
        <div className="admin-card-body space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="admin-label">Section key</label>
              <input className="admin-input" value={form.section_key} onChange={(e) => setForm({ ...form, section_key: e.target.value })} required />
            </div>
            <div>
              <label className="admin-label">Title</label>
              <input className="admin-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
          </div>
          <div>
            <label className="admin-label">Body</label>
            <textarea className="admin-input min-h-[160px]" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
            Published for chatbot
          </label>
          <button type="submit" className="admin-btn admin-btn-primary">Save section</button>
        </div>
      </form>
    </div>
  );
}
