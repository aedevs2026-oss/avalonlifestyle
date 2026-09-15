"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { deleteDealer, upsertDealer } from "@/lib/admin/actions";
import { useAdminCrud } from "@/lib/admin/useAdminCrud";
import AdminFeedback from "@/components/admin/AdminFeedback";

const empty = {
  id: "",
  legacy_id: "",
  name: "",
  address: "",
  city: "",
  pincode: "",
  phone: "",
  lat: "",
  lng: "",
  hours_week: "",
  hours_sun: "",
  email: "",
  whatsapp: "",
  dealer_code: "",
  contact_person: "",
  district: "",
  state: "",
  dealer_type: "",
  is_active: true,
};

function rowToForm(row) {
  return {
    ...empty,
    ...row,
    legacy_id: row.legacy_id ?? "",
    lat: row.lat ?? "",
    lng: row.lng ?? "",
  };
}

export default function DealersAdmin({ dealers }) {
  const [form, setForm] = useState(empty);
  const { busy, message, error, run, clearFeedback } = useAdminCrud();

  async function submit(e) {
    e.preventDefault();
    const ok = await run(() => upsertDealer(form), form.id ? "Dealer updated." : "Dealer created.");
    if (ok && !form.id) setForm(empty);
  }

  async function remove(id) {
    if (!window.confirm("Delete this dealer?")) return;
    const ok = await run(() => deleteDealer(id), "Dealer deleted.");
    if (ok && form.id === id) setForm(empty);
  }

  return (
    <div className="admin-split-layout">
      <div className="admin-card overflow-hidden">
        <div className="admin-table-toolbar">
          <h3>Dealer network</h3>
          <button type="button" className="admin-btn admin-btn-accent admin-btn-sm" onClick={() => { setForm(empty); clearFeedback(); }}>
            <Plus size={14} strokeWidth={1.5} />
            New dealer
          </button>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>City</th>
                <th>Active</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {dealers.map((row) => (
                <tr key={row.id}>
                  <td>{row.name}</td>
                  <td>{row.city}</td>
                  <td>{row.is_active ? "Yes" : "No"}</td>
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
          <h2>{form.id ? "Edit dealer" : "New dealer"}</h2>
        </div>
        <div className="admin-card-body space-y-3">
          <AdminFeedback error={error} message={message} />
          <div>
            <label className="admin-label">Name</label>
            <input className="admin-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="admin-label">Address</label>
            <textarea className="admin-textarea" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
          </div>
          <div className="admin-form-grid admin-form-grid-2">
            <div>
              <label className="admin-label">City</label>
              <input className="admin-input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
            </div>
            <div>
              <label className="admin-label">Pincode</label>
              <input className="admin-input" value={form.pincode || ""} onChange={(e) => setForm({ ...form, pincode: e.target.value })} />
            </div>
          </div>
          <div className="admin-form-grid admin-form-grid-2">
            <div>
              <label className="admin-label">Phone</label>
              <input className="admin-input" value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="admin-label">Email</label>
              <input className="admin-input" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>
          <div className="admin-form-grid admin-form-grid-2">
            <div>
              <label className="admin-label">WhatsApp</label>
              <input className="admin-input" value={form.whatsapp || ""} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
            </div>
            <div>
              <label className="admin-label">Dealer code</label>
              <input className="admin-input" value={form.dealer_code || ""} onChange={(e) => setForm({ ...form, dealer_code: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="admin-label">Contact person</label>
            <input className="admin-input" value={form.contact_person || ""} onChange={(e) => setForm({ ...form, contact_person: e.target.value })} />
          </div>
          <div className="admin-form-grid admin-form-grid-2">
            <div>
              <label className="admin-label">Latitude</label>
              <input className="admin-input" value={form.lat ?? ""} onChange={(e) => setForm({ ...form, lat: e.target.value })} />
            </div>
            <div>
              <label className="admin-label">Longitude</label>
              <input className="admin-input" value={form.lng ?? ""} onChange={(e) => setForm({ ...form, lng: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="admin-label">Week hours</label>
            <input className="admin-input" value={form.hours_week || ""} onChange={(e) => setForm({ ...form, hours_week: e.target.value })} />
          </div>
          <div>
            <label className="admin-label">Sunday hours</label>
            <input className="admin-input" value={form.hours_sun || ""} onChange={(e) => setForm({ ...form, hours_sun: e.target.value })} />
          </div>
          <label className="admin-checkbox">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
            Active on Find a Dealer
          </label>
          <button type="submit" disabled={busy} className="admin-btn admin-btn-primary w-full">
            {busy ? "Saving…" : form.id ? "Update dealer" : "Create dealer"}
          </button>
        </div>
      </form>
    </div>
  );
}
