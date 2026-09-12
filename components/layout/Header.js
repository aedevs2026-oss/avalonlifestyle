"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { navLinks } from "@/lib/site";
import { assets } from "@/lib/assets";
import Image from "next/image";

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);

  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className="site-header sticky top-0 z-50 isolate border-b border-avalon-border bg-white shadow-[0_1px_0_0_rgba(17,19,24,0.04)] max-lg:pt-[env(safe-area-inset-top,0px)]"
    >
      <div className="container-avalon grid grid-cols-[minmax(0,auto)_1fr_auto] lg:grid-cols-[1fr_auto_1fr] items-stretch h-16 md:h-[72px] gap-3 sm:gap-4">
        <div className="col-start-1 row-start-1 flex min-w-0 items-center">
          <Logo priority />
        </div>

        <nav
          className="hidden lg:flex h-full items-stretch justify-center gap-6 xl:gap-8"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex h-full items-center border-b-2 px-0.5 text-[13px] font-medium whitespace-nowrap transition-colors -mb-px ${
                  active
                    ? "border-avalon-red text-avalon-black"
                    : "border-transparent text-gray-600 hover:border-gray-200 hover:text-avalon-black"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex h-full items-center justify-end gap-3">
          <button
            type="button"
            className="p-2 text-gray-600 hover:text-avalon-black transition-colors"
            aria-label="Search"
          >
            <Image src={assets.findDealer.search} alt="" width={18} height={18} />
          </button>
          <Link
            href="/find-a-dealer"
            className="inline-flex items-center gap-2 rounded-full bg-avalon-red text-white px-5 py-2.5 text-[13px] font-semibold hover:bg-[#c9181f] transition-colors"
          >
            <Image src={assets.findDealer.location} alt="" width={14} height={14} className="brightness-0 invert" />
            Find a Dealer
          </Link>
        </div>

        <button
          type="button"
          className="lg:hidden col-start-3 flex items-center justify-self-end self-center p-2 text-avalon-black"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {menuOpen ? (
              <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M4 7H20M4 12H20M4 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      <div
        className={`fixed inset-0 top-16 z-40 bg-white transition-transform duration-300 lg:hidden max-lg:pb-[env(safe-area-inset-bottom,0px)] ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!menuOpen}
      >
        <nav className="flex flex-col p-6 gap-1" aria-label="Mobile navigation">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`py-3 px-4 rounded-lg text-base font-medium ${
                  active ? "bg-avalon-warm text-avalon-red" : "text-avalon-black"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="mt-6 pt-6 border-t border-avalon-border">
            <Link
              href="/find-a-dealer"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-avalon-red text-white px-6 py-3 text-sm font-semibold"
            >
              Find a Dealer
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
