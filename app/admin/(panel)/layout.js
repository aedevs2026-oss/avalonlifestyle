import AdminShell from "@/components/admin/AdminShell";
import { getAdminProfile } from "@/lib/admin/auth";
import { fetchAdminAlertCount } from "@/lib/admin/queries";
import { redirect } from "next/navigation";

export default async function AdminPanelLayout({ children }) {
  const profile = await getAdminProfile();
  if (!profile) {
    redirect("/admin/login");
  }

  const alertCount = await fetchAdminAlertCount();

  return (
    <AdminShell profile={profile} alertCount={alertCount}>
      {children}
    </AdminShell>
  );
}
