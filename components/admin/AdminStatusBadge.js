export default function AdminStatusBadge({ status, published }) {
  if (published !== undefined) {
    return published ? (
      <span className="admin-badge admin-badge-success">Published</span>
    ) : (
      <span className="admin-badge admin-badge-muted">Draft</span>
    );
  }

  const s = (status || "").toLowerCase();
  if (s === "new") return <span className="admin-badge admin-badge-warning">New</span>;
  if (s === "resolved" || s === "closed" || s === "approved") {
    return <span className="admin-badge admin-badge-success">{status}</span>;
  }
  return <span className="admin-badge">{status || "—"}</span>;
}
