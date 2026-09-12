import Link from "next/link";

export default function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-2">
            {index > 0 && <span aria-hidden="true" className="text-gray-300">{">"}</span>}
            {item.href ? (
              <Link href={item.href} className="hover:text-avalon-red transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-avalon-black font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
