"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { deleteBrochure, upsertBrochure } from "@/lib/admin/actions";
import { useAdminCrud } from "@/lib/admin/useAdminCrud";
import AdminFeedback from "@/components/admin/AdminFeedback";
import AdminMediaUpload from "@/components/admin/AdminMediaUpload";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";

const empty = {
  id: "",
  title: "",
  file_url: "",
  file_size_label: "",
  cover_image_url: "",
  description: "",
  kind: "brochure",
  category_label: "",
  version: "",
  sort_order: 0,
  is_published: true,
};

export default function BrochuresAdmin({ brochures }) {
  const [form, setForm] = useState(empty);
  const { busy, message, error, run, clearFeedback } = useAdminCrud();

  async function submit(e) {
    e.preventDefault();
    const ok = await run(() => upsertBrochure(form), form.id ? "Download updated." : "Download created.", { fullReload: true });
    if (ok && !form.id) setForm(empty);
  }

  async function remove(id) {
    if (!window.confirm("Delete this brochure?")) return;
    const ok = await run(() => deleteBrochure(id), "Brochure deleted.", { fullReload: true });
    if (ok && form.id === id) setForm(empty);
  }

  return (
    <div className="admin-split-layout">
      <div className="admin-card overflow-hidden">
        <div className="admin-table-toolbar">
          <h3>Brochures & catalogues</h3>
          <button type="button" className="admin-btn admin-btn-accent admin-btn-sm" onClick={() => { setForm(empty); clearFeedback(); }}>
            <Plus size={14} strokeWidth={1.5} />
            New download
          </button>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Kind</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {brochures.map((row) => (
                <tr key={row.id}>
                  <td>{row.title}</td>
                  <td>{row.kind || "brochure"}</td>
                  <td>
                    <AdminStatusBadge published={row.is_published} />
                  </td>
                  <td className="space-x-1 whitespace-nowrap">
                    <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => { setForm({ ...empty, ...row }); clearFeedback(); }}>
                      Edit
                    </button>
                    <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => remove(row.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <form onSubmit={submit} className="admin-card admin-form-panel">
        <div className="admin-card-header">
          <h2>{form.id ? "Edit download" : "New download"}</h2>
        </div>
        <div className="admin-card-body space-y-4">
          <AdminFeedback error={error} message={message} />
          <div>
            <label className="admin-label">Title</label>
            <input className="admin-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <label className="admin-label">Kind</label>
            <select className="admin-select" value={form.kind || "brochure"} onChange={(e) => setForm({ ...form, kind: e.target.value })}>
              <option value="catalogue">Catalogue</option>
              <option value="brochure">Brochure</option>
              <option value="guide">Guide</option>
              <option value="warranty">Warranty</option>
            </select>
          </div>
          <div className="admin-form-grid admin-form-grid-2">
            <div>
              <label className="admin-label">Category label</label>
              <input className="admin-input" value={form.category_label || ""} onChange={(e) => setForm({ ...form, category_label: e.target.value })} />
            </div>
            <div>
              <label className="admin-label">Version</label>
              <input className="admin-input" value={form.version || ""} onChange={(e) => setForm({ ...form, version: e.target.value })} placeholder="2024" />
            </div>
          </div>
          <div>
            <label className="admin-label">Description</label>
            <textarea className="admin-textarea min-h-[72px]" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <AdminMediaUpload label="Cover image" value={form.cover_image_url} onChange={(url) => setForm({ ...form, cover_image_url: url })} folder={`brochures/covers/${form.id || "new"}`} />
          <AdminMediaUpload label="PDF file" value={form.file_url} onChange={(url) => setForm({ ...form, file_url: url })} bucket="brochures" folder={`files/${form.id || "new"}`} accept="application/pdf" showPreview={false} />
          <div>
            <label className="admin-label">File size label</label>
            <input className="admin-input" value={form.file_size_label || ""} onChange={(e) => setForm({ ...form, file_size_label: e.target.value })} placeholder="12.5 MB" />
          </div>
          <div>
            <label className="admin-label">Sort order</label>
            <input className="admin-input" type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} />
          </div>
          <label className="admin-checkbox">
            <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
            Published on Resources page
          </label>
          <button type="submit" disabled={busy} className="admin-btn admin-btn-primary w-full">
            {busy ? "Saving…" : form.id ? "Update download" : "Create download"}
          </button>
        </div>
      </form>
    </div>
  );
}
