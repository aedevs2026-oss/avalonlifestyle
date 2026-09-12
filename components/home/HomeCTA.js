import Image from "next/image";
import Link from "next/link";
import { assets } from "@/lib/assets";
import Reveal from "./Reveal";
import { staggerDelay } from "./reveal-utils";

export default function HomeCTA() {
  return (
    <section className="relative overflow-hidden min-h-[260px] md:min-h-[300px] flex items-center">
      <Reveal scale={1.08} y={0} duration={1200} threshold={0.1} className="absolute inset-0">
        <Image
          src={assets.whyAvalon.ctaBand}
          alt=""
          fill
          className="object-cover object-[center_30%]"
          sizes="100vw"
        />
      </Reveal>
      <div className="absolute inset-0 bg-gradient-to-r from-avalon-navy/90 via-avalon-navy/80 to-avalon-navy/70" />
      <div className="container-avalon relative z-10 py-12 md:py-14">
        <div className="grid lg:grid-cols-[1fr_1.2fr_auto] gap-6 lg:gap-10 items-center">
          <Reveal delay={staggerDelay(0, 120)} duration={700}>
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-white leading-tight">
              Better Sleep. A Brighter Tomorrow.
            </h2>
          </Reveal>
          <Reveal delay={staggerDelay(1, 120)} duration={700}>
            <p className="text-white/80 text-sm md:text-[15px] leading-relaxed">
              Join thousands who have chosen Avalon for their sleep journey. Discover the difference today.
            </p>
          </Reveal>
          <Reveal delay={staggerDelay(2, 120)} duration={700} className="lg:justify-self-end">
            <Link
              href="/contact"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-avalon-red text-white px-8 py-3.5 text-sm font-semibold transition-all duration-300 hover:bg-[#c9181f] hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap"
            >
              Get in Touch
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
