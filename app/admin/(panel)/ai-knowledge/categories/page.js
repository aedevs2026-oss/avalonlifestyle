import { fetchAdminTable } from "@/lib/admin/queries";

export default async function AiCategoriesPage() {
  const categories = await fetchAdminTable("categories", "sort_order", true);
  return (
    <div className="ai-panel">
      <p className="text-sm text-[var(--admin-muted)] mb-4">
        Category knowledge is indexed from active categories. Use “Re-index all knowledge” on the dashboard after editing categories.
      </p>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Active</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.slug}</td>
                <td>{c.is_active ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
