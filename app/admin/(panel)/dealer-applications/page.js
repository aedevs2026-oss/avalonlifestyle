import AdminPageHeader from "@/components/admin/AdminPageHeader";
import DealerApplicationsAdmin from "@/components/admin/DealerApplicationsAdmin";
import { fetchAdminTable } from "@/lib/admin/queries";

export default async function AdminDealerApplicationsPage() {
  const applications = await fetchAdminTable("dealer_applications");
  return (
    <>
      <AdminPageHeader
        title="Applications"
        description="Partnership enquiries from the become-a-dealer journey."
        breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Network" }, { label: "Applications" }]}
      />
      <DealerApplicationsAdmin applications={applications} />
    </>
  );
}
