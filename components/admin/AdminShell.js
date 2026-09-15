"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutAdmin } from "@/lib/admin/actions";
import { assets } from "@/lib/assets";

const navGroups = [
  {
    title: "Dashboard",
    items: [{ href: "/admin", label: "Overview", exact: true }],
  },
  {
    title: "Products",
    items: [
      { href: "/admin/products", label: "Products" },
      { href: "/admin/categories", label: "Categories" },
    ],
  },
  {
    title: "Content",
    items: [
      { href: "/admin/stories", label: "Stories" },
      { href: "/admin/brochures", label: "Brochures & Catalogues" },
    ],
  },
  {
    title: "Customers",
    items: [{ href: "/admin/contacts", label: "Contact enquiries" }],
  },
  {
    title: "Dealers",
    items: [
      { href: "/admin/dealers", label: "Dealer management" },
      { href: "/admin/dealer-applications", label: "Dealer applications" },
    ],
  },
  {
    title: "Settings",
    items: [{ href: "/admin/settings", label: "Company & email" }],
  },
];

export default function AdminShell({ profile, children }) {
  const pathname = usePathname();

  async function handleSignOut() {
    await signOutAdmin();
    window.location.href = "/admin/login";
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <Image src={assets.brand.logo} alt="Avalon" width={120} height={36} priority />
          <div>
            <span>Admin Console</span>
            <small>Luxury control</small>
          </div>
        </div>
        <nav className="flex flex-col gap-4" aria-label="Admin">
          {navGroups.map((group) => (
            <div key={group.title}>
              <p className="mb-1 px-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--admin-muted)]">
                {group.title}
              </p>
              <div className="admin-nav flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const active = item.exact
                    ? pathname === item.href
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined}>
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="mt-8 border-t border-[var(--admin-border)] pt-4 text-xs text-[var(--admin-muted)]">
          <p className="mb-2 truncate">{profile?.full_name || profile?.email}</p>
          <button type="button" onClick={handleSignOut} className="admin-btn admin-btn-ghost w-full">
            Sign out
          </button>
        </div>
      </aside>
      <div className="admin-main">{children}</div>
    </div>
  );
}
