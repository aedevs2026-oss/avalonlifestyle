import Image from "next/image";
import Link from "next/link";
import PageHero, { CTABanner } from "@/components/sections/PageHero";
import { FAQSection } from "@/components/sections/FAQSection";
import ResourceVideoCard from "@/components/resources/ResourceVideoCard";
import ResourcesDownloadCard from "@/components/resources/ResourcesDownloadCard";
import ResourcesSectionHeader from "@/components/resources/ResourcesSectionHeader";
import { assets } from "@/lib/assets";
import { faqItems } from "@/lib/site";
import { getResourceDownloads } from "@/lib/cms/resources";

export const metadata = {
  title: "Resources",
  description:
    "Knowledge for better sleep. Explore guides, brochures, videos, and FAQs to help you make the right choice.",
};

const resourceTypes = [
  {
    icon: assets.becomeDealer.document,
    title: "Brochures",
    description: "Product catalogues & brochures",
    href: "#downloads",
  },
  {
    icon: assets.becomeDealer.document,
    title: "Guides",
    description: "Sleep tips & buying guides",
    href: "#guides",
  },
  {
    icon: assets.listing.shield,
    title: "Warranty",
    description: "Warranty documents & information",
    href: "#downloads",
  },
  {
    icon: assets.listing.leaf,
    title: "Care",
    description: "Mattress care & maintenance",
    href: "#guides",
  },
  {
    icon: assets.resources.video,
    title: "Videos",
    description: "Product videos & brand stories",
    href: "#videos",
  },
  {
    icon: assets.resources.chatHelp,
    title: "FAQs",
    description: "Answers to common questions",
    href: "#faq",
  },
];

const guides = [
  {
    title: "10 Tips for Better Sleep",
    category: "SLEEP GUIDE",
    image: assets.home.moreThanMattress,
    description: "Simple habits that can help you sleep better every night.",
  },
  {
    title: "How to Choose the Right Mattress",
    category: "BUYING GUIDE",
    image: assets.tryBeforeYouBuy.bedroom,
    description: "A complete guide to finding your perfect mattress.",
  },
  {
    title: "Creating a Healthier Home",
    category: "LIVING GUIDE",
    image: assets.home.findShowroom,
    description: "Furniture ideas for a more comfortable and beautiful living space.",
  },
];

const videos = [
  {
    title: "The Avalon Difference",
    subtitle: "Quality. Comfort. Trust.",
    src: assets.resources.avalonDifference,
    poster: assets.products.prince,
    duration: "02:15",
  },
  {
    title: "Inside Our Manufacturing",
    subtitle: "Crafted with Care",
    src: assets.resources.manufacturing,
    poster: assets.home.manufacturing,
    duration: "01:48",
  },
  {
    title: "A Healthier Tomorrow",
    subtitle: "Because Better Sleep Matters",
    src: assets.resources.feelBetter,
    poster: assets.home.moreThanMattress,
    duration: "02:30",
  },
];

export default async function ResourcesPage() {
  const downloads = await getResourceDownloads();
  return (
    <div className="resources-page">
      <PageHero
        label="RESOURCES"
        title="Knowledge for"
        highlight="Better"
        titleSuffix=" Sleep."
        description="Explore our guides, brochures, videos and useful information to help you make the right choice for a healthier, brighter tomorrow."
        leftVerticalText="GOOD SLEEP BUILDS A BRIGHTER TOMORROW"
        image={assets.resources.hero}
        imageAlt="Stack of books about better sleep on a bedside table"
        bakedDiagonal
        sectionClassName="resources-hero"
        mobileImagePositionClass="max-lg:object-[62%_center]"
        priority
      />

      <section className="resources-categories border-b border-avalon-border bg-white">
        <div className="container-avalon py-8 md:py-10 lg:py-12">
          <div className="mobile-scroll-rail md:mx-0 md:overflow-visible md:p-0 lg:overflow-visible">
            <div className="mobile-scroll-rail__track gap-4 py-1 md:grid md:w-full md:max-w-none md:grid-cols-3 md:gap-x-4 md:gap-y-8 md:py-0 lg:grid-cols-6 lg:gap-6">
          {resourceTypes.map((type) => (
            <Link
              key={type.title}
              href={type.href}
              className="group block w-[7.25rem] shrink-0 text-center transition-opacity hover:opacity-90 sm:w-[7.75rem] md:w-auto md:shrink"
            >
              <div className="mx-auto mb-3 flex h-[3.75rem] w-[3.75rem] items-center justify-center rounded-full border border-avalon-red/25 bg-[#fff0f0] transition group-hover:border-avalon-red/45 sm:h-16 sm:w-16">
                <Image
                  src={type.icon}
                  alt=""
                  width={26}
                  height={26}
                  className="icon-avalon-red"
                />
              </div>
              <h3 className="text-sm font-semibold text-avalon-black">{type.title}</h3>
              <p className="mt-1.5 text-[11px] leading-snug text-gray-500 sm:text-xs">
                {type.description}
              </p>
            </Link>
          ))}
            </div>
          </div>
        </div>
      </section>

      <section id="downloads" className="resources-downloads section-padding bg-white">
        <div className="container-avalon">
          <ResourcesSectionHeader
            className="resources-section-header"
            label="FEATURED DOWNLOADS"
            title="Brochures & Catalogues"
            linkHref="#downloads"
            linkLabel="View All Downloads"
          />
          <div className="mobile-scroll-rail md:mx-0 md:overflow-visible md:p-0 lg:overflow-visible">
            <div className="mobile-scroll-rail__track gap-3 sm:gap-4 md:grid md:w-full md:max-w-none md:grid-cols-3 md:gap-4 lg:grid-cols-5">
              {downloads.map((dl) => (
                <div
                  key={dl.id || dl.title}
                  className="w-[9.25rem] shrink-0 sm:w-[10.5rem] md:w-auto md:shrink"
                >
                  <ResourcesDownloadCard {...dl} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="guides" className="resources-guides section-padding border-t border-avalon-border/60 bg-white">
        <div className="container-avalon">
          <ResourcesSectionHeader
            className="resources-section-header"
            label="USEFUL GUIDES"
            title="Sleep Better, Live Better"
            linkHref="#guides"
            linkLabel="View All Guides"
          />
          <div className="mobile-card-stack grid gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {guides.map((guide) => (
              <article
                key={guide.title}
                className="overflow-hidden rounded-2xl border border-avalon-border bg-white"
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={guide.image}
                    alt={guide.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <span className="absolute top-3 left-3 rounded bg-[#fff0f0] px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-wide text-avalon-red">
                    {guide.category}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="mb-2 font-serif text-lg leading-snug text-avalon-black md:text-xl">
                    {guide.title}
                  </h3>
                  <p className="mb-4 text-sm leading-relaxed text-gray-600">{guide.description}</p>
                  <Link
                    href="/resources#guides"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-avalon-red hover:underline"
                  >
                    Read More
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path
                        d="M3 8H13M13 8L9 4M13 8L9 12"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="videos" className="resources-videos section-padding bg-[#fafafa]">
        <div className="container-avalon">
          <ResourcesSectionHeader
            className="resources-section-header"
            label="PRODUCT VIDEOS"
            title="See the Comfort"
            linkHref="#videos"
            linkLabel="View All Videos"
          />
          <div className="mobile-card-stack grid gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {videos.map((video) => (
              <ResourceVideoCard key={video.title} {...video} />
            ))}
          </div>
        </div>
      </section>

      <FAQSection
        id="faq"
        className="resources-faq"
        label="FREQUENTLY ASKED QUESTIONS"
        title="Your Questions, Answered."
        description="Find quick answers to common questions about our products, warranty, care and more."
        items={faqItems}
        buttonHref="/contact"
        buttonLabel="View All FAQs"
      />

      <CTABanner
        className="resources-cta"
        title="Better Sleep. A Brighter Tomorrow."
        description="Still have questions? Our team is here to help you."
        buttonLabel="Contact Us"
        buttonHref="/contact"
        backgroundImage={assets.whyAvalon.ctaBand}
      />
    </div>
  );
}
