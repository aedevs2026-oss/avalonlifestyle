import Image from "next/image";
import Link from "next/link";
import { assets } from "@/lib/assets";
import Reveal from "./Reveal";
import { staggerDelay } from "./reveal-utils";

const categories = [
  {
    name: "Mattresses",
    tagline: "Engineered for deeper sleep",
    href: "/mattresses",
    image: assets.mattresses.detail,
  },
  {
    name: "Couches",
    tagline: "Comfort for better living",
    href: "/furniture",
    image: assets.home.couches,
    imageClass: "object-contain object-center p-3 sm:p-4",
  },
  {
    name: "Sofas",
    tagline: "Comfort for better living",
    href: "/furniture",
    image: assets.home.sofa,
    imageClass: "object-contain object-center p-3 sm:p-4",
  },
  {
    name: "Chairs",
    tagline: "Designed for everyday ease",
    href: "/furniture",
    image: assets.home.chair,
    imageClass: "object-contain object-center p-3 sm:p-4",
  },
];

export default function HomeExploreRange() {
  return (
    <section className="bg-white py-10 sm:py-12 md:py-16">
      <div className="container-avalon">
        <div className="home-split-layout">
          <Reveal as="div" x={-20} duration={650} className="home-split-intro">
            <span
              className="
                inline-block
                text-[10px]
                sm:text-[11px]
                font-bold
                uppercase
                tracking-[0.22em]
                text-avalon-red
              "
            >
              Explore Our Range
            </span>

            <h2
              className="
                mt-2.5
                font-serif
                text-[2rem]
                sm:text-[2.2rem]
                xl:text-[2.45rem]
                leading-[1.08]
                tracking-[-0.025em]
                text-avalon-black
              "
            >
              Designed for{" "}
              <span className="text-avalon-red">Every Lifestyle</span>
            </h2>

            <p
              className="
                mt-3
                max-w-[280px]
                text-[12px]
                sm:text-[13px]
                leading-[1.55]
                text-gray-500
              "
            >
              From restful nights to beautiful living spaces, Avalon brings
              comfort to every corner of your home.
            </p>

            <Link
              href="/product-catalog"
              className="
                group
                mt-5
                inline-flex
                items-center
                gap-2
                text-[11px]
                sm:text-xs
                font-semibold
                text-avalon-black
              "
            >
              <span className="relative pb-1">
                View All Products
                <span
                  className="
                    absolute
                    bottom-0
                    left-0
                    h-[2px]
                    w-11
                    bg-avalon-red
                    transition-all
                    duration-300
                    group-hover:w-full
                  "
                />
              </span>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8H13M13 8L9 4M13 8L9 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </Reveal>

          <div
            className="
              grid
              grid-cols-2
              gap-3
              sm:gap-4
              xl:grid-cols-4
              xl:gap-3
            "
          >
            {categories.map((cat, index) => (
              <Reveal key={cat.name} delay={staggerDelay(index, 110)} y={30}>
                <Link
                  href={cat.href}
                  className="
                    group
                    relative
                    block
                    overflow-hidden
                    rounded-[16px]
                    bg-[#f6f4f1]
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)]
                  "
                >
                  <div
                    className="
                      relative
                      aspect-[1.35/1]
                      overflow-hidden
                      bg-[#eeeae5]
                      sm:aspect-[1.4/1]
                    "
                  >
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      priority={cat.name === "Mattresses"}
                      className={`
                        transition-transform duration-700 ease-out group-hover:scale-[1.04]
                        ${cat.imageClass ?? "object-cover"}
                      `}
                      sizes="(max-width: 640px) 50vw, (max-width: 1280px) 25vw, 20vw"
                    />
                    <div
                      className="
                        pointer-events-none
                        absolute
                        inset-x-0
                        bottom-0
                        h-8
                        bg-gradient-to-t
                        from-black/[0.04]
                        to-transparent
                      "
                    />
                  </div>

                  <div
                    className="
                      relative
                      min-h-[76px]
                      px-3.5
                      pb-3.5
                      pt-3
                      sm:min-h-[82px]
                      sm:px-4
                      sm:pb-4
                    "
                  >
                    <h3
                      className="
                        font-serif
                        text-[16px]
                        sm:text-[17px]
                        leading-tight
                        text-avalon-black
                      "
                    >
                      {cat.name}
                    </h3>
                    <p
                      className="
                        mt-1
                        max-w-[125px]
                        pr-7
                        text-[10px]
                        sm:text-[11px]
                        leading-[1.35]
                        text-gray-500
                      "
                    >
                      {cat.tagline}
                    </p>
                    <span
                      className="
                        absolute
                        bottom-3
                        right-3
                        flex
                        h-7
                        w-7
                        items-center
                        justify-center
                        rounded-full
                        bg-white
                        text-gray-700
                        shadow-[0_2px_8px_rgba(0,0,0,0.08)]
                        transition-all
                        duration-300
                        group-hover:bg-avalon-red
                        group-hover:text-white
                        sm:bottom-3.5
                        sm:right-3.5
                      "
                    >
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M3 8H13M13 8L9 4M13 8L9 12"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
