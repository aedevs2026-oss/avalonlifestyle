import Image from "next/image";
import Link from "next/link";
import { assets } from "@/lib/assets";
import Reveal from "./Reveal";
import { staggerDelay } from "./reveal-utils";

const articles = [
  {
    title: "The Science of Better Sleep",
    description:
      "Learn how quality sleep improves your health and productivity.",
    image: assets.home.moreThanMattress,
  },
  {
    title: "How to Choose the Right Mattress",
    description:
      "A simple guide to finding your perfect comfort.",
    image: assets.tryBeforeYouBuy.bedroom,
  },
  {
    title: "Creating Comfortable Living Spaces",
    description:
      "Design ideas for a more relaxing and beautiful home.",
    image: assets.home.sofa,
  },
];

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 8H13M13 8L9 4M13 8L9 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HomeInsights() {
  return (
    <section className="w-full bg-white">
      <div
        className="
          mx-auto
          w-full
          home-content-gutter
          py-9
          sm:py-11
          lg:py-12
        "
      >
        <div
          className="
            grid
            grid-cols-1
            gap-8
            lg:grid-cols-[29fr_minmax(0,71fr)]
            lg:gap-8
            xl:grid-cols-[30fr_minmax(0,70fr)]
            xl:gap-9
          "
        >
          {/* =====================================================
              LEFT — INTRO
              ===================================================== */}
          <Reveal
            as="div"
            x={-20}
            duration={650}
            className="
              flex
              flex-col
              justify-start
              lg:pt-1
              xl:pt-2
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
              Sleep &amp; Living Better
            </span>

            <h2
              className="
                mt-2.5
                font-serif
                text-[2rem]
                leading-[1.05]
                tracking-[-0.035em]
                text-avalon-black
                sm:text-[2.3rem]
                lg:text-[2.35rem]
                xl:text-[2.5rem]
              "
            >
              Insights &amp; Inspiration
            </h2>

            <p
              className="
                mt-2
                max-w-[340px]
                text-[11px]
                leading-[1.45]
                text-gray-500
                sm:text-[12px]
              "
            >
              Tips, guides and ideas for a healthier,
              happier lifestyle.
            </p>

            {/* View all */}
            <Link
              href="/resources"
              className="
                group
                mt-14
                inline-flex
                w-fit
                items-center
                gap-2
                text-[11px]
                font-semibold
                text-avalon-black
                sm:mt-16
                sm:text-[12px]
              "
            >
              <span className="relative pb-2">
                View All Articles

                <span
                  className="
                    absolute
                    bottom-0
                    left-0
                    h-[2px]
                    w-12
                    bg-avalon-red
                    transition-all
                    duration-300
                    group-hover:w-full
                  "
                />
              </span>

              <ArrowIcon />
            </Link>
          </Reveal>

          {/* RIGHT — ARTICLES */}
          <div
            className="
              grid
              grid-cols-1
              gap-7
              sm:grid-cols-2
              lg:grid-cols-3
              lg:gap-5
              xl:gap-6
            "
          >
            {articles.map((article, index) => (
              <Reveal
                key={article.title}
                y={28}
                delay={staggerDelay(index, 120)}
                duration={650}
                className="min-w-0"
              >
                <Link href="/resources" className="group block">
                  {/* IMAGE */}
                  <div
                    className="
                      relative
                      aspect-[1.65/1]
                      w-full
                      overflow-hidden
                      rounded-[7px]
                      bg-avalon-warm
                      sm:aspect-[1.55/1]
                      lg:aspect-[1.6/1]
                    "
                  >
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="
                        object-cover
                        transition-transform
                        duration-700
                        ease-out
                        group-hover:scale-[1.035]
                      "
                      sizes="
                        (max-width: 640px) 100vw,
                        (max-width: 1024px) 50vw,
                        23vw
                      "
                    />
                  </div>

                  {/* TITLE */}
                  <h3
                    className="
                      mt-3
                      text-[13px]
                      font-semibold
                      leading-[1.25]
                      tracking-[-0.01em]
                      text-avalon-black
                      transition-colors
                      duration-200
                      group-hover:text-avalon-red
                      sm:text-[14px]
                      lg:text-[13px]
                      xl:text-[14px]
                    "
                  >
                    {article.title}
                  </h3>

                  {/* DESCRIPTION */}
                  <p
                    className="
                      mt-1.5
                      max-w-[270px]
                      text-[10.5px]
                      leading-[1.45]
                      text-gray-500
                      sm:text-[11px]
                      lg:text-[10.5px]
                      xl:text-[11px]
                    "
                  >
                    {article.description}
                  </p>

                  {/* READ MORE */}
                  <span
                    className="
                      group/read
                      mt-3
                      inline-flex
                      items-center
                      gap-2
                      text-[10.5px]
                      font-semibold
                      text-avalon-black
                      sm:text-[11px]
                    "
                  >
                    <span className="relative pb-1.5">
                      Read More

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
                          group-hover/read:w-full
                        "
                      />
                    </span>

                    <span
                      className="
                        transition-transform
                        duration-300
                        group-hover:translate-x-1
                      "
                    >
                      <ArrowIcon />
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}