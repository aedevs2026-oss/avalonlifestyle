import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ProductsAdmin from "@/components/admin/ProductsAdmin";
import { fetchAdminTable } from "@/lib/admin/queries";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    fetchAdminTable("products", "sort_order", true),
    fetchAdminTable("categories", "sort_order", true),
  ]);

  return (
    <>
      <AdminPageHeader
        title="Product management"
        description="Curate your luxury mattress catalogue — imagery, specifications, and publishing status."
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Catalogue" },
          { label: "Products" },
        ]}
      />
      <ProductsAdmin products={products} categories={categories} />
    </>
  );
}
