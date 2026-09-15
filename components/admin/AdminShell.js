"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  FileText,
  LayoutDashboard,
  Layers,
  Mail,
  MapPin,
  Menu,
  Package,
  Search,
  Settings,
  UserPlus,
  Bell,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { signOutAdmin } from "@/lib/admin/actions";
import { assets } from "@/lib/assets";

const navGroups = [
  {
    title: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true }],
  },
  {
    title: "Catalogue",
    items: [
      { href: "/admin/products", label: "Products", icon: Package },
      { href: "/admin/categories", label: "Categories", icon: Layers },
    ],
  },
  {
    title: "Content",
    items: [
      { href: "/admin/stories", label: "Stories", icon: BookOpen },
      { href: "/admin/brochures", label: "Brochures", icon: FileText },
    ],
  },
  {
    title: "Customers",
    items: [{ href: "/admin/contacts", label: "Enquiries", icon: Mail }],
  },
  {
    title: "Network",
    items: [
      { href: "/admin/dealers", label: "Dealers", icon: MapPin },
      { href: "/admin/dealer-applications", label: "Applications", icon: UserPlus },
    ],
  },
  {
    title: "System",
    items: [{ href: "/admin/settings", label: "Settings", icon: Settings }],
  },
];

function initials(profile) {
  const name = profile?.full_name || profile?.email || "A";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export default function AdminShell({ profile, alertCount = 0, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const closeMobile = () => setMobileOpen(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const profileRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  async function handleSignOut() {
    await signOutAdmin();
    router.push("/admin/login");
    router.refresh();
  }

  function onSearchSubmit(e) {
    e.preventDefault();
    const q = search.trim();
    if (!q) return;
    router.push(`/admin/products`);
  }

  const pageLabel =
    navGroups.flatMap((g) => g.items).find((item) =>
      item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`),
    )?.label || "Admin";

  return (
    <div
      className="admin-shell"
      data-sidebar-collapsed={collapsed ? "true" : "false"}
      data-mobile-nav-open={mobileOpen ? "true" : "false"}
    >
      <button
        type="button"
        className="admin-sidebar-backdrop"
        aria-label="Close menu"
        onClick={closeMobile}
      />
      <aside className="admin-sidebar" aria-label="Main navigation">
        <div className="admin-sidebar-inner">
          <div className="admin-brand">
            <Image src={assets.brand.logo} alt="Avalon" width={108} height={32} priority />
            <div className="admin-brand-copy">
              <span className="admin-sidebar-label">Brand Console</span>
              <small className="admin-sidebar-label">Avalon Lifestyle</small>
            </div>
          </div>
          <nav aria-label="Admin sections">
            {navGroups.map((group) => (
              <div key={group.title}>
                <p className="admin-nav-group-title">{group.title}</p>
                <div className="admin-nav">
                  {group.items.map((item) => {
                    const active = item.exact
                      ? pathname === item.href
                      : pathname === item.href || pathname.startsWith(`${item.href}/`);
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        onClick={closeMobile}
                      >
                        <Icon size={18} strokeWidth={1.5} aria-hidden />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
          <div className="admin-sidebar-footer">
            <button
              type="button"
              className="admin-sidebar-toggle"
              onClick={() => setCollapsed((c) => !c)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>
        </div>
      </aside>

      <div className="admin-content-column">
        <header className="admin-topbar">
          <button
            type="button"
            className="admin-icon-btn admin-mobile-menu-btn"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={20} strokeWidth={1.5} />
          </button>
          <div className="hidden text-sm text-[var(--admin-muted)] sm:block" aria-hidden="true">
            <span className="text-[var(--admin-muted-soft)]">Workspace</span>
            <span className="mx-2 opacity-40">/</span>
            <span className="text-[var(--admin-text-secondary)]">{pageLabel}</span>
          </div>
          <div className="admin-topbar-spacer" />
          <form className="admin-search" onSubmit={onSearchSubmit}>
            <Search className="admin-search-icon" size={16} strokeWidth={1.5} />
            <input
              type="search"
              placeholder="Search catalogue…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search catalogue"
            />
          </form>
          <Link
            href="/admin/contacts"
            className="admin-icon-btn"
            aria-label={`Notifications${alertCount ? `, ${alertCount} new` : ""}`}
          >
            <Bell size={18} strokeWidth={1.5} />
            {alertCount > 0 ? <span className="admin-notify-dot" /> : null}
          </Link>
          <div className="admin-profile" ref={profileRef}>
            <button
              type="button"
              className="admin-profile-trigger"
              onClick={() => setProfileOpen((o) => !o)}
              aria-expanded={profileOpen}
              aria-haspopup="menu"
            >
              <span className="admin-avatar">{initials(profile)}</span>
              <span className="admin-profile-meta">
                <strong>{profile?.full_name || "Admin"}</strong>
                <span>{profile?.role?.replace(/_/g, " ") || "Administrator"}</span>
              </span>
            </button>
            <div className="admin-dropdown" data-open={profileOpen ? "true" : "false"} role="menu">
              <a href="/" target="_blank" rel="noopener noreferrer" role="menuitem">
                <ExternalLink size={16} strokeWidth={1.5} />
                View website
              </a>
              <Link href="/admin/settings" role="menuitem" onClick={() => setProfileOpen(false)}>
                <Settings size={16} strokeWidth={1.5} />
                Settings
              </Link>
              <button type="button" role="menuitem" onClick={handleSignOut}>
                <LogOut size={16} strokeWidth={1.5} />
                Sign out
              </button>
            </div>
          </div>
        </header>
        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}
