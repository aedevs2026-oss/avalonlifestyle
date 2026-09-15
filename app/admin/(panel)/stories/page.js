import AdminPageHeader from "@/components/admin/AdminPageHeader";
import StoriesAdmin from "@/components/admin/StoriesAdmin";
import { fetchAdminTable } from "@/lib/admin/queries";

export default async function AdminStoriesPage() {
  const stories = await fetchAdminTable("stories", "sort_order", true);
  return (
    <>
      <AdminPageHeader
        title="Stories"
        description="Editorial narratives for home insights and brand storytelling."
        breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Content" }, { label: "Stories" }]}
      />
      <StoriesAdmin stories={stories} />
    </>
  );
}
