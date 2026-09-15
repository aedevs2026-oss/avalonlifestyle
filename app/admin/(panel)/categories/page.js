import AdminPageHeader from "@/components/admin/AdminPageHeader";
import CategoriesAdmin from "@/components/admin/CategoriesAdmin";
import { fetchAdminTable } from "@/lib/admin/queries";

export default async function AdminCategoriesPage() {
  const categories = await fetchAdminTable("categories", "sort_order", true);
  return (
    <>
      <AdminPageHeader
        title="Categories"
        description="Organise mattress collections and filter imagery for the public catalogue."
        breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Catalogue" }, { label: "Categories" }]}
      />
      <CategoriesAdmin categories={categories} />
    </>
  );
}
