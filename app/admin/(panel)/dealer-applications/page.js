import AdminPageHeader from "@/components/admin/AdminPageHeader";
import DealerApplicationsAdmin from "@/components/admin/DealerApplicationsAdmin";
import { fetchAdminTable } from "@/lib/admin/queries";

export default async function AdminDealerApplicationsPage() {
  const applications = await fetchAdminTable("dealer_applications");
  return (
    <>
      <AdminPageHeader title="Become a dealer" description="Partnership enquiries from the dealer application form." />
      <DealerApplicationsAdmin applications={applications} />
    </>
  );
}
