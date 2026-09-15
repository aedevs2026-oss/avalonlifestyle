import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ContactsAdmin from "@/components/admin/ContactsAdmin";
import { fetchAdminTable } from "@/lib/admin/queries";

export default async function AdminContactsPage() {
  const submissions = await fetchAdminTable("contact_submissions");
  return (
    <>
      <AdminPageHeader
        title="Enquiries"
        description="Customer messages with nearest dealer context captured at submission."
        breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Customers" }, { label: "Enquiries" }]}
      />
      <ContactsAdmin submissions={submissions} />
    </>
  );
}
