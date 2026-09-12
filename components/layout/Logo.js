import Image from "next/image";
import Link from "next/link";
import { assets } from "@/lib/assets";

const sizeClasses = {
  /** Compact — readable on white header (mobile + desktop) */
  header:
    "h-8 w-auto max-w-[min(46vw,10.5rem)] sm:h-9 sm:max-w-none lg:h-9",
  /** Larger mark in the footer brand column */
  footer: "h-[42px] w-auto sm:h-[46px] lg:h-[50px]",
};

const intrinsicSize = {
  header: { width: 176, height: 48 },
  footer: { width: 200, height: 58 },
};

export default function Logo({
  className = "",
  priority = false,
  variant = "header",
}) {
  const { width, height } = intrinsicSize[variant] ?? intrinsicSize.header;

  return (
    <Link
      href="/"
      className={`relative z-[2] inline-flex items-center shrink-0 ${
        variant === "header" ? "min-h-9 min-w-[5.5rem]" : ""
      } ${className}`}
      aria-label="Avalon Premium Mattress home"
    >
      <Image
        src={assets.brand.logo}
        alt="Avalon Premium Mattress"
        width={width}
        height={height}
        priority={priority}
        sizes={variant === "footer" ? "200px" : "(max-width: 640px) 168px, 176px"}
        className={`${sizeClasses[variant] ?? sizeClasses.header} object-contain object-left`}
      />
    </Link>
  );
}
