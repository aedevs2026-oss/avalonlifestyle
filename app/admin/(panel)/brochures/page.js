import AdminPageHeader from "@/components/admin/AdminPageHeader";
import BrochuresAdmin from "@/components/admin/BrochuresAdmin";
import { fetchAdminTable } from "@/lib/admin/queries";

export default async function AdminBrochuresPage() {
  const brochures = await fetchAdminTable("brochures", "sort_order", true);
  return (
    <>
      <AdminPageHeader
        title="Brochures"
        description="Premium downloads for the Resources experience."
        breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Content" }, { label: "Brochures" }]}
      />
      <BrochuresAdmin brochures={brochures} />
    </>
  );
}
