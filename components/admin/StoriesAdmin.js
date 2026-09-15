"use client";

import { useState, useTransition } from "react";
import { deleteStory, upsertStory } from "@/lib/admin/actions";

const empty = { id: "", title: "", excerpt: "", body: "", image_url: "", video_url: "", sort_order: 0, is_published: true };

export default function StoriesAdmin({ stories }) {
  const [form, setForm] = useState(empty);
  const [pending, startTransition] = useTransition();

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="admin-card overflow-hidden">
        <table className="admin-table">
          <thead><tr><th>Title</th><th>Published</th><th /></tr></thead>
          <tbody>
            {stories.map((row) => (
              <tr key={row.id}>
                <td>{row.title}</td>
                <td>{row.is_published ? "Yes" : "No"}</td>
                <td>
                  <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setForm({ ...row })}>Edit</button>
                  <button type="button" className="admin-btn admin-btn-ghost" onClick={() => startTransition(() => deleteStory(row.id))}>Delete</button>
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
            await upsertStory(form);
            if (!form.id) setForm(empty);
          });
        }}
        className="admin-card admin-card-body space-y-3"
      >
        <h2 className="font-serif text-xl">{form.id ? "Edit story" : "Add story"}</h2>
        <input className="admin-input" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <textarea className="admin-textarea" placeholder="Excerpt" value={form.excerpt || ""} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
        <textarea className="admin-textarea min-h-[160px]" placeholder="Body" value={form.body || ""} onChange={(e) => setForm({ ...form, body: e.target.value })} />
        <input className="admin-input" placeholder="Image URL" value={form.image_url || ""} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
        <input className="admin-input" placeholder="Video URL" value={form.video_url || ""} onChange={(e) => setForm({ ...form, video_url: e.target.value })} />
        <button type="submit" disabled={pending} className="admin-btn admin-btn-primary">Save</button>
      </form>
    </div>
  );
}
