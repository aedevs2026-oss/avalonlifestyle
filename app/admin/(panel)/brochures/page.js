import AdminPageHeader from "@/components/admin/AdminPageHeader";
import BrochuresAdmin from "@/components/admin/BrochuresAdmin";
import { fetchAdminTable } from "@/lib/admin/queries";

export default async function AdminBrochuresPage() {
  const brochures = await fetchAdminTable("brochures", "sort_order", true);
  return (
    <>
      <AdminPageHeader title="Brochures & catalogues" description="Downloads shown on Resources and share flows." />
      <BrochuresAdmin brochures={brochures} />
    </>
  );
}
