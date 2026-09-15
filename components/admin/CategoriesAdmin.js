"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { deleteCategory, upsertCategory } from "@/lib/admin/actions";
import { useAdminCrud } from "@/lib/admin/useAdminCrud";
import AdminFeedback from "@/components/admin/AdminFeedback";
import AdminMediaUpload from "@/components/admin/AdminMediaUpload";
import { mediaSourceLabel } from "@/lib/admin/mediaSource";

const empty = {
  id: "",
  slug: "",
  name: "",
  description: "",
  image_url: "",
  banner_url: "",
  sort_order: 0,
  is_active: true,
};

export default function CategoriesAdmin({ categories }) {
  const [form, setForm] = useState(empty);
  const { busy, message, error, run, clearFeedback } = useAdminCrud();

  function startNew() {
    setForm(empty);
    clearFeedback();
  }

  async function submit(e) {
    e.preventDefault();
    const ok = await run(() => upsertCategory(form), form.id ? "Category updated." : "Category created.", { fullReload: true });
    if (ok && !form.id) setForm(empty);
  }

  async function remove(id) {
    if (!window.confirm("Delete this category?")) return;
    const ok = await run(() => deleteCategory(id), "Category deleted.", { fullReload: true });
    if (ok && form.id === id) setForm(empty);
  }

  return (
    <div className="admin-split-layout">
      <div className="admin-card overflow-hidden">
        <div className="admin-table-toolbar">
          <h3>Mattress categories</h3>
          <button type="button" className="admin-btn admin-btn-accent admin-btn-sm" onClick={startNew}>
            <Plus size={14} strokeWidth={1.5} />
            New category
          </button>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Image</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {categories.map((row) => (
                <tr key={row.id}>
                  <td>{row.name}</td>
                  <td className="max-w-[200px] text-[var(--admin-muted)]">
                    <span className="text-xs">{mediaSourceLabel(row.image_url)}</span>
                    {row.image_url ? (
                      <div className="truncate text-[10px] opacity-80" title={row.image_url}>
                        {row.image_url}
                      </div>
                    ) : null}
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
          <h2>{form.id ? "Edit category" : "New category"}</h2>
        </div>
        <div className="admin-card-body space-y-4">
          <AdminFeedback error={error} message={message} />
          <div>
            <label className="admin-label">Name</label>
            <input className="admin-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="admin-label">Slug</label>
            <input className="admin-input" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
          </div>
          <div>
            <label className="admin-label">Sort order</label>
            <input className="admin-input" type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} />
          </div>
          <label className="admin-checkbox">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
            Active on website
          </label>
          <div>
            <label className="admin-label">Description</label>
            <textarea className="admin-textarea" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <AdminMediaUpload label="Category thumbnail" value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} folder={`categories/${form.slug || "new"}`} />
          <AdminMediaUpload label="Banner (optional)" value={form.banner_url} onChange={(url) => setForm({ ...form, banner_url: url })} folder={`categories/${form.slug || "new"}/banners`} />
          <button type="submit" disabled={busy} className="admin-btn admin-btn-primary w-full">
            {busy ? "Saving…" : form.id ? "Update category" : "Create category"}
          </button>
        </div>
      </form>
    </div>
  );
}
