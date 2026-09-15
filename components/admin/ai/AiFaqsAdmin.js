"use client";

import { useState } from "react";
import { deleteAiFaq, upsertAiFaq } from "@/lib/admin/aiKnowledgeActions";
import AdminFeedback from "@/components/admin/AdminFeedback";

export default function AiFaqsAdmin({ initialFaqs = [] }) {
  const [faqs, setFaqs] = useState(initialFaqs);
  const [form, setForm] = useState({
    id: "",
    question: "",
    answer: "",
    category: "",
    priority: 0,
    is_published: false,
    language: "en",
  });
  const [msg, setMsg] = useState({ type: "", text: "" });

  function edit(f) {
    setForm({
      id: f.id,
      question: f.question,
      answer: f.answer,
      category: f.category || "",
      priority: f.priority,
      is_published: f.is_published,
      language: f.language || "en",
    });
  }

  async function save(e) {
    e.preventDefault();
    setMsg({ type: "", text: "" });
    try {
      await upsertAiFaq(form);
      setMsg({ type: "success", text: "FAQ saved and indexed." });
      window.location.reload();
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    }
  }

  async function remove(id) {
    if (!confirm("Delete this FAQ?")) return;
    try {
      await deleteAiFaq(id);
      window.location.reload();
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    }
  }

  return (
    <div className="ai-panel">
      <AdminFeedback message={msg.type === "success" ? msg.text : ""} error={msg.type === "error" ? msg.text : ""} />
      <form onSubmit={save} className="admin-card mb-6">
        <div className="admin-card-body space-y-3">
          <div>
            <label className="admin-label">Question</label>
            <input className="admin-input" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} required />
          </div>
          <div>
            <label className="admin-label">Answer (approved Avalon text only)</label>
            <textarea className="admin-input min-h-[100px]" value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="admin-label">Category</label>
              <input className="admin-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            </div>
            <div>
              <label className="admin-label">Language</label>
              <select className="admin-input" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}>
                <option value="en">English</option>
                <option value="ta">Tamil</option>
                <option value="tanglish">Tanglish</option>
              </select>
            </div>
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
            Published
          </label>
          <button type="submit" className="admin-btn admin-btn-primary">Save FAQ</button>
        </div>
      </form>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Question</th>
              <th>Category</th>
              <th>Published</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {faqs.map((f) => (
              <tr key={f.id}>
                <td>{f.question}</td>
                <td>{f.category || "—"}</td>
                <td>{f.is_published ? "Yes" : "No"}</td>
                <td>
                  <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => edit(f)}>Edit</button>
                  <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => remove(f.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
