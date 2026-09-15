import AdminDashboardView from "@/components/admin/AdminDashboardView";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { getAdminProfile } from "@/lib/admin/auth";
import { fetchDashboardCounts, fetchDashboardRecent } from "@/lib/admin/queries";

export default async function AdminDashboardPage() {
  const [counts, recent, profile] = await Promise.all([
    fetchDashboardCounts(),
    fetchDashboardRecent(),
    getAdminProfile(),
  ]);

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="A refined overview of catalogue health, dealer network, and customer conversations."
        breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Dashboard" }]}
      />
      {!counts ? (
        <div className="admin-card admin-card-body text-sm text-[var(--admin-muted)]">
          Supabase service role is not configured. Add environment variables and run the SQL migration
          (see <code className="text-[var(--admin-text)]">docs/SUPABASE_ADMIN.md</code>).
        </div>
      ) : (
        <AdminDashboardView profile={profile} counts={counts} recent={recent} />
      )}
    </>
  );
}
