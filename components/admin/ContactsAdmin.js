"use client";

import { useTransition } from "react";
import { updateContactSubmissionStatus } from "@/lib/admin/actions";

export default function ContactsAdmin({ submissions }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="admin-card overflow-x-auto">
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
          {submissions.map((row) => (
            <tr key={row.id}>
              <td className="whitespace-nowrap text-[var(--admin-muted)]">
                {new Date(row.created_at).toLocaleString()}
              </td>
              <td>
                <strong>{row.name}</strong>
                <br />
                {row.email}
                <br />
                {row.phone}
                <br />
                {row.city}
              </td>
              <td className="max-w-[240px]">
                <span className="text-[var(--admin-gold)]">{row.subject}</span>
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
                  disabled={pending}
                  onChange={(e) =>
                    startTransition(() =>
                      updateContactSubmissionStatus({ id: row.id, status: e.target.value }),
                    )
                  }
                >
                  {["new", "read", "replied", "archived"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
