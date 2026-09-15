"use client";

import { useState, useTransition } from "react";
import { deleteDealer, upsertDealer } from "@/lib/admin/actions";

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

export default function DealersAdmin({ dealers }) {
  const [form, setForm] = useState(empty);
  const [pending, startTransition] = useTransition();

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <div className="admin-card overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr><th>Name</th><th>City</th><th>Coords</th><th>Active</th><th /></tr>
          </thead>
          <tbody>
            {dealers.map((row) => (
              <tr key={row.id}>
                <td>{row.name}</td>
                <td>{row.city}</td>
                <td className="text-[var(--admin-muted)]">{row.lat}, {row.lng}</td>
                <td>{row.is_active ? "Yes" : "No"}</td>
                <td>
                  <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setForm({ ...row, legacy_id: row.legacy_id ?? "" })}>Edit</button>
                  <button type="button" className="admin-btn admin-btn-ghost" onClick={() => startTransition(() => deleteDealer(row.id))}>Delete</button>
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
            await upsertDealer(form);
            if (!form.id) setForm(empty);
          });
        }}
        className="admin-card admin-card-body space-y-3"
      >
        <h2 className="font-serif text-xl">{form.id ? "Edit dealer" : "Add dealer"}</h2>
        <input className="admin-input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <textarea className="admin-textarea" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
        <input className="admin-input" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
        <input className="admin-input" placeholder="Pincode" value={form.pincode || ""} onChange={(e) => setForm({ ...form, pincode: e.target.value })} />
        <input className="admin-input" placeholder="Phone" value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input className="admin-input" placeholder="Email (for lead notifications)" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="admin-input" placeholder="WhatsApp" value={form.whatsapp || ""} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
        <input className="admin-input" placeholder="Dealer code" value={form.dealer_code || ""} onChange={(e) => setForm({ ...form, dealer_code: e.target.value })} />
        <input className="admin-input" placeholder="Contact person" value={form.contact_person || ""} onChange={(e) => setForm({ ...form, contact_person: e.target.value })} />
        <div className="grid grid-cols-2 gap-2">
          <input className="admin-input" placeholder="Latitude" value={form.lat ?? ""} onChange={(e) => setForm({ ...form, lat: e.target.value })} />
          <input className="admin-input" placeholder="Longitude" value={form.lng ?? ""} onChange={(e) => setForm({ ...form, lng: e.target.value })} />
        </div>
        <input className="admin-input" placeholder="Week hours" value={form.hours_week || ""} onChange={(e) => setForm({ ...form, hours_week: e.target.value })} />
        <input className="admin-input" placeholder="Sunday hours" value={form.hours_sun || ""} onChange={(e) => setForm({ ...form, hours_sun: e.target.value })} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
          Active on Find a Dealer
        </label>
        <button type="submit" disabled={pending} className="admin-btn admin-btn-primary">Save dealer</button>
      </form>
    </div>
  );
}
