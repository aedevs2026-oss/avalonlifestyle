import Image from "next/image";
import { assets } from "@/lib/assets";
import Reveal from "./Reveal";
import { staggerDelay } from "./reveal-utils";

const testimonials = [
  {
    title: "Exceptional Comfort",
    quote:
      "Avalon has completely transformed my sleep. The comfort and support are truly amazing.",
    name: "Ramesh K.",
    location: "Chennai",
    image: assets.home.excellence,
  },
  {
    title: "Best Investment",
    quote:
      "The quality is outstanding and the design is elegant. It's the best investment for my family's health.",
    name: "Priya S.",
    location: "Bengaluru",
    image: assets.home.healthier,
  },
  {
    title: "Truly Premium",
    quote:
      "From quality to service, everything about Avalon feels premium. Highly recommended!",
    name: "Arun M.",
    location: "Coimbatore",
    image: assets.singleProduct.durability,
  },
];

export default function HomeTestimonials() {
  return (
    <section className="w-full bg-[#fafafa]">
      <div
        className="
          mx-auto
          flex
          w-full
          flex-col
          gap-7
          home-content-gutter
          py-8
          sm:py-10
          lg:flex-row
          lg:items-start
          lg:gap-8
          lg:py-10
          xl:gap-10
        "
      >
        {/* =====================================================
            LEFT — SECTION INTRO
            ===================================================== */}
        <Reveal
          as="div"
          x={-20}
          duration={650}
          className="
            shrink-0
            lg:w-[27%]
            lg:pt-1
            xl:w-[26%]
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
            Customer Stories
          </span>

          <h2
            className="
              mt-2.5
              font-serif
              text-[2rem]
              leading-[1.05]
              tracking-[-0.035em]
              text-avalon-black
              sm:text-[2.25rem]
              lg:text-[2.35rem]
              xl:text-[2.5rem]
            "
          >
            Loved by Thousands
          </h2>

          <p
            className="
              mt-2
              text-[11px]
              leading-[1.45]
              text-gray-500
              sm:text-[12px]
            "
          >
            Real people. Real comfort. Real stories.
          </p>
        </Reveal>

        {/* =====================================================
            TESTIMONIALS
            ===================================================== */}
        <div
          className="
            grid
            min-w-0
            flex-1
            grid-cols-1
            gap-3
            sm:grid-cols-2
            lg:grid-cols-3
            lg:gap-3.5
            xl:gap-4
          "
        >
          {testimonials.map((testimonial, index) => (
            <Reveal
              key={testimonial.name}
              as="article"
              y={30}
              delay={staggerDelay(index, 120)}
              duration={650}
              className="
                flex
                min-h-[205px]
                flex-col
                rounded-[10px]
                border
                border-gray-200
                bg-white
                px-5
                py-5
                transition-all
                duration-300
                hover:border-gray-300
                hover:shadow-[0_10px_28px_rgba(0,0,0,0.06)]
                sm:min-h-[215px]
                sm:px-6
                sm:py-5
              "
            >
              {/* Quote title */}
              <h3
                className="
                  text-[13px]
                  font-semibold
                  leading-[1.25]
                  text-avalon-black
                  sm:text-[14px]
                "
              >
                &ldquo;{testimonial.title}&rdquo;
              </h3>

              {/* Quote */}
              <p
                className="
                  mt-2
                  max-w-[260px]
                  text-[10.5px]
                  leading-[1.45]
                  text-gray-600
                  sm:text-[11px]
                "
              >
                {testimonial.quote}
              </p>

              {/* Stars */}
              <div
                className="
                  mt-3
                  flex
                  items-center
                  gap-[2px]
                "
                aria-label="5 out of 5 stars"
              >
                {Array.from({ length: 5 }).map((_, index) => (
                  <Image
                    key={index}
                    src={assets.singleProduct.star}
                    alt=""
                    width={13}
                    height={13}
                    className="h-[13px] w-[13px]"
                  />
                ))}
              </div>

              {/* Customer */}
              <div className="mt-auto flex items-center gap-3 pt-3">
                {/* Profile */}
                <div
                  className="
                    relative
                    h-9
                    w-9
                    shrink-0
                    overflow-hidden
                    rounded-full
                    bg-[#eee]
                  "
                >
                  <Image
                    src={testimonial.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="36px"
                  />
                </div>

                <div className="min-w-0">
                  <p
                    className="
                      text-[11px]
                      font-semibold
                      leading-tight
                      text-avalon-black
                      sm:text-[12px]
                    "
                  >
                    {testimonial.name}
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-[10px]
                      leading-tight
                      text-gray-400
                    "
                  >
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}