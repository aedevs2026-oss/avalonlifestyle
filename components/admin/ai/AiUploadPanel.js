"use client";

import { useCallback, useState } from "react";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";

const STATUS_MAP = {
  UPLOADED: "pending",
  PROCESSING: "pending",
  EXTRACTING: "pending",
  STRUCTURING: "pending",
  CHUNKING: "pending",
  EMBEDDING: "pending",
  INDEXING: "pending",
  COMPLETED: "active",
  FAILED: "inactive",
};

export default function AiUploadPanel({ initialDocuments = [] }) {
  const [docs, setDocs] = useState(initialDocuments);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    const res = await fetch("/api/admin/ai-knowledge");
    const json = await res.json();
    if (json.documents) setDocs(json.documents);
  }, []);

  async function processDoc(documentId, jobId) {
    await fetch("/api/admin/ai-knowledge/process", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documentId, jobId }),
    });
    await refresh();
  }

  async function approveDoc(id) {
    await fetch(`/api/admin/ai-knowledge/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approve: true }),
    });
    await refresh();
  }

  async function uploadFiles(fileList) {
    setError("");
    setUploading(true);
    try {
      for (const file of fileList) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/ai-knowledge/upload", { method: "POST", body: fd });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Upload failed");
        if (json.document?.id) {
          await processDoc(json.document.id, json.job?.id);
        }
      }
      await refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  }

  function onDrop(e) {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files?.length) uploadFiles([...e.dataTransfer.files]);
  }

  return (
    <div className="ai-panel">
      <div
        className={`ai-dropzone${dragging ? " is-dragging" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <p className="ai-dropzone-title">Drop catalogue files here</p>
        <p className="ai-dropzone-hint">PDF, DOCX, XLSX, CSV, TXT, JSON, images (OCR not enabled)</p>
        <label className="admin-btn admin-btn-primary">
          Choose files
          <input
            type="file"
            multiple
            className="sr-only"
            accept=".pdf,.docx,.xlsx,.csv,.txt,.json,.jpg,.jpeg,.png,.webp"
            disabled={uploading}
            onChange={(e) => e.target.files?.length && uploadFiles([...e.target.files])}
          />
        </label>
        {uploading ? <p className="mt-3 text-sm text-[var(--admin-muted)]">Uploading & processing…</p> : null}
      </div>

      {error ? <p className="admin-alert-error mt-4">{error}</p> : null}

      <div className="admin-table-wrap mt-6">
        <table className="admin-table">
          <thead>
            <tr>
              <th>File</th>
              <th>Type</th>
              <th>Size</th>
              <th>Status</th>
              <th>Records</th>
              <th>Chunks</th>
              <th>Embeddings</th>
              <th>Updated</th>
              <th>By</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {docs.map((d) => (
              <tr key={d.id}>
                <td>{d.file_name}</td>
                <td>{d.file_type}</td>
                <td>{(d.file_size_bytes / 1024).toFixed(1)} KB</td>
                <td>
                  <AdminStatusBadge status={STATUS_MAP[d.status] || "pending"} label={d.status} />
                </td>
                <td>{d.record_count}</td>
                <td>{d.chunk_count}</td>
                <td>{d.embedding_count}</td>
                <td>{d.updated_at ? new Date(d.updated_at).toLocaleString() : "—"}</td>
                <td>{d.uploaded_by_email || "—"}</td>
                <td className="flex gap-2">
                  {!d.is_approved && d.status === "COMPLETED" ? (
                    <button type="button" className="admin-btn admin-btn-sm" onClick={() => approveDoc(d.id)}>
                      Approve & Index
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="admin-btn admin-btn-ghost admin-btn-sm"
                    onClick={() => processDoc(d.id)}
                  >
                    Re-process
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
