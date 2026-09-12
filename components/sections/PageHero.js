import Image from "next/image";
import Button from "@/components/ui/Button";

/**
 * Interior-page hero: full-bleed image (desktop) + diagonal white wedge for copy.
 * Design plates with a baked diagonal still use `bakedDiagonal` — the wedge hides
 * the soft edge in the bitmap so the left column stays clean white.
 */
export default function PageHero({
  label,
  title,
  highlight,
  lede,
  description,
  footnote,
  image,
  imageAlt,
  imagePosition = "object-right",
  bakedDiagonal = false,
  verticalText,
  /** Cursive tagline on the hero image (e.g. furniture comp, top-right). */
  imageTagline,
  /** `{ total, active }` — pill dots centered on the hero image. */
  carouselDots,
  leftVerticalText,
  titleSuffix,
  priority = false,
  textColumnClassName = "lg:w-[46%]",
  /**
   * On phone (below md): hero image above copy. Tablet/desktop layout unchanged at lg+.
   * Set false to keep copy above image on all breakpoints below lg.
   */
  mobileImageFirst = true,
  /** Extra classes on the root hero section (e.g. page-scoped mobile tweaks). */
  sectionClassName = "",
  /** Optional object-position override for the mobile/tablet image band. */
  mobileImagePositionClass = "",
  children,
}) {
  const mobileStackOrderCopy = mobileImageFirst
    ? "max-md:order-2 md:max-lg:order-1"
    : "max-lg:order-1";
  const mobileStackOrderMedia = mobileImageFirst
    ? "max-md:order-1 md:max-lg:order-2"
    : "max-lg:order-2";

  return (
    <section
      className={`hero-section relative overflow-hidden lg:min-h-[560px] ${sectionClassName}`}
    >
      {/* Desktop: image fills the hero; focal point stays on the bedroom (right) */}
      <div className="absolute inset-0 z-0 hidden lg:block" aria-hidden={false}>
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority={priority}
          className={`object-cover ${imagePosition}`}
          sizes="100vw"
        />
        {imageTagline && (
          <p
            className="pointer-events-none absolute right-[8%] top-10 z-10 max-w-[10rem] font-serif text-[1.5rem] italic leading-snug text-avalon-black/65 xl:right-[11%] xl:top-12 xl:text-[1.75rem]"
            aria-hidden="true"
          >
            {imageTagline}
          </p>
        )}
        {carouselDots && (
          <div
            className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 gap-2"
            aria-hidden="true"
          >
            {Array.from({ length: carouselDots.total }).map((_, i) => (
              <span
                key={i}
                className={`h-2 w-2 rounded-full ${
                  i === carouselDots.active ? "bg-white shadow-sm" : "bg-white/45"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="hero-left-wedge hidden lg:block" aria-hidden="true" />

      {leftVerticalText && (
        <div
          className="
            vertical-text pointer-events-none absolute bottom-20 left-4 z-20 hidden
            text-[10px] tracking-[0.28em] text-gray-400
            lg:bottom-24 lg:left-[max(1.25rem,calc((100%-72rem)/2+1.25rem))] lg:block
          "
          aria-hidden="true"
        >
          {leftVerticalText}
        </div>
      )}

      <div className="hero-section__mobile-tablet-stack relative z-10 max-lg:flex max-lg:flex-col lg:contents">
        <div
          className={`hero-section__copy container-avalon relative z-10 ${mobileStackOrderCopy}`}
        >
          <div
            className={`flex min-h-[auto] flex-col justify-center py-10 md:py-14 lg:min-h-[560px] ${textColumnClassName} lg:py-16 lg:pr-8`}
          >
            {label && <span className="label-red mb-4">{label}</span>}
            <h1 className="mb-5 font-serif text-[2.1rem] leading-[1.14] text-avalon-black sm:text-4xl md:text-5xl lg:text-[3.25rem]">
              {title}
              {highlight && (
                <>
                  {" "}
                  <span className="text-avalon-red">{highlight}</span>
                </>
              )}
              {titleSuffix && (
                <span className="text-avalon-black">{titleSuffix}</span>
              )}
            </h1>
            {lede && (
              <p className="mb-4 max-w-md text-lg leading-snug text-avalon-black md:text-xl">
                {lede}
              </p>
            )}
            {description && (
              <p className="mb-6 max-w-md text-[15px] leading-relaxed text-gray-600 max-lg:mb-0">
                {description}
              </p>
            )}
            {leftVerticalText && (
              <p
                className="hero-mobile-tagline mt-6 text-[10px] font-medium uppercase leading-relaxed tracking-[0.22em] text-gray-400 max-lg:mt-5 lg:hidden"
              >
                {leftVerticalText}
              </p>
            )}
            {children}
            {footnote && (
              <>
                <span
                  className="mt-8 block h-px w-10 bg-avalon-red"
                  aria-hidden="true"
                />
                <p className="mt-4 whitespace-pre-line text-[11px] uppercase leading-relaxed tracking-[0.22em] text-gray-400">
                  {footnote}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Mobile / tablet: image band (order controlled by mobileImageFirst) */}
        <div
          className={`hero-section__mobile-media relative z-0 h-[260px] w-full sm:h-[340px] lg:hidden ${mobileStackOrderMedia}`}
        >
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority={priority}
            className={`object-cover ${imagePosition} ${mobileImagePositionClass}`}
            sizes="100vw"
          />
          {imageTagline && (
            <p
              className="pointer-events-none absolute right-4 top-5 z-10 max-w-[8rem] font-serif text-xl italic leading-snug text-avalon-black/65 sm:text-2xl"
              aria-hidden="true"
            >
              {imageTagline}
            </p>
          )}
          {carouselDots && (
            <div
              className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2"
              aria-hidden="true"
            >
              {Array.from({ length: carouselDots.total }).map((_, i) => (
                <span
                  key={i}
                  className={`h-2 w-2 rounded-full ${
                    i === carouselDots.active ? "bg-white shadow-sm" : "bg-white/45"
                  }`}
                />
              ))}
            </div>
          )}
          {verticalText && (
            <div className="vertical-text absolute right-3 top-1/2 z-10 hidden -translate-y-1/2 tracking-[0.28em] text-[10px] text-gray-500 sm:block">
              {verticalText}
            </div>
          )}
        </div>
      </div>

      {verticalText && (
        <div className="vertical-text pointer-events-none absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 tracking-[0.28em] text-[10px] text-gray-500 lg:right-5 lg:block">
          {verticalText}
        </div>
      )}
    </section>
  );
}

export function CTABanner({
  title,
  description,
  buttonLabel,
  buttonHref,
  backgroundImage,
  dark = true,
  className = "",
}) {
  return (
    <section
      className={`relative flex min-h-[220px] items-center overflow-hidden md:min-h-[240px] ${className}`}
    >
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
      )}
      <div
        className={`relative z-10 w-full py-12 md:py-14 ${
          dark ? "bg-avalon-navy/70 text-white" : "bg-avalon-warm"
        }`}
      >
        <div className="container-avalon flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          <h2 className="max-w-md font-serif text-3xl leading-tight md:text-[2.15rem] lg:w-[36%]">
            {title}
          </h2>
          {description && (
            <p
              className={`max-w-lg flex-1 text-sm leading-relaxed md:text-[15px] ${dark ? "text-white/80" : "text-gray-600"}`}
            >
              {description}
            </p>
          )}
          {buttonLabel && buttonHref && (
            <Button
              href={buttonHref}
              variant={dark ? "primary" : "outline"}
              className="shrink-0 self-start lg:self-center"
            >
              {buttonLabel}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

export function TrustBar({ items }) {
  return (
    <section className="border-y border-avalon-border bg-white">
      <div className="container-avalon py-6">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {items.map((item) => (
            <div key={item.title} className="flex items-center gap-3">
              {item.icon && (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50">
                  <Image src={item.icon} alt="" width={20} height={20} />
                </div>
              )}
              <div>
                <p className="font-semibold text-sm text-avalon-black">
                  {item.title}
                </p>
                {item.description && (
                  <p className="text-xs text-gray-500">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
