"use client";

import { useTransition } from "react";
import { convertDealerApplicationToDealer, updateDealerApplicationStatus } from "@/lib/admin/actions";

export default function DealerApplicationsAdmin({ applications }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="admin-card overflow-x-auto">
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
          {applications.map((row) => (
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
                  disabled={pending}
                  onChange={(e) =>
                    startTransition(() =>
                      updateDealerApplicationStatus({ id: row.id, status: e.target.value }),
                    )
                  }
                >
                  {["pending", "under_review", "approved", "rejected"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {row.status === "approved" ? null : (
                  <button
                    type="button"
                    className="admin-btn admin-btn-ghost mt-2"
                    disabled={pending}
                    onClick={() =>
                      startTransition(async () => {
                        await convertDealerApplicationToDealer(row.id);
                      })
                    }
                  >
                    Convert to dealer
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
