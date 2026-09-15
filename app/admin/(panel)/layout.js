import AdminShell from "@/components/admin/AdminShell";
import { getAdminProfile } from "@/lib/admin/auth";
import { fetchAdminAlertCount } from "@/lib/admin/queries";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({ children }) {
  const profile = await getAdminProfile();
  if (!profile) {
    redirect("/admin/login");
  }

  const alertCount = await fetchAdminAlertCount();

  const shellProfile = {
    user_id: profile.user_id,
    email: profile.email,
    full_name: profile.full_name,
    role: profile.role,
  };

  return (
    <AdminShell profile={shellProfile} alertCount={alertCount}>
      {children}
    </AdminShell>
  );
}
