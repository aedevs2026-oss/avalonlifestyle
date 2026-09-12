"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Home", short: "Home" },
  { href: "/mattresses", label: "Mattresses", short: "Sleep" },
  { href: "/furniture", label: "Furniture", short: "Living" },
  { href: "/product-catalog", label: "Catalog", short: "Shop" },
  { href: "/find-a-dealer", label: "Dealers", short: "Stores" },
];

function NavIcon({ name, active }) {
  const stroke = active ? "var(--avalon-red)" : "#6b7280";
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": true,
  };
  if (name === "Home") {
    return (
      <svg {...common}>
        <path
          d="M4 10.5L12 4l8 6.5V20a1 1 0 01-1 1h-5v-6H10v6H5a1 1 0 01-1-1v-9.5z"
          stroke={stroke}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (name === "Mattresses") {
    return (
      <svg {...common}>
        <path
          d="M3 14V11a3 3 0 013-3h12a3 3 0 013 3v3M3 14v3h18v-3"
          stroke={stroke}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (name === "Furniture") {
    return (
      <svg {...common}>
        <path
          d="M4 15h16M6 15V11h12v4M8 15v3M16 15v3"
          stroke={stroke}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (name === "Catalog") {
    return (
      <svg {...common}>
        <path
          d="M4 7h16M4 12h16M4 17h10"
          stroke={stroke}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path
        d="M12 21s7-4.5 7-10a7 7 0 10-14 0c0 5.5 7 10 7 10z"
        stroke={stroke}
        strokeWidth="1.6"
      />
      <circle cx="12" cy="11" r="2" fill={stroke} />
    </svg>
  );
}

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-avalon-border bg-white/95 backdrop-blur-md lg:hidden"
      aria-label="Mobile primary navigation"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between px-1 pb-[max(0.35rem,env(safe-area-inset-bottom))] pt-1">
        {items.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const iconKey =
            item.label === "Catalog" ? "Catalog" : item.label === "Dealers" ? "Dealers" : item.label;
          return (
            <li key={item.href} className="flex-1 min-w-0">
              <Link
                href={item.href}
                className={`flex min-h-[52px] flex-col items-center justify-center gap-0.5 px-1 text-[10px] font-semibold leading-tight transition-colors ${
                  active ? "text-avalon-red" : "text-gray-600"
                }`}
              >
                <NavIcon name={iconKey} active={active} />
                <span className="truncate max-w-full">{item.short}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
