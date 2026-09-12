import Image from "next/image";
import Link from "next/link";
import { assets } from "@/lib/assets";
import IndiaShowroomMap from "./IndiaShowroomMap";
import Reveal from "./Reveal";

export default function HomeShowroom() {
  return (
    <section className="w-full overflow-hidden bg-white">
      <div className="grid w-full grid-cols-1 lg:grid-cols-[45.5%_54.5%]">

        {/* =========================================================
            LEFT — SHOWROOM IMAGE
            ========================================================= */}
        <div
          className="
            relative
            h-[280px]
            w-full
            overflow-hidden
            sm:h-[320px]
            lg:h-[310px]
            xl:h-[320px]
          "
        >
          <Reveal x={-24} y={0} duration={750} className="absolute inset-0">
            <Image
              src={assets.home.findShowroom}
              alt="Avalon premium mattress showroom"
              fill
              priority
              className="object-cover object-center"
              sizes="
                (max-width: 1024px) 100vw,
                45.5vw
              "
            />
          </Reveal>
        </div>

        {/* =========================================================
            RIGHT — SHOWROOM CONTENT + INDIA MAP
            ========================================================= */}
        <div
          className="
            relative
            h-[340px]
            overflow-hidden
            bg-white
            sm:h-[360px]
            lg:h-[310px]
            xl:h-[320px]
          "
        >
          {/* -------------------------------------------------------
              INDIA MAP
              Positioned independently on the right side.
              ------------------------------------------------------- */}
          <div
            className="
              absolute
              inset-y-0
              right-0
              z-0
              w-[48%]
              sm:w-[45%]
              lg:w-[48%]
              xl:w-[47%]
            "
          >
            <IndiaShowroomMap />
          </div>

          {/* -------------------------------------------------------
              TEXT CONTENT
              ------------------------------------------------------- */}
          <div
            className="
              relative
              z-10
              flex
              h-full
              items-center
              home-content-gutter
            "
          >
            <Reveal as="div" x={20} delay={150} duration={700} className="w-[55%] max-w-[350px]">

              {/* Eyebrow */}
              <span
                className="
                  block
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.25em]
                  text-avalon-red
                  sm:text-[10px]
                  lg:text-[10px]
                "
              >
                Experience Avalon
              </span>

              {/* Heading */}
              <h2
                className="
                  mt-2
                  font-serif
                  text-[30px]
                  leading-[0.98]
                  tracking-[-0.035em]
                  text-avalon-black
                  sm:text-[34px]
                  lg:text-[34px]
                  xl:text-[37px]
                "
              >
                Find a Showroom
                <br />
                Near You
              </h2>

              {/* Description */}
              <p
                className="
                  mt-4
                  max-w-[300px]
                  text-[10px]
                  leading-[1.5]
                  text-gray-500
                  sm:text-[11px]
                  lg:text-[11px]
                "
              >
                Visit our authorised showrooms and experience
                Avalon comfort in person.
              </p>

              {/* CTA */}
              <Link
                href="/find-a-dealer"
                className="
                  group
                  mt-4
                  inline-flex
                  h-[42px]
                  min-w-[168px]
                  items-center
                  justify-between
                  rounded-full
                  bg-avalon-red
                  px-5
                  text-[11px]
                  font-semibold
                  text-white
                  transition-all
                  duration-300
                  hover:bg-[#c9181f]
                  hover:shadow-md
                "
              >
                <span>Find a Dealer</span>

                <svg
                  width="16"
                  height="16"
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
      </div>
    </section>
  );
}