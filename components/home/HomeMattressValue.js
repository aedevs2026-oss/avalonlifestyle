import Image from "next/image";
import Link from "next/link";
import { assets } from "@/lib/assets";
import Reveal from "./Reveal";
import { staggerDelay } from "./reveal-utils";

const features = [
  {
    icon: assets.home.excellence,
    title: "Advanced Sleep Technology",
    description: "Engineered for superior comfort and support.",
  },
  {
    icon: assets.home.healthier,
    title: "Premium Materials",
    description: "Only the finest, responsibly sourced materials.",
  },
  {
    icon: assets.listing.leaf,
    title: "Designed for Indian Homes",
    description: "Made for our climate, lifestyle, and comfort needs.",
  },
  {
    icon: assets.singleProduct.durability,
    title: "Long-Lasting Quality",
    description: "Built to keep you comfortable for years.",
  },
];

export default function HomeMattressValue() {
  return (
    <section className="w-full bg-white">
      <div
        className="
          grid
          w-full
          grid-cols-1
          lg:grid-cols-[62.5%_37.5%]
        "
      >
        {/* =========================================================
            LEFT — FULL BLEED IMAGE
            ========================================================= */}
        <div
          className="
            relative
            min-h-[440px]
            overflow-hidden
            sm:min-h-[500px]
            lg:min-h-[430px]
            xl:min-h-[450px]
          "
        >
          <Reveal scale={1.08} y={0} duration={1000} threshold={0.1} className="absolute inset-0">
            <Image
              src={assets.home.moreThanMattress}
              alt="Woman sleeping peacefully on an Avalon mattress"
              fill
              priority
              className="
                object-cover
                object-center
              "
              sizes="(max-width: 1023px) 100vw, 62.5vw"
            />
          </Reveal>

          {/* Very subtle fade only behind text.
              The reference is bright, so avoid a heavy overlay. */}
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-gradient-to-r
              from-white/55
              via-white/15
              to-transparent
            "
          />

          {/* Content */}
          <div
            className="
              absolute
              left-0
              top-1/2
              w-full
              -translate-y-1/2
              home-content-gutter
            "
          >
            <Reveal as="div" y={22} delay={150} duration={700} threshold={0.1} className="max-w-[430px]">
              <h2
                className="
                  font-serif
                  text-[2rem]
                  leading-[1.02]
                  tracking-[-0.035em]
                  text-avalon-black
                  sm:text-[2.45rem]
                  md:text-[2.7rem]
                  lg:text-[2.45rem]
                  xl:text-[2.7rem]
                "
              >
                More Than
                <br />
                Just a Mattress
              </h2>

              <p
                className="
                  mt-4
                  max-w-[390px]
                  text-[12px]
                  leading-[1.55]
                  text-gray-700
                  sm:text-[13px]
                  md:text-sm
                "
              >
                At Avalon, we believe great sleep is the foundation
                of a healthier, happier and more productive life.
              </p>

              <Link
                href="/why-avalon"
                className="
                  group
                  mt-5
                  inline-flex
                  items-center
                  gap-5
                  rounded-full
                  bg-avalon-red
                  px-7
                  py-3
                  text-[12px]
                  font-semibold
                  text-white
                  shadow-sm
                  transition-all
                  duration-300
                  hover:bg-[#c9181f]
                  hover:shadow-md
                  sm:px-8
                  sm:py-3.5
                  sm:text-[13px]
                "
              >
                <span>Discover the Difference</span>

                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                  className="
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
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
            </Reveal>
          </div>
        </div>

        {/* =========================================================
            RIGHT — FEATURE LIST
            ========================================================= */}
        <div
          className="
            flex
            flex-col
            justify-center
            bg-white
            home-content-gutter
            py-8
            sm:py-10
            lg:py-8
          "
        >
          <div className="w-full">
            {features.map((feature, index) => (
              <Reveal
                key={feature.title}
                x={24}
                y={0}
                delay={staggerDelay(index, 110)}
                duration={600}
                className={`
                  flex
                  items-center
                  gap-4
                  border-b
                  border-gray-200/90
                  py-5
                  first:pt-2
                  last:border-b-0
                  last:pb-2
                  sm:gap-5
                  sm:py-5.5
                  lg:gap-4
                  lg:py-4.5
                  xl:gap-5
                  xl:py-5
                `}
              >
                {/* Icon */}
                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-[#fff0f0]
                    sm:h-12
                    sm:w-12
                  "
                >
                  <Image
                    src={feature.icon}
                    alt=""
                    width={21}
                    height={21}
                    className="icon-avalon-red object-contain"
                  />
                </div>

                {/* Text */}
                <div className="min-w-0">
                  <h3
                    className="
                      text-[13px]
                      font-semibold
                      leading-[1.25]
                      text-avalon-black
                      sm:text-[14px]
                      lg:text-[13px]
                      xl:text-[14px]
                    "
                  >
                    {feature.title}
                  </h3>

                  <p
                    className="
                      mt-1
                      text-[10.5px]
                      leading-[1.4]
                      text-gray-600
                      sm:text-[11px]
                      lg:text-[10.5px]
                      xl:text-[11px]
                    "
                  >
                    {feature.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}