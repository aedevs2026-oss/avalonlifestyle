"use client";

import { useState, useTransition } from "react";
import { deleteBrochure, upsertBrochure } from "@/lib/admin/actions";
import AdminMediaUpload from "@/components/admin/AdminMediaUpload";

const empty = {
  id: "",
  title: "",
  file_url: "",
  file_size_label: "",
  cover_image_url: "",
  description: "",
  kind: "brochure",
  sort_order: 0,
  is_published: true,
};

export default function BrochuresAdmin({ brochures }) {
  const [form, setForm] = useState(empty);
  const [pending, startTransition] = useTransition();

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="admin-card overflow-hidden">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Kind</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {brochures.map((row) => (
              <tr key={row.id}>
                <td>{row.title}</td>
                <td>{row.kind || "brochure"}</td>
                <td>
                  <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setForm({ ...empty, ...row })}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-ghost"
                    onClick={() => startTransition(() => deleteBrochure(row.id))}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          startTransition(async () => {
            await upsertBrochure(form);
            if (!form.id) setForm(empty);
          });
        }}
        className="admin-card admin-card-body space-y-3"
      >
        <h2 className="font-serif text-xl">{form.id ? "Edit brochure" : "Add brochure / catalogue"}</h2>
        <input
          className="admin-input"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <select className="admin-select" value={form.kind || "brochure"} onChange={(e) => setForm({ ...form, kind: e.target.value })}>
          <option value="catalogue">Catalogue</option>
          <option value="brochure">Brochure</option>
          <option value="guide">Guide</option>
          <option value="warranty">Warranty</option>
        </select>
        <textarea
          className="admin-textarea min-h-[72px]"
          placeholder="Description"
          value={form.description || ""}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <AdminMediaUpload
          label="Cover image"
          value={form.cover_image_url}
          onChange={(url) => setForm({ ...form, cover_image_url: url })}
          bucket="catalog-media"
          folder={`brochures/covers/${form.id || "new"}`}
        />
        <AdminMediaUpload
          label="PDF file"
          value={form.file_url}
          onChange={(url) => setForm({ ...form, file_url: url })}
          bucket="brochures"
          folder={`files/${form.id || "new"}`}
          accept="application/pdf"
          showPreview={false}
        />
        <input
          className="admin-input"
          placeholder="Size label (e.g. 12.5 MB)"
          value={form.file_size_label || ""}
          onChange={(e) => setForm({ ...form, file_size_label: e.target.value })}
        />
        <button type="submit" disabled={pending} className="admin-btn admin-btn-primary">
          Save
        </button>
      </form>
    </div>
  );
}
