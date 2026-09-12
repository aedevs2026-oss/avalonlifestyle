"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import PageHero from "@/components/sections/PageHero";
import CompareSlider from "@/components/sections/CompareSlider";
import Button from "@/components/ui/Button";
import { ProductGrid } from "@/components/sections/ProductCard";
import { FAQSection } from "@/components/sections/FAQSection";
import { assets } from "@/lib/assets";
import { mattressCollectionOrder, products } from "@/lib/products";

/** Categories shown on the Mattresses filter bar (matches matters.png). */
const FILTER_CATEGORIES = [
  "All Mattresses",
  "Pocket Spring",
  "Memory Foam",
  "Latex",
  "Gel Memory Foam",
  "Ortho Support",
];

const trustItems = [
  { icon: assets.listing.leaf, title: "Premium Materials" },
  { icon: assets.listing.shield, title: "10 Years Warranty" },
  { icon: assets.listing.heart, title: "Loved by Thousands" },
];

const categoryImages = {
  "All Mattresses": assets.products.prince,
  "Pocket Spring": assets.products.king,
  "Memory Foam": assets.products.celeste,
  Latex: assets.products.brittany,
  "Gel Memory Foam": assets.products.prada,
  "Ortho Support": assets.products.magna,
};

const philosophyFeatures = [
  { icon: assets.singleProduct.breathable, title: "Skin Friendly Fabrics" },
  { icon: assets.singleProduct.pressure, title: "Breathable Design" },
  { icon: assets.singleProduct.durability, title: "Durable & Long-Lasting" },
  { icon: assets.home.healthier, title: "Better Sleep Everyday" },
];

const steps = [
  {
    num: 1,
    title: "Your Sleep Style",
    icon: assets.tryBeforeYouBuy.bed,
  },
  {
    num: 2,
    title: "Your Preferences",
    icon: assets.tryBeforeYouBuy.users,
  },
  {
    num: 3,
    title: "Get Recommendations",
    icon: assets.listing.heart,
  },
  {
    num: 4,
    title: "Better Sleep Awaits",
    sparkle: true,
  },
];

function StepSparkleIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className="text-avalon-red"
      aria-hidden="true"
    >
      <path
        d="M8 4l.9 2.1L11 7l-2.1.9L8 10l-.9-2.1L5 7l2.1-.9L8 4zm8 0l.9 2.1L19 7l-2.1.9L16 10l-.9-2.1L13 7l2.1-.9L16 4zM12 14l1.1 2.6L15.6 18l-2.6 1.1L12 21.7 10.4 19.1 7.8 18l2.6-1.1L12 14z"
        fill="currentColor"
      />
    </svg>
  );
}

const mattressFaq = [
  {
    question: "What is the best mattress for back pain?",
    answer:
      "Look for models with spinal support and medium-to-firm comfort, such as our Ortho Support and Pocket Spring collections. Visit a dealer to try them in person.",
  },
  {
    question: "How long does an Avalon mattress last?",
    answer:
      "Avalon mattresses are engineered for years of nightly use and are backed by up to 10 years of warranty coverage against manufacturing defects.",
  },
  {
    question: "Do you offer a warranty?",
    answer:
      "Yes. Avalon mattresses come with up to 10 years of warranty coverage, protecting you against manufacturing defects.",
  },
  {
    question: "Can I try the mattress before purchasing?",
    answer:
      "Yes. Visit an authorized dealer or book a Try Before You Buy experience to feel the comfort, support and quality in person.",
  },
  {
    question: "How do I choose the right mattress for my needs?",
    answer:
      "Consider sleep position, firmness preference and any support needs. Use the filters on this page, or speak with a sleep expert at a dealer near you.",
  },
];

function matchesCategory(product, category) {
  if (category === "All Mattresses") return true;
  if (category === "Gel Memory Foam") {
    return (
      product.type === "Gel Memory Foam" ||
      product.specs?.includes("Gel Memory Foam")
    );
  }
  if (category === "Ortho Support") {
    return product.type === "Ortho Support" || product.type === "Bonnell Spring";
  }
  return product.type === category;
}

export default function MattressesClient() {
  const [activeCategory, setActiveCategory] = useState("All Mattresses");

  const filtered = useMemo(() => {
    const list = products.filter((p) => matchesCategory(p, activeCategory));
    if (activeCategory !== "All Mattresses") return list;
    return mattressCollectionOrder
      .map((slug) => list.find((p) => p.slug === slug))
      .filter(Boolean);
  }, [activeCategory]);

  return (
    <>
      {/* Hero — matches matters.png: diagonal plate + trust icons + vertical text */}
      <PageHero
        label="OUR MATTRESSES"
        title="Sleep Beyond"
        highlight="Ordinary."
        description="Discover a range of thoughtfully designed mattresses that bring together comfort, support and long-lasting quality."
        image={assets.mattresses.hero}
        imageAlt="Avalon mattress in a modern bedroom with mountain views"
        bakedDiagonal
        verticalText="A BETTER YOU EVERYDAY"
        priority
      >
        <div className="mt-1 flex flex-wrap gap-x-5 gap-y-3">
          {trustItems.map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-2.5 text-[12px] font-medium text-gray-700"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff0f0]">
                <Image
                  src={item.icon}
                  alt=""
                  width={18}
                  height={18}
                  className="icon-avalon-red"
                />
              </span>
              <span className="max-w-[88px] leading-tight">{item.title}</span>
            </div>
          ))}
        </div>
      </PageHero>

      {/* Category filter cards */}
      <section className="sticky top-16 z-30 border-b border-avalon-border bg-white md:top-[72px]">
        <div className="container-avalon py-4 md:py-[1.125rem]">
          <div className="mobile-scroll-rail lg:overflow-visible lg:m-0 lg:p-0">
          <div
            className="mobile-scroll-rail__track gap-2 sm:gap-2.5 lg:flex lg:w-full lg:flex-wrap"
            role="tablist"
            aria-label="Mattress types"
          >
            {FILTER_CATEGORIES.map((cat) => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex min-w-[128px] max-w-[168px] items-center gap-2.5 rounded-[10px] border px-2.5 py-2 text-left transition-all sm:min-w-[140px] sm:px-3 sm:py-2.5 ${
                    active
                      ? "border-avalon-red bg-[#fff6f6] text-avalon-black shadow-[0_1px_0_rgba(237,28,36,0.08)]"
                      : "border-transparent bg-[#f4f4f3] text-gray-600 hover:bg-[#ececeb]"
                  }`}
                >
                  <span
                    className={`relative flex h-9 w-11 shrink-0 items-center justify-center overflow-hidden rounded-md sm:h-10 sm:w-12 ${
                      active ? "bg-white" : "bg-[#fafafa]"
                    }`}
                  >
                    <Image
                      src={categoryImages[cat]}
                      alt=""
                      fill
                      className="object-contain object-center p-0.5"
                      sizes="48px"
                    />
                  </span>
                  <span className="text-[10px] leading-snug font-semibold sm:text-[11px]">
                    {cat}
                  </span>
                </button>
              );
            })}
          </div>
          </div>
        </div>
      </section>

      {/* Collection grid */}
      <section className="bg-white py-10 md:py-14">
        <div className="container-avalon">
          <div
            className="mb-8 flex flex-col gap-5 md:mb-10 lg:flex-row lg:items-end lg:justify-between lg:gap-12"
          >
            <div className="shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-avalon-red sm:text-[11px]">
                Our Collection
              </span>
              <h2
                className="mt-2.5 font-serif text-[1.75rem] leading-[1.12] tracking-[-0.02em] text-avalon-black sm:text-[2rem] md:text-[2.15rem] lg:text-[2.25rem]"
              >
                Choose Your Perfect Mattress
              </h2>
            </div>
            <p
              className="max-w-[300px] text-[12px] leading-[1.55] text-gray-600 sm:text-[13px] lg:ml-auto lg:text-right"
            >
              <span className="block">Different people. Different needs. One promise.</span>
              <span className="mt-1 block">A better sleep for a brighter tomorrow.</span>
            </p>
          </div>

          {filtered.length > 0 ? (
            <ProductGrid
              products={filtered}
              columns={4}
              hidePrice
              hideTypeBadge
              variant="mattresses"
            />
          ) : (
            <div className="rounded-2xl border border-avalon-border bg-avalon-soft px-6 py-16 text-center">
              <p className="font-serif text-2xl text-avalon-black">No mattresses in this category yet.</p>
              <button
                type="button"
                className="mt-4 text-sm font-semibold text-avalon-red"
                onClick={() => setActiveCategory("All Mattresses")}
              >
                View all mattresses
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Compare & Decide */}
      <section className="bg-white pb-6 md:pb-10">
        <div className="container-avalon grid items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
          <div>
            <span className="label-red">COMPARE &amp; DECIDE</span>
            <h2 className="mt-3 mb-4 font-serif text-3xl leading-[1.12] text-avalon-black md:text-[2.5rem]">
              Compare
              <br />
              Mattresses
            </h2>
            <p className="mb-7 max-w-sm text-[15px] leading-relaxed text-gray-600">
              Not sure which mattress is right for you? Drag the slider to
              compare Memory Foam and Pocket Spring side by side.
            </p>
            <Button href="/product-catalog">Compare Now</Button>
          </div>
          <CompareSlider
            leftImage={assets.products.celeste}
            rightImage={assets.products.prince}
            leftLabel="Memory Foam"
            leftSub="Cloud-like comfort"
            rightLabel="Pocket Spring"
            rightSub="Responsive support"
            alt="Compare Memory Foam and Pocket Spring mattresses"
          />
        </div>
      </section>

      {/* Find your perfect mattress — matters.png gray band */}
      <section className="bg-[#f7f7f6] py-12 md:py-14 lg:py-16">
        <div className="container-avalon">
          <div
            className="
              grid items-center gap-10
              lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)_minmax(0,0.82fr)]
              lg:gap-5 xl:gap-8
            "
          >
            <div className="max-w-[340px]">
              <span className="label-red">FIND YOUR PERFECT MATTRESS</span>
              <h2 className="mt-3 mb-4 font-serif text-[1.75rem] leading-[1.14] text-avalon-black sm:text-[2rem] lg:text-[2.05rem]">
                Not Sure Which
                <br />
                Mattress is for You?
              </h2>
              <p className="mb-7 max-w-[300px] text-[14px] leading-relaxed text-gray-600 sm:text-[15px]">
                Answer a few simple questions and we&apos;ll help you find the
                right mattress for your needs.
              </p>
              <Button href="/try-before-you-buy" className="px-7">
                Find Your Perfect Mattress
              </Button>
            </div>

            <div className="flex justify-center px-0 lg:px-2">
              <ol className="flex w-full max-w-[520px] items-start list-none p-0 m-0">
                {steps.map((step, i) => (
                  <li key={step.num} className="flex min-w-0 flex-1 items-start">
                    <div className="flex min-w-0 flex-1 flex-col items-center">
                      <div
                        className="
                          flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white
                          shadow-[0_0_0_1px_rgba(237,28,36,0.06),0_8px_28px_rgba(237,28,36,0.12)]
                        "
                      >
                        {step.sparkle ? (
                          <StepSparkleIcon />
                        ) : (
                          <Image
                            src={step.icon}
                            alt=""
                            width={24}
                            height={24}
                            className="icon-avalon-red"
                          />
                        )}
                      </div>
                      <p className="mt-3 max-w-[5.25rem] text-center text-[10px] leading-snug font-medium text-avalon-black sm:max-w-none sm:text-[11px]">
                        {step.num}. {step.title}
                      </p>
                    </div>
                    {i < steps.length - 1 && (
                      <div
                        className="mt-7 h-px min-w-[4px] flex-1 border-t border-dashed border-gray-300"
                        aria-hidden="true"
                      />
                    )}
                  </li>
                ))}
              </ol>
            </div>

            <div className="relative min-h-[220px] overflow-hidden sm:min-h-[260px] lg:min-h-[280px] lg:min-w-[200px]">
              <Image
                src={assets.mattresses.guide}
                alt="Bright bedroom corner with an Avalon mattress, pillow and plant by the window"
                fill
                className="object-cover object-right"
                sizes="(max-width: 1024px) 100vw, 32vw"
              />
              <div
                className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#f7f7f6] via-[#f7f7f6]/80 to-transparent sm:w-14 lg:w-16"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Every Mattress A Healthier Tomorrow */}
      <section className="grid lg:grid-cols-2">
        <div className="relative min-h-[320px] lg:min-h-[440px]">
          <Image
            src={assets.mattresses.detail}
            alt="Close-up of Avalon mattress quilting and fabric"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div className="flex flex-col justify-center bg-[#f7f7f6] px-6 py-10 sm:px-10 lg:px-14 lg:py-16">
          <h2 className="mb-4 font-serif text-3xl leading-[1.12] text-avalon-black md:text-[2.35rem]">
            Every Mattress
            <br />
            A Healthier Tomorrow.
          </h2>
          <p className="mb-9 max-w-md text-sm leading-relaxed text-gray-600">
            Crafted with care, designed for your well-being. Because great sleep
            leads to a brighter, healthier life.
          </p>
          <div className="grid grid-cols-2 gap-x-5 gap-y-7 sm:grid-cols-4 sm:gap-x-4">
            {philosophyFeatures.map((f) => (
              <div key={f.title} className="flex flex-col items-start gap-2.5 sm:items-center sm:text-center">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white">
                  <Image
                    src={f.icon}
                    alt=""
                    width={20}
                    height={20}
                    className="icon-avalon-red"
                  />
                </span>
                <p className="text-[13px] font-semibold leading-snug text-avalon-black sm:text-sm">
                  {f.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQSection
        label="FREQUENTLY ASKED QUESTIONS"
        title="Your Mattress Questions, Answered."
        description="Everything you need to know about Avalon mattresses."
        items={mattressFaq}
        buttonHref="/resources"
        buttonLabel="View All FAQs"
      />

      {/* Showroom CTA — matters.png: title left, button right */}
      <section className="relative flex min-h-[200px] items-center overflow-hidden md:min-h-[240px]">
        <Image
          src={assets.findDealer.hero}
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-avalon-navy/75" />
        <div className="container-avalon relative z-10 flex flex-col gap-6 py-12 text-white sm:flex-row sm:items-center sm:justify-between sm:py-14">
          <h2 className="max-w-lg font-serif text-[1.75rem] leading-tight sm:text-3xl md:text-[2.15rem]">
            Experience Avalon at a Showroom Near You.
          </h2>
          <Button href="/find-a-dealer" className="shrink-0 self-start sm:self-center">
            Find a Dealer
          </Button>
        </div>
      </section>
    </>
  );
}
