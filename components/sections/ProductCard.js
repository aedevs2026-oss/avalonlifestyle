import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/products";
import { assets } from "@/lib/assets";

const badgeColors = {
  red: "bg-avalon-red text-white",
  green: "bg-green-600 text-white",
  blue: "bg-blue-600 text-white",
};

export default function ProductCard({
  product,
  hidePrice = false,
  hideTypeBadge = false,
  variant = "default",
}) {
  const isMattresses = variant === "mattresses";

  return (
    <article
      className={`group overflow-hidden card-hover ${
        isMattresses
          ? "rounded-[14px] border border-avalon-border bg-[#f3f4f6]"
          : "rounded-2xl border border-avalon-border bg-white"
      }`}
    >
      <Link href={`/products/${product.slug}`} className="block">
        {isMattresses ? (
          <div className="p-3 sm:p-3.5">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[10px] bg-white">
              <Image
                src={product.image || assets.singleProduct.main}
                alt={`${product.name} mattress`}
                fill
                className="object-contain object-center p-4 transition-transform duration-500 group-hover:scale-[1.02] sm:p-5"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
              {product.badge && (
                <span
                  className={`absolute top-2.5 left-2.5 rounded-[4px] px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase ${
                    badgeColors[product.badgeColor] || badgeColors.red
                  }`}
                >
                  {product.badge}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="relative aspect-[4/3] overflow-hidden bg-avalon-soft">
            <Image
              src={product.image || assets.singleProduct.main}
              alt={`${product.name} mattress`}
              fill
              className="object-contain object-center p-4 transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
            {product.badge && (
              <span
                className={`absolute top-3 left-3 rounded-[4px] px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase ${
                  badgeColors[product.badgeColor] || badgeColors.red
                }`}
              >
                {product.badge}
              </span>
            )}
            {!hideTypeBadge && (
              <span className="label-red absolute top-3 right-3 rounded bg-white/90 px-2 py-1 text-[0.6rem]">
                {product.type.toUpperCase()}
              </span>
            )}
          </div>
        )}
        <div
          className={
            isMattresses ? "px-4 pb-5 pt-0 sm:px-[1.125rem] sm:pb-[1.125rem]" : "p-5"
          }
        >
          {isMattresses ? (
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-avalon-red">
              {product.type}
            </p>
          ) : (
            <p className="label-red mb-1.5">{product.type}</p>
          )}
          <h3
            className={`leading-tight text-avalon-black ${
              isMattresses
                ? "mb-2 font-serif text-[1.2rem] sm:text-[1.3rem]"
                : "mb-1.5 font-serif text-[1.35rem]"
            }`}
          >
            {product.name}
          </h3>
          <p
            className={`leading-relaxed text-gray-500 ${
              isMattresses
                ? "mb-3 text-[11px] line-clamp-2 sm:text-xs"
                : "mb-4 text-[11px] sm:text-xs"
            }`}
          >
            {product.specs || product.shortSpecs}
          </p>
          {!hidePrice && product.price && (
            <p className="mb-3 font-bold text-avalon-red">{formatPrice(product.price)}</p>
          )}
          {!isMattresses && (
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-avalon-red transition-all group-hover:gap-2">
              View Details
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          )}
          {isMattresses && (
            <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-avalon-red transition-all group-hover:gap-2">
              View Details
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          )}
        </div>
      </Link>
    </article>
  );
}

export function ProductGrid({
  products,
  columns = 4,
  hidePrice = false,
  hideTypeBadge = true,
  variant = "default",
}) {
  const colClass = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  return (
    <div
      className={`grid ${colClass[columns] || colClass[4]} ${
        variant === "mattresses" ? "gap-4 sm:gap-5" : "gap-6"
      }`}
    >
      {products.map((product) => (
        <ProductCard
          key={product.slug}
          product={product}
          hidePrice={hidePrice}
          hideTypeBadge={hideTypeBadge}
          variant={variant}
        />
      ))}
    </div>
  );
}
