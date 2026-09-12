import Image from "next/image";
import Link from "next/link";
import { assets } from "@/lib/assets";
import Reveal from "./Reveal";
import { staggerDelay } from "./reveal-utils";

const stats = [
  {
    icon: assets.home.excellence,
    value: "10+",
    label: "Years of Excellence",
  },
  {
    icon: assets.home.healthier,
    value: "Thousands",
    label: "of Happy Customers",
  },
  {
    icon: assets.home.excellence,
    value: "Pan India",
    label: "Presence",
  },
  {
    icon: assets.home.healthier,
    value: "A Healthier",
    label: "Brighter Tomorrow",
  },
];

export default function HomeStory() {
  return (
    <section className="w-full ">
      <div
        className="
          grid
          my-10 sm:my-12 md:my-16
          w-full
          grid-cols-1
          lg:grid-cols-[34%_29%_37%]
        "
      >
        {/* =========================================================
            LEFT — STORY
            ========================================================= */}
        <Reveal
          as="div"
          x={-20}
          duration={650}
          className="
            flex
            flex-col
            justify-center
            border-b
            border-avalon-border
            home-content-gutter
            py-10
            lg:border-b-0
            lg:border-r
            lg:py-10
          "
        >
          <span
            className="
              text-[10px]
              font-bold
              uppercase
              tracking-[0.22em]
              text-avalon-red
              sm:text-[11px]
            "
          >
            The Avalon Story
          </span>

          <h2
            className="
              mt-3
              max-w-[390px]
              font-serif
              text-[2rem]
              leading-[1.02]
              tracking-[-0.035em]
              text-avalon-black
              sm:text-[2.35rem]
              lg:text-[2.25rem]
              xl:text-[2.45rem]
            "
          >
            Built on Trust.
            <br />
            Driven by Better Sleep.
          </h2>

          <p
            className="
              mt-4
              max-w-[390px]
              text-[11px]
              leading-[1.55]
              text-gray-600
              sm:text-[12px]
              lg:text-[11px]
              xl:text-[12px]
            "
          >
            Avalon Premium Mattress is driven by a simple belief -
            that everyone deserves a better tomorrow. With a focus
            on innovation, quality and customer well-being, we create
            sleep solutions that make a real difference.
          </p>

          <Link
            href="/about"
            className="
              group
              mt-5
              inline-flex
              w-fit
              items-center
              gap-4
              rounded-full
              border
              border-avalon-red/35
              bg-white/40
              px-7
              py-2.5
              text-[12px]
              font-semibold
              text-avalon-red
              transition-all
              duration-300
              hover:bg-avalon-red
              hover:text-white
              sm:px-8
              sm:py-3
            "
          >
            <span>Our Story</span>

            <svg
              width="15"
              height="15"
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

        {/* =========================================================
            CENTER — STATS
            ========================================================= */}
        <div
          className="
            grid
            grid-cols-2
            content-center
            bg-white/25
            px-4
            py-8
            sm:px-10
            lg:px-5
            lg:py-7
            xl:px-8
          "
        >
          {stats.map((stat, index) => (
            <Reveal
              key={`${stat.value}-${stat.label}`}
              scale={0.9}
              y={16}
              delay={staggerDelay(index, 100)}
              duration={550}
              className={`
                flex
                min-h-[120px]
                flex-col
                items-center
                justify-center
                px-3
                text-center
                ${
                  index % 2 === 0
                    ? "border-r border-avalon-border"
                    : ""
                }
                ${
                  index < 2
                    ? "border-b border-avalon-border"
                    : ""
                }
              `}
            >
              {/* Icon */}
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-[#fff0f0]
                  sm:h-10
                  sm:w-10
                "
              >
                <Image
                  src={stat.icon}
                  alt=""
                  width={27}
                  height={27}
                  className="icon-avalon-red object-contain"
                />
              </div>

              {/* Main stat */}
              <p
                className="
                  mt-2
                  font-serif
                  text-[15px]
                  leading-tight
                  text-avalon-black
                  sm:text-[16px]
                "
              >
                {stat.value}
              </p>

              {/* Description */}
              <p
                className="
                  mt-1
                  max-w-[105px]
                  text-[9px]
                  leading-[1.35]
                  text-gray-500
                  sm:text-[10px]
                "
              >
                {stat.label}
              </p>
            </Reveal>
          ))}
        </div>

        {/* =========================================================
            RIGHT — QUALITY / MANUFACTURING
            ========================================================= */}
        <div
          className="
            flex
            flex-col
            justify-center
            bg-white
            home-content-gutter
            py-8
            lg:py-7
          "
        >
          {/* Manufacturing image */}
          <Reveal
            x={20}
            duration={700}
            className="
              relative
              w-full
              overflow-hidden
              aspect-[16/8.8]
              bg-gray-100
            "
          >
            <video
              controls
              playsInline
              preload="metadata"
              poster={assets.home.manufacturing}
              className="h-full w-full object-cover"
              aria-label="Avalon mattress manufacturing and quality control"
            >
              <source src={assets.home.manufacturingVideo} type="video/mp4" />
              Your browser does not support the manufacturing video.
            </video>
          </Reveal>

          {/* Heading */}
          <div className="mt-4">
            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.22em]
                text-avalon-black
                sm:text-[11px]
              "
            >
              Quality in Every Detail
            </p>

            <p
              className="
                mt-1
                max-w-[360px]
                text-[10px]
                leading-[1.45]
                text-gray-500
                sm:text-[11px]
              "
            >
              From raw materials to the final stitch,
              our focus is always on your comfort.
            </p>
          </div>

          <a
            href={assets.home.manufacturingVideo}
            target="_blank"
            rel="noreferrer"
            className="
              group
              mt-3
              inline-flex
              w-fit
              items-center
              gap-2.5
              text-[10px]
              font-semibold
              text-avalon-black
              transition-colors
              hover:text-avalon-red
              sm:text-[11px]
            "
          >
            <span
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-full
                border
                border-avalon-black
                bg-white
                transition-all
                duration-300
                group-hover:border-avalon-red
                group-hover:bg-avalon-red
                group-hover:text-white
              "
            >
              <svg
                width="9"
                height="10"
                viewBox="0 0 10 12"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M0 0v12l10-6L0 0z" />
              </svg>
            </span>

            <span>Watch Our Manufacturing Process</span>
          </a>
        </div>
      </div>
    </section>
  );
}