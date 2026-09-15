"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Search, Trash2 } from "lucide-react";
import { deleteProduct, upsertProduct } from "@/lib/admin/actions";
import {
  BADGE_COLORS,
  emptyProductForm,
  productRowToForm,
} from "@/lib/admin/productForm";
import AdminMediaUpload from "@/components/admin/AdminMediaUpload";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";

function formatPrice(payload) {
  if (!payload?.price) return null;
  try {
    return `₹ ${Number(payload.price).toLocaleString("en-IN")}`;
  } catch {
    return null;
  }
}

export default function ProductsAdmin({ products, categories }) {
  const router = useRouter();
  const [form, setForm] = useState(emptyProductForm());
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [pending, startTransition] = useTransition();

  const categoryById = useMemo(
    () => new Map(categories.map((c) => [c.id, c.name])),
    [categories],
  );

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

  function startNew() {
    setForm(emptyProductForm());
    setMessage("");
    setError("");
  }

  function edit(row) {
    setForm(productRowToForm(row));
    setMessage("");
    setError("");
  }

  function onCategoryChange(categoryId) {
    const name = categoryById.get(categoryId) || "";
    setForm((f) => ({
      ...f,
      category_id: categoryId,
      product_type: name || f.product_type,
    }));
  }

  function updateSize(index, field, value) {
    setForm((f) => {
      const sizes = [...f.sizes];
      sizes[index] = { ...sizes[index], [field]: value };
      return { ...f, sizes };
    });
  }

  function addSize() {
    setForm((f) => ({
      ...f,
      sizes: [...f.sizes, { name: "", dimensions: "", price: f.price || "" }],
    }));
  }

  function removeSize(index) {
    setForm((f) => ({
      ...f,
      sizes: f.sizes.filter((_, i) => i !== index),
    }));
  }

  function submit(e) {
    e.preventDefault();
    setMessage("");
    setError("");
    startTransition(async () => {
      try {
        await upsertProduct(form);
        setMessage(form.id ? "Product updated." : "Product created.");
        if (!form.id) {
          setForm(emptyProductForm());
        }
        router.refresh();
      } catch (err) {
        setError(err.message || "Save failed.");
      }
    });
  }

  function remove(id) {
    if (!window.confirm("Delete this product permanently?")) return;
    setMessage("");
    setError("");
    startTransition(async () => {
      try {
        await deleteProduct(id);
        if (form.id === id) setForm(emptyProductForm());
        setMessage("Product deleted.");
        router.refresh();
      } catch (err) {
        setError(err.message || "Delete failed.");
      }
    });
  }

  return (
    <div className="admin-split-layout">
      <div className="admin-card overflow-hidden">
        <div className="admin-table-toolbar">
          <h3>Product catalogue</h3>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" className="admin-btn admin-btn-accent admin-btn-sm" onClick={startNew}>
              <Plus size={14} strokeWidth={1.5} />
              New product
            </button>
            <div className="relative w-full max-w-xs">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-muted-soft)]"
                size={16}
                strokeWidth={1.5}
              />
              <input
                className="admin-input pl-9"
                placeholder="Search…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Filter products"
              />
            </div>
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

      <form onSubmit={submit} className="admin-card admin-form-panel max-h-[calc(100vh-6rem)] overflow-y-auto">
        <div className="admin-card-header">
          <h2>{form.id ? "Edit product" : "New product"}</h2>
        </div>
        <div className="admin-card-body space-y-4">
          {error ? <p className="admin-alert-error">{error}</p> : null}
          {message ? <p className="admin-message-ok">{message}</p> : null}

          <p className="admin-card-section-title">Identity</p>
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
              <label className="admin-label">Mattress type</label>
              <input className="admin-input" value={form.product_type} onChange={(e) => setForm({ ...form, product_type: e.target.value })} placeholder="Pocket Spring" />
            </div>
            <div>
              <label className="admin-label">Category</label>
              <select className="admin-select" value={form.category_id} onChange={(e) => onCategoryChange(e.target.value)}>
                <option value="">—</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="admin-form-grid admin-form-grid-2">
            <div>
              <label className="admin-label">Sort order</label>
              <input className="admin-input" type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} />
            </div>
            <div>
              <label className="admin-label">Base price (₹)</label>
              <input className="admin-input" type="number" min={0} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
          </div>
          <label className="admin-checkbox">
            <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
            Published on website
          </label>
          <label className="admin-checkbox">
            <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} />
            Featured (home slider)
          </label>

          <p className="admin-card-section-title">Merchandising</p>
          <div className="admin-form-grid admin-form-grid-2">
            <div>
              <label className="admin-label">Badge label</label>
              <input className="admin-input" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="BESTSELLER" />
            </div>
            <div>
              <label className="admin-label">Badge color</label>
              <select className="admin-select" value={form.badgeColor} onChange={(e) => setForm({ ...form, badgeColor: e.target.value })}>
                <option value="">—</option>
                {BADGE_COLORS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="admin-label">Tagline</label>
            <input className="admin-input" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
          </div>
          <div>
            <label className="admin-label">Description</label>
            <textarea className="admin-textarea min-h-[100px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          <p className="admin-card-section-title">Specifications</p>
          <div className="admin-form-grid admin-form-grid-2">
            <div>
              <label className="admin-label">Thickness</label>
              <input className="admin-input" value={form.thickness} onChange={(e) => setForm({ ...form, thickness: e.target.value })} />
            </div>
            <div>
              <label className="admin-label">Warranty</label>
              <input className="admin-input" value={form.warranty} onChange={(e) => setForm({ ...form, warranty: e.target.value })} />
            </div>
            <div>
              <label className="admin-label">Usage</label>
              <input className="admin-input" value={form.usage} onChange={(e) => setForm({ ...form, usage: e.target.value })} />
            </div>
            <div>
              <label className="admin-label">Fabric (optional)</label>
              <input className="admin-input" value={form.fabric} onChange={(e) => setForm({ ...form, fabric: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="admin-label">Full specs line</label>
            <input className="admin-input" value={form.specs} onChange={(e) => setForm({ ...form, specs: e.target.value })} />
          </div>
          <div>
            <label className="admin-label">Short specs (cards)</label>
            <input className="admin-input" value={form.shortSpecs} onChange={(e) => setForm({ ...form, shortSpecs: e.target.value })} />
          </div>
          <div className="admin-form-grid admin-form-grid-2">
            <div>
              <label className="admin-label">Rating</label>
              <input className="admin-input" type="number" step="0.1" min={0} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
            </div>
            <div>
              <label className="admin-label">Review count</label>
              <input className="admin-input" type="number" min={0} value={form.reviews} onChange={(e) => setForm({ ...form, reviews: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="admin-label">Highlights (one per line)</label>
            <textarea className="admin-textarea min-h-[80px]" value={form.highlightsText} onChange={(e) => setForm({ ...form, highlightsText: e.target.value })} />
          </div>
          <div>
            <label className="admin-label">Layers (one per line)</label>
            <textarea className="admin-textarea min-h-[80px]" value={form.layersText} onChange={(e) => setForm({ ...form, layersText: e.target.value })} />
          </div>

          <p className="admin-card-section-title">Sizes & pricing</p>
          {form.sizes.map((size, index) => (
            <div key={index} className="rounded-[var(--admin-radius-sm)] border border-[var(--admin-border)] p-3 space-y-2">
              <div className="admin-form-grid admin-form-grid-2">
                <input className="admin-input" placeholder="Size name" value={size.name} onChange={(e) => updateSize(index, "name", e.target.value)} />
                <input className="admin-input" placeholder="Dimensions" value={size.dimensions} onChange={(e) => updateSize(index, "dimensions", e.target.value)} />
              </div>
              <div className="flex gap-2">
                <input className="admin-input" type="number" placeholder="Price ₹" value={size.price} onChange={(e) => updateSize(index, "price", e.target.value)} />
                {form.sizes.length > 1 ? (
                  <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => removeSize(index)} aria-label="Remove size">
                    <Trash2 size={14} />
                  </button>
                ) : null}
              </div>
            </div>
          ))}
          <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={addSize}>
            Add size variant
          </button>

          <p className="admin-card-section-title">Media</p>
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

          <p className="admin-card-section-title">SEO</p>
          <div>
            <label className="admin-label">SEO title</label>
            <input className="admin-input" value={form.seo_title} onChange={(e) => setForm({ ...form, seo_title: e.target.value })} />
          </div>
          <div>
            <label className="admin-label">SEO description</label>
            <textarea className="admin-textarea min-h-[72px]" value={form.seo_description} onChange={(e) => setForm({ ...form, seo_description: e.target.value })} />
          </div>

          <button type="submit" disabled={pending} className="admin-btn admin-btn-primary w-full">
            {pending ? "Saving…" : form.id ? "Update product" : "Create product"}
          </button>
        </div>
      </form>
    </div>
  );
}
