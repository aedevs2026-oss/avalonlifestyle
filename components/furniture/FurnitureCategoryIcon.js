/** Line-art category icons (comp) — not product photography. */

const stroke = "currentColor";

export default function FurnitureCategoryIcon({ name, className = "" }) {
  const icons = {
    Sofas: (
      <svg viewBox="0 0 32 24" fill="none" className={className} aria-hidden="true">
        <path
          d="M3 14V11a3 3 0 013-3h20a3 3 0 013 3v3M3 14v3h26v-3M6 17v2M26 17v2M3 11H1M31 11h-2"
          stroke={stroke}
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    Couches: (
      <svg viewBox="0 0 32 24" fill="none" className={className} aria-hidden="true">
        <path
          d="M4 15V12a2 2 0 012-2h20a2 2 0 012 2v3M4 15v2h24v-2M7 17v2M25 17v2"
          stroke={stroke}
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path d="M8 10V8h16v2" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
    Chairs: (
      <svg viewBox="0 0 24 28" fill="none" className={className} aria-hidden="true">
        <path
          d="M7 12h10v8H7v-8zM9 20v4M15 20v4M12 8V5M8 8h8"
          stroke={stroke}
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    Beds: (
      <svg viewBox="0 0 32 20" fill="none" className={className} aria-hidden="true">
        <path
          d="M2 14V10a2 2 0 012-2h24a2 2 0 012 2v4M2 14v2h28v-2M6 10V8M26 10V8"
          stroke={stroke}
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
    Tables: (
      <svg viewBox="0 0 28 24" fill="none" className={className} aria-hidden="true">
        <path d="M4 10h20M6 10v8M22 10v8" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
        <ellipse cx="14" cy="10" rx="12" ry="2" stroke={stroke} strokeWidth="1.4" />
      </svg>
    ),
    Storage: (
      <svg viewBox="0 0 26 28" fill="none" className={className} aria-hidden="true">
        <rect x="4" y="4" width="18" height="20" rx="1" stroke={stroke} strokeWidth="1.4" />
        <path d="M4 12h18M13 12v12" stroke={stroke} strokeWidth="1.4" />
      </svg>
    ),
    Divan: (
      <svg viewBox="0 0 32 18" fill="none" className={className} aria-hidden="true">
        <path
          d="M2 12h28v4H2v-4zM4 12V9a2 2 0 012-2h20a2 2 0 012 2v3"
          stroke={stroke}
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    ),
    Outdoor: (
      <svg viewBox="0 0 28 28" fill="none" className={className} aria-hidden="true">
        <path
          d="M6 18h16M8 18l2-8h8l2 8M10 10V8M18 10V8"
          stroke={stroke}
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20 6a3 3 0 11-6 0"
          stroke={stroke}
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
  };

  return icons[name] || icons.Sofas;
}
