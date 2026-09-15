"use client";

export default function AiJobsAdmin({ jobs = [] }) {
  return (
    <div className="ai-panel">
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Status</th>
              <th>Progress</th>
              <th>Message</th>
              <th>Started</th>
              <th>Finished</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((j) => (
              <tr key={j.id}>
                <td>{j.job_type}</td>
                <td>{j.status}</td>
                <td>{j.progress_pct}%</td>
                <td>{j.message || j.error_message || "—"}</td>
                <td>{j.started_at ? new Date(j.started_at).toLocaleString() : "—"}</td>
                <td>{j.finished_at ? new Date(j.finished_at).toLocaleString() : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
