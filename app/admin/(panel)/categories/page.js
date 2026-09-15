import AdminPageHeader from "@/components/admin/AdminPageHeader";
import CategoriesAdmin from "@/components/admin/CategoriesAdmin";
import { fetchAdminTable } from "@/lib/admin/queries";

export default async function AdminCategoriesPage() {
  const categories = await fetchAdminTable("categories", "sort_order", true);
  return (
    <>
      <AdminPageHeader title="Category management" description="Organise mattresses and catalogue groupings." />
      <CategoriesAdmin categories={categories} />
    </>
  );
}
