import Image from "next/image";
import PageHero from "@/components/sections/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { assets } from "@/lib/assets";

export const metadata = {
  title: "About Avalon",
  description:
    "More than just sleep. Learn about Avalon's story, purpose, manufacturing excellence, and commitment to a brighter tomorrow.",
};

const stats = [
  { value: "10+", label: "Years of Excellence" },
  { value: "500K+", label: "Happy Customers" },
  { value: "100+", label: "Dealer Network" },
  { value: "Pan India", label: "Presence" },
];

const purposeItems = [
  { label: "Healthier People", icon: assets.listing.heart },
  { label: "Happier Homes", icon: assets.whyAvalon.home },
  { label: "Sustainable Future", icon: assets.whyAvalon.leaf },
  { label: "Stronger Communities", icon: assets.tryBeforeYouBuy.users },
];

const manufacturingFeatures = [
  {
    title: "Premium Materials",
    description: "We use high-quality, responsibly sourced materials.",
    icon: assets.listing.leaf,
  },
  {
    title: "Advanced Technology",
    description: "Engineered for superior comfort and durability.",
    icon: assets.about.purpose,
  },
  {
    title: "Rigorous Quality Checks",
    description: "Every product goes through strict quality testing.",
    icon: assets.listing.shield,
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        label="ABOUT AVALON"
        title="More Than"
        highlight="Just"
        titleSuffix=" Sleep"
        lede="A healthier tomorrow begins with a better today."
        description="At Avalon, we believe great sleep has the power to transform lives. We design premium mattresses and furniture that bring comfort, support and well-being to every home."
        leftVerticalText="A BETTER YOU EVERYDAY"
        image={assets.about.hero}
        imageAlt="Avalon mattress in a bright modern bedroom at sunrise"
        bakedDiagonal
        priority
      />

      {/* Our Story */}
      <section className="section-padding bg-white">
        <div className="container-avalon grid items-center gap-10 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-16">
          <div className="relative aspect-[3351/2835] w-full max-w-[480px]">
            <Image
              src={assets.about.storyCollage}
              alt="Avalon bedding with a handwritten note reading Better Sleep, A Brighter Tomorrow"
              fill
              className="object-contain object-left"
              sizes="(max-width: 1024px) 100vw, 420px"
            />
          </div>
          <div>
            <SectionHeading
              label="OUR STORY"
              title="Built on Trust."
              highlight="Driven by a Brighter Tomorrow."
              highlightTone="dark"
              block
              description="Avalon Premium Mattress was founded with a simple belief – that everyone deserves a better tomorrow. With a focus on innovation, quality and customer well-being, we create sleep solutions that make a real difference in everyday life."
            />
            <dl className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 sm:gap-y-0">
              {stats.map((stat, i) => (
                <div
                  key={stat.value}
                  className={
                    i === 0 ? "sm:pr-4" : "sm:border-l sm:border-avalon-border sm:pl-4"
                  }
                >
                  <dt className="font-serif text-2xl font-bold text-avalon-red lg:text-[1.75rem]">
                    {stat.value}
                  </dt>
                  <dd className="mt-1 text-sm leading-snug text-gray-600">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Our Purpose */}
      <section className="bg-white pb-8 md:pb-12">
        <div className="container-avalon">
          <div className="grid items-center gap-10 rounded-2xl bg-avalon-soft px-6 py-10 sm:px-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-14 lg:px-12 lg:py-14">
            <SectionHeading
              label="OUR PURPOSE"
              title="Better Sleep"
              highlight="for a Better World"
              highlightTone="dark"
              block
              description="We are committed to creating thoughtfully designed mattresses and furniture that enhance lives, support health and contribute to happier, more productive tomorrows."
            />
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {purposeItems.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center rounded-2xl bg-white px-4 py-7 text-center shadow-[0_2px_14px_rgba(0,0,0,0.04)]"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#fff0f0]">
                    <Image
                      src={item.icon}
                      alt=""
                      width={24}
                      height={24}
                      className="icon-avalon-red"
                    />
                  </div>
                  <p className="text-sm font-semibold leading-snug text-avalon-black">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Manufacturing */}
      <section className="grid lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
        <div className="relative min-h-[360px] lg:min-h-[460px]">
          <Image
            src={assets.about.manufacturing}
            alt="An Avalon craftsperson finishing a mattress on the production floor"
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 55vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/40 to-black/25" />
          <div className="relative flex h-full min-h-[360px] flex-col justify-center p-8 text-white lg:min-h-[460px] lg:p-12 xl:p-14">
            <span className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/90">
              OUR MANUFACTURING
            </span>
            <h2 className="mb-4 font-serif text-3xl leading-[1.12] md:text-[2.5rem]">
              Crafted with
              <br />
              Care and Precision
            </h2>
            <p className="mb-7 max-w-sm text-sm leading-relaxed text-white/88">
              From carefully selected materials to advanced manufacturing
              processes, every Avalon mattress is crafted with precision, care
              and a commitment to quality.
            </p>
            <Button href="/why-avalon" className="self-start">
              Our Manufacturing
            </Button>
          </div>
        </div>
        <div className="flex flex-col justify-center gap-4 bg-white p-6 sm:p-8 lg:gap-5 lg:p-10 xl:p-12">
          {manufacturingFeatures.map((feature) => (
            <div
              key={feature.title}
              className="flex items-start gap-4 rounded-2xl border border-avalon-border bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fff0f0]">
                <Image
                  src={feature.icon}
                  alt=""
                  width={22}
                  height={22}
                  className="icon-avalon-red"
                />
              </div>
              <div>
                <h3 className="mb-1 text-[15px] font-semibold text-avalon-black">
                  {feature.title}
                </h3>
                <p className="text-sm leading-snug text-gray-600">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sustainability — full-width plate + aligned overlays */}
      <section className="relative min-h-[340px] md:min-h-[400px] lg:min-h-[440px]">
        <Image
          src={assets.about.sustainabilityBand}
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority={false}
        />
        <div className="relative grid min-h-[340px] md:min-h-[400px] lg:min-h-[440px] lg:grid-cols-2">
          <div className="flex flex-col justify-center p-8 text-white md:p-10 lg:bg-transparent lg:p-14">
            <h3 className="mb-4 font-serif text-2xl leading-[1.12] md:text-[2rem]">
              A Cleaner
              <br />
              Greener Tomorrow
            </h3>
            <p className="mb-6 max-w-sm text-sm leading-relaxed text-white/92">
              We are committed to sustainable practices that reduce our
              environmental impact and help create a healthier planet for future
              generations.
            </p>
            <Button href="/why-avalon" variant="white" className="self-start">
              Our Sustainability
            </Button>
          </div>
          <div className="flex flex-col justify-center bg-white/90 p-8 md:p-10 lg:bg-transparent lg:p-14">
            <span className="label-red mb-3 flex items-center gap-2">
              <Image
                src={assets.whyAvalon.leaf}
                alt=""
                width={16}
                height={16}
                className="icon-avalon-red"
              />
              SUSTAINABILITY
            </span>
            <h2 className="mb-4 font-serif text-3xl leading-[1.12] text-avalon-black md:text-[2.25rem]">
              Responsibility
              <br />
              for a Brighter Future
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-gray-600">
              From eco-friendly materials to responsible manufacturing, we take
              steps today for a cleaner, greener tomorrow.
            </p>
          </div>
        </div>
      </section>

      {/* Beyond Mattresses — full-bleed lifestyle + white content card */}
      <section className="relative min-h-[320px] overflow-hidden sm:min-h-[380px] lg:min-h-[420px]">
        <Image
          src={assets.about.completeComfort}
          alt="An Avalon bed and armchair in a warm, wood-panelled room"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="container-avalon relative z-10 flex min-h-[320px] items-center py-12 sm:min-h-[380px] lg:min-h-[420px] lg:py-16">
          <div className="max-w-[400px] bg-white px-8 py-9 shadow-[0_8px_32px_rgba(0,0,0,0.08)] sm:px-10 sm:py-10">
            <span className="label-red">BEYOND MATTRESSES</span>
            <h2 className="mt-3 mb-4 font-serif text-3xl leading-[1.12] text-avalon-black md:text-[2.35rem]">
              Complete Comfort
              <br />
              for Every Space
            </h2>
            <p className="mb-7 text-[15px] leading-relaxed text-gray-600">
              From mattresses to sofas, chairs and more, Avalon brings comfort
              and style to every corner of your home.
            </p>
            <Button href="/furniture" variant="outline">
              Explore Our Range
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
