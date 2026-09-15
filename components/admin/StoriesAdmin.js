"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { deleteStory, upsertStory } from "@/lib/admin/actions";
import { useAdminCrud } from "@/lib/admin/useAdminCrud";
import AdminFeedback from "@/components/admin/AdminFeedback";
import AdminMediaUpload from "@/components/admin/AdminMediaUpload";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";

const empty = {
  id: "",
  slug: "",
  title: "",
  excerpt: "",
  body: "",
  image_url: "",
  video_url: "",
  category_label: "",
  sort_order: 0,
  is_published: true,
  is_featured: false,
};

function rowToForm(row) {
  return {
    ...empty,
    id: row.id,
    slug: row.slug || "",
    title: row.title || "",
    excerpt: row.excerpt || "",
    body: row.body || "",
    image_url: row.image_url || "",
    video_url: row.video_url || "",
    category_label: row.category_label || "",
    sort_order: row.sort_order ?? 0,
    is_published: row.is_published !== false,
    is_featured: Boolean(row.is_featured),
  };
}

export default function StoriesAdmin({ stories }) {
  const [form, setForm] = useState(empty);
  const { busy, message, error, run, clearFeedback } = useAdminCrud();

  async function submit(e) {
    e.preventDefault();
    const ok = await run(() => upsertStory(form), form.id ? "Story updated." : "Story created.", { fullReload: true });
    if (ok && !form.id) setForm(empty);
  }

  async function remove(id) {
    if (!window.confirm("Delete this story?")) return;
    const ok = await run(() => deleteStory(id), "Story deleted.", { fullReload: true });
    if (ok && form.id === id) setForm(empty);
  }

  return (
    <div className="admin-split-layout">
      <div className="admin-card overflow-hidden">
        <div className="admin-table-toolbar">
          <h3>Editorial stories</h3>
          <button type="button" className="admin-btn admin-btn-accent admin-btn-sm" onClick={() => { setForm(empty); clearFeedback(); }}>
            <Plus size={14} strokeWidth={1.5} />
            New story
          </button>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {stories.map((row) => (
                <tr key={row.id}>
                  <td>{row.title}</td>
                  <td>
                    <AdminStatusBadge published={row.is_published} />
                  </td>
                  <td className="space-x-1 whitespace-nowrap">
                    <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => { setForm(rowToForm(row)); clearFeedback(); }}>
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
      <form onSubmit={submit} className="admin-card admin-form-panel max-h-[calc(100vh-6rem)] overflow-y-auto">
        <div className="admin-card-header">
          <h2>{form.id ? "Edit story" : "New story"}</h2>
        </div>
        <div className="admin-card-body space-y-4">
          <AdminFeedback error={error} message={message} />
          <div>
            <label className="admin-label">Title</label>
            <input className="admin-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <label className="admin-label">Slug (optional)</label>
            <input className="admin-input" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated from title" />
          </div>
          <div>
            <label className="admin-label">Category label</label>
            <input className="admin-input" value={form.category_label} onChange={(e) => setForm({ ...form, category_label: e.target.value })} placeholder="Insights" />
          </div>
          <div>
            <label className="admin-label">Excerpt</label>
            <textarea className="admin-textarea min-h-[72px]" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
          </div>
          <div>
            <label className="admin-label">Body</label>
            <textarea className="admin-textarea min-h-[140px]" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
          </div>
          <AdminMediaUpload label="Hero image" value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} folder={`stories/${form.slug || "new"}`} />
          <div>
            <label className="admin-label">Video URL (optional)</label>
            <input className="admin-input" value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} />
          </div>
          <div>
            <label className="admin-label">Sort order</label>
            <input className="admin-input" type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} />
          </div>
          <label className="admin-checkbox">
            <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
            Published
          </label>
          <label className="admin-checkbox">
            <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} />
            Featured on homepage
          </label>
          <button type="submit" disabled={busy} className="admin-btn admin-btn-primary w-full">
            {busy ? "Saving…" : form.id ? "Update story" : "Create story"}
          </button>
        </div>
      </form>
    </div>
  );
}
