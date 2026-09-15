import AdminPageHeader from "@/components/admin/AdminPageHeader";
import DealersAdmin from "@/components/admin/DealersAdmin";
import { fetchAdminTable } from "@/lib/admin/queries";

export default async function AdminDealersPage() {
  const dealers = await fetchAdminTable("dealers", "city", true);
  return (
    <>
      <AdminPageHeader
        title="Dealers"
        description="Authorized showrooms for the locator map and nearest-dealer email suggestions."
        breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Network" }, { label: "Dealers" }]}
      />
      <DealersAdmin dealers={dealers} />
    </>
  );
}
