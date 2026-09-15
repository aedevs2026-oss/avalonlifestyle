import AdminPageHeader from "@/components/admin/AdminPageHeader";
import DealersAdmin from "@/components/admin/DealersAdmin";
import { fetchAdminTable } from "@/lib/admin/queries";

export default async function AdminDealersPage() {
  const dealers = await fetchAdminTable("dealers", "city", true);
  return (
    <>
      <AdminPageHeader
        title="Dealer management"
        description="Authorized showrooms used on the map and for nearest-dealer suggestions in contact emails."
      />
      <DealersAdmin dealers={dealers} />
    </>
  );
}
