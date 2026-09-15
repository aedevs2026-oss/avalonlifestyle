import Link from "next/link";

export default function AdminPageHeader({ title, description, actions, breadcrumb }) {
  const crumbs = breadcrumb ?? [{ label: "Admin", href: "/admin" }, { label: title }];

  return (
    <header className="admin-page-header">
      <nav className="admin-breadcrumb" aria-label="Breadcrumb">
        {crumbs.map((crumb, i) => (
          <span key={`${crumb.label}-${i}`} className="inline-flex items-center gap-1">
            {i > 0 ? <span className="opacity-40">/</span> : null}
            {crumb.href ? (
              <Link href={crumb.href}>{crumb.label}</Link>
            ) : (
              <span>{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="admin-page-title">{title}</h1>
          {description ? <p className="admin-page-desc">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}
