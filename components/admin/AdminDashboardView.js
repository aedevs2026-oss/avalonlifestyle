import Link from "next/link";
import {
  Mail,
  UserPlus,
  Package,
  MapPin,
  Layers,
  BookOpen,
  FileText,
  ArrowUpRight,
} from "lucide-react";

function formatWhen(iso) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export default function AdminDashboardView({ profile, counts, recent }) {
  const firstName = (profile?.full_name || "there").split(" ")[0];

  const primaryKpis = [
    {
      label: "New enquiries",
      value: counts.new_contacts,
      meta: `${counts.contact_submissions} total messages`,
      href: "/admin/contacts",
      icon: Mail,
    },
    {
      label: "Dealer applications",
      value: counts.new_dealer_applications,
      meta: `${counts.dealer_applications} in pipeline`,
      href: "/admin/dealer-applications",
      icon: UserPlus,
    },
    {
      label: "Catalogue products",
      value: counts.products,
      meta: `${counts.categories} categories`,
      href: "/admin/products",
      icon: Package,
    },
    {
      label: "Dealer network",
      value: counts.dealers,
      meta: "Active showrooms",
      href: "/admin/dealers",
      icon: MapPin,
    },
  ];

  const chartItems = [
    { label: "Products", value: counts.products },
    { label: "Stories", value: counts.stories },
    { label: "Brochures", value: counts.brochures },
    { label: "Dealers", value: counts.dealers },
    { label: "Enquiries", value: counts.contact_submissions },
  ];
  const maxChart = Math.max(...chartItems.map((c) => c.value), 1);

  const activity = [
    ...recent.contacts.map((c) => ({
      id: `c-${c.id}`,
      title: c.name,
      detail: c.subject || "Contact enquiry",
      time: c.created_at,
      href: "/admin/contacts",
      status: c.status,
    })),
    ...recent.dealerApps.map((d) => ({
      id: `d-${d.id}`,
      title: d.name,
      detail: d.business_name || "Dealer application",
      time: d.created_at,
      href: "/admin/dealer-applications",
      status: d.status,
    })),
  ]
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 8);

  return (
    <>
      <section className="admin-welcome">
        <h2>Welcome back, {firstName}</h2>
        <p>
          Your luxury brand console — manage catalogue, content, dealers, and customer enquiries with
          clarity and control.
        </p>
        <div className="admin-quick-actions">
          <Link href="/admin/products" className="admin-btn admin-btn-primary admin-btn-sm">
            Manage products
          </Link>
          <Link href="/admin/contacts" className="admin-btn admin-btn-secondary admin-btn-sm">
            View enquiries
          </Link>
          <Link href="/admin/settings" className="admin-btn admin-btn-ghost admin-btn-sm">
            Company settings
          </Link>
        </div>
      </section>

      <div className="admin-kpi-grid" style={{ marginBottom: "1.5rem" }}>
        {primaryKpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Link key={kpi.label} href={kpi.href} className="admin-kpi admin-kpi-link">
              <div className="admin-kpi-top">
                <Icon className="admin-kpi-icon" size={20} strokeWidth={1.5} aria-hidden />
                <ArrowUpRight size={16} className="text-[var(--admin-muted-soft)]" strokeWidth={1.5} />
              </div>
              <div className="admin-kpi-value">{kpi.value}</div>
              <div className="admin-kpi-label">{kpi.label}</div>
              <div className="admin-kpi-meta">{kpi.meta}</div>
            </Link>
          );
        })}
      </div>

      <div className="admin-dashboard-grid">
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Catalogue overview</h3>
            <p className="mt-1 text-xs text-[var(--admin-muted)]">
              Relative volume across your managed content (not sales revenue).
            </p>
          </div>
          <div className="admin-card-body">
            <div className="admin-chart-bars" role="img" aria-label="Content volume chart">
              {chartItems.map((item) => (
                <div key={item.label} className="admin-chart-bar">
                  <div
                    className="admin-chart-bar-fill"
                    style={{ height: `${Math.max(12, (item.value / maxChart) * 100)}%` }}
                  />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[var(--admin-radius-sm)] border border-[var(--admin-border)] p-3">
                <Layers size={16} className="text-[var(--admin-champagne)]" strokeWidth={1.5} />
                <p className="mt-2 text-lg font-medium">{counts.categories}</p>
                <p className="text-xs text-[var(--admin-muted)]">Categories</p>
              </div>
              <div className="rounded-[var(--admin-radius-sm)] border border-[var(--admin-border)] p-3">
                <BookOpen size={16} className="text-[var(--admin-champagne)]" strokeWidth={1.5} />
                <p className="mt-2 text-lg font-medium">{counts.stories}</p>
                <p className="text-xs text-[var(--admin-muted)]">Stories</p>
              </div>
              <div className="rounded-[var(--admin-radius-sm)] border border-[var(--admin-border)] p-3">
                <FileText size={16} className="text-[var(--admin-champagne)]" strokeWidth={1.5} />
                <p className="mt-2 text-lg font-medium">{counts.brochures}</p>
                <p className="text-xs text-[var(--admin-muted)]">Downloads</p>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header flex items-center justify-between gap-2">
            <h3>Recent activity</h3>
            <Link href="/admin/contacts" className="text-xs text-[var(--admin-muted)] hover:text-[var(--admin-text)]">
              View all
            </Link>
          </div>
          <div className="admin-card-body">
            {activity.length === 0 ? (
              <p className="admin-empty text-sm">No recent enquiries yet.</p>
            ) : (
              <ul className="admin-activity-list">
                {activity.map((item) => (
                  <li key={item.id} className="admin-activity-item">
                    <span className="admin-activity-dot" />
                    <div className="min-w-0 flex-1">
                      <Link href={item.href} className="hover:underline">
                        <strong>{item.title}</strong>
                      </Link>
                      <p>{item.detail}</p>
                    </div>
                    <time className="admin-activity-time" dateTime={item.time}>
                      {formatWhen(item.time)}
                    </time>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
