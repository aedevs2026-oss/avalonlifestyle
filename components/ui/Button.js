import Link from "next/link";

const variants = {
  primary:
    "bg-avalon-red text-white hover:bg-[#c9181f] border border-avalon-red",
  outline:
    "bg-white text-avalon-red border border-avalon-red hover:bg-avalon-red hover:text-white",
  white:
    "bg-white text-avalon-black border border-white hover:bg-avalon-warm",
  ghost: "bg-transparent text-avalon-red border border-transparent hover:underline",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-3.5 text-base",
};

export default function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
  showArrow = true,
  type = "button",
  onClick,
  ...props
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 ${variants[variant]} ${sizes[size]} ${className}`;

  const content = (
    <>
      {children}
      {showArrow && (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
          <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} {...props}>
      {content}
    </button>
  );
}
