"use client";

import { useState, useTransition } from "react";
import { deleteCategory, upsertCategory } from "@/lib/admin/actions";
import AdminMediaUpload from "@/components/admin/AdminMediaUpload";

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
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="admin-card overflow-hidden">
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
                <td className="max-w-[140px] truncate text-[var(--admin-muted)]">
                  {row.image_url ? "Supabase / URL" : "Public default"}
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
      <form onSubmit={submit} className="admin-card admin-card-body space-y-3">
        <h2 className="font-serif text-xl">{form.id ? "Edit category" : "Add category"}</h2>
        <p className="text-xs text-[var(--admin-muted)]">
          Filter image appears on the Mattresses page category bar. Upload replaces the current public folder image.
        </p>
        <input
          className="admin-input"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="admin-input"
          placeholder="Slug"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          required
        />
        <textarea
          className="admin-textarea"
          placeholder="Description"
          value={form.description || ""}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
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
        <button type="submit" disabled={pending} className="admin-btn admin-btn-primary">
          Save
        </button>
      </form>
    </div>
  );
}
