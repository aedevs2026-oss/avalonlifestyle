import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ContactsAdmin from "@/components/admin/ContactsAdmin";
import { fetchAdminTable } from "@/lib/admin/queries";

export default async function AdminContactsPage() {
  const submissions = await fetchAdminTable("contact_submissions");
  return (
    <>
      <AdminPageHeader
        title="Contact management"
        description="Customer messages from the website, with nearest dealer suggestions captured at submit time."
      />
      <ContactsAdmin submissions={submissions} />
    </>
  );
}
