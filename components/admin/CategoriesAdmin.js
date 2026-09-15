"use client";

import { useState, useTransition } from "react";
import { deleteCategory, upsertCategory } from "@/lib/admin/actions";
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
  const [pending, startTransition] = useTransition();

  function submit(e) {
    e.preventDefault();
    startTransition(async () => {
      await upsertCategory(form);
      if (!form.id) setForm(empty);
    });
  }

  return (
    <div className="admin-split-layout">
      <div className="admin-card overflow-hidden">
        <div className="admin-table-toolbar">
          <h3>Mattress categories</h3>
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
                <td>
                  <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setForm({ ...empty, ...row })}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-ghost"
                    onClick={() => startTransition(() => deleteCategory(row.id))}
                  >
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
          <h2>{form.id ? "Edit category" : "Add category"}</h2>
        </div>
        <div className="admin-card-body space-y-4">
        <p className="text-xs text-[var(--admin-muted)]">
          After <code className="text-[10px]">npm run seed</code>, thumbnails use paths from the{" "}
          <code className="text-[10px]">public/</code> folder (e.g. <code className="text-[10px]">/products/…</code>).
          Use &quot;Upload to Supabase&quot; when you are ready to host images in Storage instead.
        </p>
        <div>
          <label className="admin-label">Name</label>
          <input
            className="admin-input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="admin-label">Slug</label>
          <input
            className="admin-input"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="admin-label">Description</label>
          <textarea
            className="admin-textarea"
            value={form.description || ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <AdminMediaUpload
          label="Category thumbnail (Mattresses filters)"
          value={form.image_url}
          onChange={(url) => setForm({ ...form, image_url: url })}
          folder={`categories/${form.slug || "new"}`}
        />
        <AdminMediaUpload
          label="Banner image (optional)"
          value={form.banner_url}
          onChange={(url) => setForm({ ...form, banner_url: url })}
          folder={`categories/${form.slug || "new"}/banners`}
        />
        <button type="submit" disabled={pending} className="admin-btn admin-btn-primary w-full">
          Save category
        </button>
        </div>
      </form>
    </div>
  );
}
