"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import { Search, Plus } from "lucide-react";
import { deleteProduct, upsertProduct } from "@/lib/admin/actions";
import AdminMediaUpload from "@/components/admin/AdminMediaUpload";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";

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

function formatPrice(payload) {
  if (!payload?.price) return null;
  try {
    return `₹ ${Number(payload.price).toLocaleString("en-IN")}`;
  } catch {
    return null;
  }
}

export default function ProductsAdmin({ products, categories }) {
  const [form, setForm] = useState(empty);
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.slug?.toLowerCase().includes(q) ||
        p.product_type?.toLowerCase().includes(q),
    );
  }, [products, query]);

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
    <div className="admin-split-layout">
      <div className="admin-card overflow-hidden">
        <div className="admin-table-toolbar">
          <h3>Product catalogue</h3>
          <div className="relative w-full max-w-xs">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-muted-soft)]"
              size={16}
              strokeWidth={1.5}
            />
            <input
              className="admin-input pl-9"
              placeholder="Search name, slug, type…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Filter products"
            />
          </div>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Type</th>
                <th>Status</th>
                <th>Price</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="admin-empty">No products match your search.</div>
                  </td>
                </tr>
              ) : (
                filtered.map((row) => {
                  const img = row.payload?.image;
                  const price = formatPrice(row.payload);
                  return (
                    <tr key={row.id}>
                      <td>
                        <div className="admin-product-row">
                          <div className="admin-product-thumb">
                            {img ? (
                              <Image src={img} alt="" fill className="object-contain p-1" unoptimized />
                            ) : null}
                          </div>
                          <div>
                            <strong>{row.name}</strong>
                            <span>{row.slug}</span>
                            {row.is_featured ? (
                              <span className="admin-badge admin-badge-warning mt-1">Featured</span>
                            ) : null}
                          </div>
                        </div>
                      </td>
                      <td className="text-[var(--admin-muted)]">{row.product_type || "—"}</td>
                      <td>
                        <AdminStatusBadge published={row.is_published} />
                      </td>
                      <td className="whitespace-nowrap text-[var(--admin-text-secondary)]">
                        {price || "—"}
                      </td>
                      <td className="space-x-1 whitespace-nowrap">
                        <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => edit(row)}>
                          Edit
                        </button>
                        <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => remove(row.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="admin-pagination">
          <span>
            Showing {filtered.length} of {products.length} products
          </span>
        </div>
      </div>

      <form onSubmit={submit} className="admin-card admin-form-panel">
        <div className="admin-card-header">
          <h2>{form.id ? "Edit product" : "New product"}</h2>
        </div>
        <div className="admin-card-body space-y-4">
          <p className="text-xs leading-relaxed text-[var(--admin-muted)]">
            Seed data uses <code className="text-[10px]">public/</code> image paths until you upload to
            Supabase Storage.
          </p>
          {message ? <p className="admin-message-ok">{message}</p> : null}
          <div className="admin-form-grid admin-form-grid-2">
            <div>
              <label className="admin-label">Name</label>
              <input className="admin-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="admin-label">Slug</label>
              <input className="admin-input" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
            </div>
          </div>
          <div className="admin-form-grid admin-form-grid-2">
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
          </div>
          <div>
            <label className="admin-label">Sort order</label>
            <input className="admin-input" type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} />
          </div>
          <label className="admin-checkbox">
            <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
            Published on website
          </label>
          <label className="admin-checkbox">
            <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} />
            Featured (home slider)
          </label>
          <div>
            <label className="admin-label">SEO title</label>
            <input className="admin-input" value={form.seo_title} onChange={(e) => setForm({ ...form, seo_title: e.target.value })} />
          </div>
          <div>
            <label className="admin-label">SEO description</label>
            <textarea className="admin-textarea min-h-[80px]" value={form.seo_description} onChange={(e) => setForm({ ...form, seo_description: e.target.value })} />
          </div>
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
            <label className="admin-label">Payload (JSON)</label>
            <textarea className="admin-textarea font-mono text-xs" value={form.payloadJson} onChange={(e) => setForm({ ...form, payloadJson: e.target.value })} />
          </div>
          <button type="submit" disabled={pending} className="admin-btn admin-btn-primary w-full">
            <Plus size={16} strokeWidth={1.5} />
            {pending ? "Saving…" : "Save product"}
          </button>
        </div>
      </form>
    </div>
  );
}
