"use client";

import { useState, useTransition } from "react";
import { deleteProduct, upsertProduct } from "@/lib/admin/actions";
import AdminMediaUpload from "@/components/admin/AdminMediaUpload";

const empty = {
  id: "",
  slug: "",
  name: "",
  product_type: "",
  category_id: "",
  sort_order: 0,
  is_published: false,
  is_featured: false,
  seo_title: "",
  seo_description: "",
  productImage: "",
  layersImage: "",
  payloadJson: "{}",
};

export default function ProductsAdmin({ products, categories }) {
  const [form, setForm] = useState(empty);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  function edit(row) {
    setForm({
      id: row.id,
      slug: row.slug,
      name: row.name,
      product_type: row.product_type || "",
      category_id: row.category_id || "",
      sort_order: row.sort_order || 0,
      is_published: row.is_published,
      is_featured: row.is_featured,
      seo_title: row.seo_title || "",
      seo_description: row.seo_description || "",
      productImage: row.payload?.image || "",
      layersImage: row.payload?.layersImage || "",
      payloadJson: JSON.stringify(row.payload || {}, null, 2),
    });
  }

  function submit(e) {
    e.preventDefault();
    setMessage("");
    startTransition(async () => {
      try {
        const payload = JSON.parse(form.payloadJson || "{}");
        if (form.productImage) payload.image = form.productImage;
        if (form.layersImage) payload.layersImage = form.layersImage;
        await upsertProduct({
          ...form,
          payloadJson: JSON.stringify(payload, null, 2),
        });
        setMessage("Saved.");
        if (!form.id) setForm(empty);
      } catch (err) {
        setMessage(err.message || "Save failed.");
      }
    });
  }

  function remove(id) {
    if (!window.confirm("Delete this product?")) return;
    startTransition(async () => {
      await deleteProduct(id);
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <div className="admin-card overflow-hidden">
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
            {products.map((row) => (
              <tr key={row.id}>
                <td>{row.name}</td>
                <td className="text-[var(--admin-muted)]">{row.slug}</td>
                <td>{row.is_published ? "Yes" : "No"}</td>
                <td className="space-x-2 whitespace-nowrap">
                  <button type="button" className="admin-btn admin-btn-ghost" onClick={() => edit(row)}>
                    Edit
                  </button>
                  <button type="button" className="admin-btn admin-btn-ghost" onClick={() => remove(row.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form onSubmit={submit} className="admin-card admin-card-body space-y-3">
        <h2 className="font-serif text-xl">{form.id ? "Edit product" : "Add product"}</h2>
        {message ? <p className="text-sm text-[var(--admin-gold)]">{message}</p> : null}
        <div>
          <label className="admin-label">Name</label>
          <input className="admin-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div>
          <label className="admin-label">Slug</label>
          <input className="admin-input" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
        </div>
        <div>
          <label className="admin-label">Type</label>
          <input className="admin-input" value={form.product_type} onChange={(e) => setForm({ ...form, product_type: e.target.value })} />
        </div>
        <div>
          <label className="admin-label">Category</label>
          <select className="admin-select" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
            <option value="">—</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="admin-label">Sort order</label>
          <input className="admin-input" type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
          Published on website
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} />
          Featured (home slider)
        </label>
        <input className="admin-input" placeholder="SEO title" value={form.seo_title} onChange={(e) => setForm({ ...form, seo_title: e.target.value })} />
        <textarea className="admin-textarea min-h-[80px]" placeholder="SEO description" value={form.seo_description} onChange={(e) => setForm({ ...form, seo_description: e.target.value })} />
        <AdminMediaUpload
          label="Catalog main image"
          value={form.productImage}
          onChange={(url) => setForm({ ...form, productImage: url })}
          folder={`products/${form.slug || "new"}`}
        />
        <AdminMediaUpload
          label="Layers / cutaway image"
          value={form.layersImage}
          onChange={(url) => setForm({ ...form, layersImage: url })}
          folder={`products/${form.slug || "new"}/layers`}
        />
        <div>
          <label className="admin-label">Payload (JSON — price, specs; images sync from uploads above)</label>
          <textarea className="admin-textarea font-mono text-xs" value={form.payloadJson} onChange={(e) => setForm({ ...form, payloadJson: e.target.value })} />
        </div>
        <button type="submit" disabled={pending} className="admin-btn admin-btn-primary">
          {pending ? "Saving…" : "Save product"}
        </button>
      </form>
    </div>
  );
}
