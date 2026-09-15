import Link from "next/link";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { fetchDashboardCounts } from "@/lib/admin/queries";

export default async function AdminDashboardPage() {
  const counts = await fetchDashboardCounts();

  const cards = counts
    ? [
        { label: "New contact messages", value: counts.new_contacts, href: "/admin/contacts" },
        { label: "Dealer enquiries", value: counts.new_dealer_applications, href: "/admin/dealer-applications" },
        { label: "Products", value: counts.products, href: "/admin/products" },
        { label: "Dealers", value: counts.dealers, href: "/admin/dealers" },
        { label: "Stories", value: counts.stories, href: "/admin/stories" },
        { label: "Brochures", value: counts.brochures, href: "/admin/brochures" },
      ]
    : [];

  return (
    <>
      <AdminPageHeader
        title="Overview"
        description="Manage catalogue content, dealer network, and customer enquiries from one secure console."
      />
      {!counts ? (
        <div className="admin-card admin-card-body text-sm text-[var(--admin-muted)]">
          Supabase service role is not configured. Add environment variables and run the SQL migration
          (see <code className="text-[var(--admin-text)]">docs/SUPABASE_ADMIN.md</code>).
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <Link key={card.label} href={card.href} className="admin-stat">
              <strong>{card.value}</strong>
              <span className="text-sm text-[var(--admin-muted)]">{card.label}</span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
