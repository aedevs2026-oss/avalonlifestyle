import AdminShell from "@/components/admin/AdminShell";
import { getAdminProfile } from "@/lib/admin/auth";
import { redirect } from "next/navigation";

export default async function AdminPanelLayout({ children }) {
  const profile = await getAdminProfile();
  if (!profile) {
    redirect("/admin/login");
  }

  return <AdminShell profile={profile}>{children}</AdminShell>;
}
