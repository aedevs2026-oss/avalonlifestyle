"use client";

import { updateContactSubmissionStatus } from "@/lib/admin/actions";
import { useAdminCrud } from "@/lib/admin/useAdminCrud";
import AdminFeedback from "@/components/admin/AdminFeedback";

export default function ContactsAdmin({ submissions }) {
  const { busy, message, error, run } = useAdminCrud();

  async function onStatusChange(id, status) {
    await run(
      () => updateContactSubmissionStatus({ id, status }),
      "Enquiry status updated.",
    );
  }

  return (
    <div className="admin-card overflow-hidden">
      <div className="admin-table-toolbar">
        <h3>Customer enquiries</h3>
        <span className="text-xs text-[var(--admin-muted)]">{submissions.length} total</span>
      </div>
      <div className="border-b border-[var(--admin-border)] px-4 py-2">
        <AdminFeedback error={error} message={message} />
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>When</th>
              <th>Customer</th>
              <th>Message</th>
              <th>Nearest dealers</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {submissions.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="admin-empty">No enquiries yet.</div>
                </td>
              </tr>
            ) : (
              submissions.map((row) => (
                <tr key={row.id}>
                  <td className="whitespace-nowrap text-[var(--admin-muted)]">
                    {new Date(row.created_at).toLocaleString()}
                  </td>
                  <td>
                    <strong className="font-medium">{row.name}</strong>
                    <br />
                    {row.email}
                    <br />
                    {row.phone}
                    <br />
                    {row.city}
                  </td>
                  <td className="max-w-[240px]">
                    <span className="text-[var(--admin-champagne-muted)]">{row.subject}</span>
                    <p className="mt-1 text-[var(--admin-muted)]">{row.message}</p>
                  </td>
                  <td className="max-w-[220px] text-xs">
                    {(row.nearest_dealers || []).map((d) => (
                      <p key={`${d.name}-${d.distanceLabel}`}>
                        {d.name} — {d.distanceLabel}
                      </p>
                    ))}
                  </td>
                  <td>
                    <select
                      className="admin-select"
                      value={row.status}
                      disabled={busy}
                      onChange={(e) => onStatusChange(row.id, e.target.value)}
                    >
                      {["new", "read", "replied", "archived"].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
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
