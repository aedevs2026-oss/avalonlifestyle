import AdminPageHeader from "@/components/admin/AdminPageHeader";
import StoriesAdmin from "@/components/admin/StoriesAdmin";
import { fetchAdminTable } from "@/lib/admin/queries";

export default async function AdminStoriesPage() {
  const stories = await fetchAdminTable("stories", "sort_order", true);
  return (
    <>
      <AdminPageHeader title="Stories management" description="Brand stories for home and editorial sections." />
      <StoriesAdmin stories={stories} />
    </>
  );
}
