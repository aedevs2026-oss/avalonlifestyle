import Image from "next/image";
import Link from "next/link";
import { assets } from "@/lib/assets";
import Reveal from "./Reveal";

export default function HomeHero() {
  return (
    <section className="hero-section relative overflow-hidden lg:min-h-[620px]">
      <div className="absolute inset-0 z-0 hidden lg:block">
        <Image
          src={assets.home.hero}
          alt="Premium Avalon mattress in a modern bedroom with mountain views"
          fill
          priority
          className="object-cover object-[58%_center]"
          sizes="100vw"
        />
      </div>
      <div className="hero-left-wedge hero-left-wedge--home hidden lg:block" aria-hidden="true" />

      <div className="hero-section__mobile-tablet-stack relative z-10 max-lg:flex max-lg:flex-col lg:contents">
        <div
          className="hero-section__mobile-media relative z-0 h-[min(52vw,20rem)] w-full sm:h-[340px] lg:hidden max-md:order-1 md:max-lg:order-2"
        >
          <Image
            src={assets.home.hero}
            alt="Premium Avalon mattress in a modern bedroom with mountain views"
            fill
            priority
            className="object-cover object-[58%_center]"
            sizes="100vw"
          />
        </div>

        <div
          className="hero-section__copy container-avalon relative z-10 flex min-h-0 items-center py-8 max-md:order-2 sm:py-10 md:max-lg:order-1 lg:min-h-[620px] lg:py-16"
        >
          <div className="max-w-xl lg:w-[42%]">
            <Reveal delay={0} duration={650} threshold={0.05}>
              <span className="mb-4 block text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400">
                Premium Sleep Solutions
              </span>
            </Reveal>
            <Reveal delay={100} duration={750} threshold={0.05}>
              <h1 className="mb-5 max-w-lg font-serif text-[2.35rem] leading-[1.1] text-avalon-black sm:text-5xl lg:text-[3.5rem]">
                Better Sleep.{" "}
                <span className="text-avalon-red sm:inline block">
                  A Brighter Tomorrow.
                </span>
              </h1>
            </Reveal>
            <Reveal delay={200} duration={700} threshold={0.05}>
              <p className="mb-8 max-w-md text-[15px] leading-relaxed text-gray-600 md:text-base">
                Thoughtfully designed mattresses and furniture for deeper sleep,
                better health and brighter days.
              </p>
            </Reveal>
            <Reveal delay={300} duration={700} threshold={0.05}>
              <div className="mb-8 flex flex-wrap items-center gap-4 lg:mb-12">
                <Link
                  href="/product-catalog"
                  className="group inline-flex items-center gap-2 rounded-full bg-avalon-red px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#c9181f] hover:shadow-lg"
                >
                  Explore Our Collection
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    <path
                      d="M3 8H13M13 8L9 4M13 8L9 12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
                <Link
                  href="/about"
                  className="group inline-flex items-center gap-2.5 text-sm font-semibold text-avalon-black transition-colors hover:text-avalon-red"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-avalon-black transition-all duration-300 group-hover:border-avalon-red group-hover:bg-avalon-red group-hover:text-white">
                    <svg
                      width="10"
                      height="12"
                      viewBox="0 0 10 12"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M0 0v12l10-6L0 0z" />
                    </svg>
                  </span>
                  Watch Our Story
                </Link>
              </div>
            </Reveal>
            <Reveal delay={380} duration={700} threshold={0.05}>
              <div className="flex items-center gap-3 text-xs font-medium tracking-[0.15em] text-gray-400">
                <span className="text-avalon-black">01</span>
                <span className="h-px w-8 bg-avalon-border" aria-hidden="true" />
                <span>03</span>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
