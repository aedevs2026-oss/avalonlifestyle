import Link from "next/link";

export default function ResourcesSectionHeader({
  className = "",
  label,
  title,
  description,
  linkHref,
  linkLabel,
}) {
  return (
    <div className={`mb-8 md:mb-10 ${className}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <span className="label-red">{label}</span>
          <h2 className="mt-2 font-serif text-[1.75rem] leading-[1.12] text-avalon-black md:text-[2rem] lg:text-[2.15rem]">
            {title}
          </h2>
        </div>
        {linkHref && linkLabel && (
          <Link
            href={linkHref}
            className="inline-flex shrink-0 items-center gap-1.5 self-start text-sm font-semibold text-avalon-red hover:underline max-lg:mt-2 lg:mt-9"
          >
            {linkLabel}
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M3 8H13M13 8L9 4M13 8L9 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        )}
      </div>
      {description && (
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-600">{description}</p>
      )}
    </div>
  );
}
