"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin/ai-knowledge", label: "Dashboard", exact: true },
  { href: "/admin/ai-knowledge/upload", label: "Upload Knowledge" },
  { href: "/admin/ai-knowledge/products", label: "Products" },
  { href: "/admin/ai-knowledge/categories", label: "Categories" },
  { href: "/admin/ai-knowledge/company", label: "Avalon Information" },
  { href: "/admin/ai-knowledge/faqs", label: "FAQs" },
  { href: "/admin/ai-knowledge/comparisons", label: "Product Comparisons" },
  { href: "/admin/ai-knowledge/vectors", label: "Vector Data" },
  { href: "/admin/ai-knowledge/jobs", label: "Processing Jobs" },
  { href: "/admin/ai-knowledge/test", label: "Chatbot Test" },
];

export default function AiKnowledgeNav() {
  const pathname = usePathname();
  return (
    <nav className="ai-knowledge-nav" aria-label="AI Knowledge">
      {links.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link key={item.href} href={item.href} className={active ? "is-active" : ""}>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
