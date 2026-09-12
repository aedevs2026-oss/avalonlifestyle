import Image from "next/image";
import PageHero, { CTABanner } from "@/components/sections/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { assets } from "@/lib/assets";

export const metadata = {
  title: "Why Avalon",
  description:
    "A better tomorrow starts tonight. Discover why thousands trust Avalon for premium sleep solutions.",
};

const values = [
  { icon: assets.listing.heart, title: "Healthier", subtitle: "People" },
  { icon: assets.whyAvalon.home, title: "Happier", subtitle: "Homes" },
  { icon: assets.whyAvalon.leaf, title: "Sustainable", subtitle: "Future" },
  { icon: assets.tryBeforeYouBuy.users, title: "Stronger", subtitle: "Communities" },
];

const stats = [
  { value: "10+", label: "Years of Excellence" },
  { value: "500K+", label: "Happy Customers" },
  { value: "100+", label: "Dealer Network" },
  { value: "Pan India", label: "Presence" },
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

const sustainabilityItems = [
  "Eco-Friendly Materials",
  "Reduced Environmental Impact",
  "Sustainable Manufacturing",
  "A Greener Tomorrow",
];

const certifications = [
  { title: "ISO 9001:2015", subtitle: "Certified", icon: assets.whyAvalon.globe },
  { title: "OEKO-TEX®", subtitle: "Standard 100", icon: assets.whyAvalon.leaf },
  { title: "CertiPUR-US®", subtitle: "Certified Foam", icon: assets.whyAvalon.layers },
  {
    title: "Durable &",
    subtitle: "Long-Lasting",
    icon: assets.whyAvalon.infinity,
  },
];

const testimonials = [
  {
    title: "Exceptional Comfort",
    quote:
      "Avalon has completely transformed my sleep. The comfort and support are truly amazing.",
    name: "Ramesh K.",
    location: "Chennai",
    initials: "RK",
  },
  {
    title: "Best Investment",
    quote:
      "The quality is outstanding and the design is elegant. It's the best investment for my family's health.",
    name: "Priya S.",
    location: "Bengaluru",
    initials: "PS",
  },
  {
    title: "Truly Premium",
    quote:
      "From quality to service, everything about Avalon feels premium. Highly recommended!",
    name: "Arun M.",
    location: "Coimbatore",
    initials: "AM",
  },
];

export default function WhyAvalonPage() {
  return (
    <>
      <PageHero
        label="WHY AVALON"
        title="A Better"
        highlight="Tomorrow"
        titleSuffix=" Starts Tonight."
        description="At Avalon, we believe great sleep has the power to transform lives. We design premium mattresses and furniture that bring comfort, support and well-being to every home."
        footnote={"BETTER SLEEP,\nA BRIGHTER TOMORROW."}
        image={assets.whyAvalon.hero}
        imageAlt="Avalon mattress in a bright modern bedroom at sunrise"
        bakedDiagonal
        priority
      />

      {/* Core values + commitment */}
      <section className="border-y border-avalon-border bg-white">
        <div className="container-avalon grid grid-cols-2 gap-6 py-8 md:grid-cols-4 lg:grid-cols-[repeat(4,minmax(0,1fr))_minmax(0,200px)] lg:items-center lg:gap-4">
          {values.map((item, i) => (
            <div
              key={item.title}
              className={`flex flex-col items-center text-center ${
                i > 0 ? "lg:border-l lg:border-avalon-border" : ""
              }`}
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#fff0f0]">
                <Image
                  src={item.icon}
                  alt=""
                  width={22}
                  height={22}
                  className="icon-avalon-red"
                />
              </div>
              <p className="text-sm font-semibold text-avalon-black">{item.title}</p>
              <p className="text-xs text-gray-500">{item.subtitle}</p>
            </div>
          ))}
          <div className="col-span-2 hidden flex-col justify-center lg:col-span-1 lg:flex lg:border-l lg:border-avalon-border lg:pl-8">
            <p className="text-[10px] font-semibold uppercase leading-relaxed tracking-[0.14em] text-gray-500">
              More than a brand. A commitment to a better you.
            </p>
            <span className="mt-3 block h-px w-10 bg-avalon-red" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="relative overflow-hidden bg-white section-padding">
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[42%] lg:block">
          <Image
            src={assets.whyAvalon.storySketch}
            alt=""
            fill
            className="object-contain object-right opacity-90"
            sizes="42vw"
          />
        </div>
        <div className="container-avalon relative z-10">
          <div className="max-w-xl">
            <SectionHeading
              label="OUR STORY"
              title="Built on Trust."
              highlight="Driven by a Brighter Tomorrow."
              highlightTone="dark"
              block
            />
            <Button href="/about" className="mt-8">
              Our Journey
            </Button>
          </div>
          <dl className="mt-14 grid grid-cols-2 gap-x-4 gap-y-8 border-t border-avalon-border pt-10 sm:grid-cols-4 sm:gap-y-0">
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
                <dd className="mt-1 text-sm leading-snug text-gray-600">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Crafted for a Better Living */}
      <section className="grid lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
        <div className="relative min-h-[380px] lg:min-h-[460px]">
          <Image
            src={assets.whyAvalon.betterLiving}
            alt="Misty pine forest representing Avalon manufacturing"
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 55vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/35 to-black/20" />
          <div className="relative flex h-full min-h-[380px] flex-col justify-end p-8 text-white lg:min-h-[460px] lg:justify-center lg:p-12 xl:p-14">
            <span className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/92">
              Crafted for a Better Living
            </span>
            <p className="mb-7 max-w-sm text-sm leading-relaxed text-white/88">
              From carefully selected materials to advanced manufacturing processes,
              every Avalon mattress is crafted with precision, care and a commitment
              to quality.
            </p>
            <Button href="/about" variant="white" className="self-start">
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

      {/* Sustainability */}
      <section className="section-padding bg-white">
        <div className="container-avalon grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)_minmax(0,0.95fr)] lg:gap-12">
          <div>
            <span className="label-red">SUSTAINABILITY</span>
            <h2 className="mt-3 mb-4 font-serif text-3xl leading-[1.12] text-avalon-black md:text-[2.25rem]">
              Responsibility
              <br />
              for a Brighter Future.
            </h2>
            <p className="mb-6 max-w-sm text-[15px] leading-relaxed text-gray-600">
              We are committed to sustainable practices that reduce our environmental
              impact and help create a healthier planet for future generations.
            </p>
            <Button href="/about" variant="outline">
              Our Sustainability
            </Button>
          </div>

          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
              <Image
                src={assets.whyAvalon.leaf}
                alt=""
                width={32}
                height={32}
                className="opacity-90"
              />
            </div>
            <ul className="w-full max-w-xs space-y-4">
              {sustainabilityItems.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-sm font-medium text-avalon-black"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-50">
                    <Image
                      src={assets.whyAvalon.leaf}
                      alt=""
                      width={16}
                      height={16}
                    />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative aspect-[4/5] min-h-[280px] overflow-hidden rounded-2xl sm:min-h-[320px]">
            <Image
              src={assets.whyAvalon.healthierPlanet}
              alt="Sunlit forest with the words Good Sleep, A Healthier Planet"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 28vw"
            />
          </div>
        </div>
      </section>

      {/* Our Belief */}
      <section className="bg-white">
        <div className="grid items-center lg:grid-cols-2">
          <div className="relative h-[300px] sm:h-[380px] lg:h-[440px]">
            <Image
              src={assets.whyAvalon.belief}
              alt="Woman waking up refreshed on an Avalon mattress"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
            <span className="label-red">OUR BELIEF</span>
            <h2 className="mt-3 mb-4 font-serif text-3xl leading-[1.12] text-avalon-black md:text-[2.5rem]">
              Better Sleep.
              <br />
              A Brighter You.
            </h2>
            <p className="mb-7 max-w-md text-[15px] leading-relaxed text-gray-600">
              We believe that quality sleep leads to a healthier mind, a happier life
              and a more productive tomorrow. Avalon is here to support you every step
              of the way.
            </p>
            <Button href="/mattresses" variant="outline">
              Explore Our Range
            </Button>
          </div>
        </div>
      </section>

      {/* Trusted Quality */}
      <section className="section-padding bg-white">
        <div className="container-avalon grid items-center gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <div>
            <span className="label-red">TRUSTED QUALITY</span>
            <h2 className="mt-3 font-serif text-3xl leading-[1.12] text-avalon-black md:text-[2.25rem]">
              Certified for
              <br />
              Your Peace of Mind.
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {certifications.map((cert, i) => (
              <div
                key={cert.title}
                className={`text-center ${i === 0 ? "" : "sm:border-l sm:border-avalon-border"}`}
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#fff0f0]">
                  <Image
                    src={cert.icon}
                    alt=""
                    width={22}
                    height={22}
                    className="icon-avalon-red"
                  />
                </div>
                <p className="text-sm font-semibold leading-snug text-avalon-black">
                  {cert.title}
                </p>
                <p className="text-xs text-gray-500">{cert.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real Stories */}
      <section className="bg-[#fafafa] section-padding">
        <div className="container-avalon">
          <div className="mb-10 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end">
            <div>
              <span className="label-red">REAL STORIES</span>
              <h2 className="mt-3 font-serif text-3xl text-avalon-black md:text-[2.25rem]">
                Loved by Thousands.
              </h2>
            </div>
            <div className="lg:flex lg:justify-end">
              <Button href="/resources" variant="outline">
                View All Stories
              </Button>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {testimonials.map((t) => (
              <article
                key={t.name}
                className="rounded-xl border border-gray-200 bg-white px-6 py-6 shadow-sm"
              >
                <h3 className="text-sm font-semibold text-avalon-black">{t.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-gray-600">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-4 flex gap-0.5" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Image
                      key={i}
                      src={assets.singleProduct.star}
                      alt=""
                      width={14}
                      height={14}
                      className="icon-avalon-red"
                    />
                  ))}
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-avalon-soft text-[11px] font-bold text-avalon-red"
                    aria-hidden="true"
                  >
                    {t.initials}
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-avalon-black">{t.name}</p>
                    <p className="text-[11px] text-gray-400">{t.location}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        title="Better Sleep. A Brighter Tomorrow."
        description="Join thousands who have chosen Avalon for a healthier, happier life. Discover the difference today."
        buttonLabel="Find a Dealer"
        buttonHref="/find-a-dealer"
        backgroundImage={assets.whyAvalon.ctaBand}
      />
    </>
  );
}
