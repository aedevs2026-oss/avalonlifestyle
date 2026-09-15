"use client";

import { convertDealerApplicationToDealer, updateDealerApplicationStatus } from "@/lib/admin/actions";
import { useAdminCrud } from "@/lib/admin/useAdminCrud";
import AdminFeedback from "@/components/admin/AdminFeedback";

export default function DealerApplicationsAdmin({ applications }) {
  const { busy, message, error, run } = useAdminCrud();

  async function onStatusChange(id, status) {
    await run(
      () => updateDealerApplicationStatus({ id, status }),
      "Application status updated.",
    );
  }

  async function onConvert(id) {
    await run(
      () => convertDealerApplicationToDealer(id),
      "Application converted to dealer record.",
    );
  }

  return (
    <div className="admin-card overflow-hidden">
      <div className="admin-table-toolbar">
        <h3>Partner applications</h3>
      </div>
      <div className="border-b border-[var(--admin-border)] px-4 py-2">
        <AdminFeedback error={error} message={message} />
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>When</th>
              <th>Applicant</th>
              <th>Business</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan={4}>
                  <div className="admin-empty">No applications yet.</div>
                </td>
              </tr>
            ) : (
              applications.map((row) => (
                <tr key={row.id}>
                  <td>{new Date(row.created_at).toLocaleString()}</td>
                  <td>
                    {row.name}
                    <br />
                    {row.email} · {row.phone}
                    <br />
                    {row.city}
                  </td>
                  <td>
                    <strong>{row.business_name}</strong>
                    <br />
                    {row.business_type}
                    <p className="mt-1 text-[var(--admin-muted)]">{row.message}</p>
                  </td>
                  <td>
                    <select
                      className="admin-select"
                      value={row.status}
                      disabled={busy}
                      onChange={(e) => onStatusChange(row.id, e.target.value)}
                    >
                      {["pending", "under_review", "approved", "rejected"].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    {row.status === "approved" ? null : (
                      <button
                        type="button"
                        className="admin-btn admin-btn-ghost admin-btn-sm mt-2"
                        disabled={busy}
                        onClick={() => onConvert(row.id)}
                      >
                        Convert to dealer
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
