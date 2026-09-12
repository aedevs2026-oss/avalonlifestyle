"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PageHero, { CTABanner } from "@/components/sections/PageHero";
import Button from "@/components/ui/Button";
import FurnitureCategoryIcon from "@/components/furniture/FurnitureCategoryIcon";
import { furnitureImages } from "@/lib/furnitureImages";
import { assets } from "@/lib/assets";

const categoryNav = [
  "Sofas",
  "Couches",
  "Chairs",
  "Beds",
  "Tables",
  "Storage",
  "Divan",
  "Outdoor",
];

const featured = [
  {
    name: "Sofas",
    tagline: "Comfort meets elegance",
    image: furnitureImages.featured.sofas,
    href: "/product-catalog",
  },
  {
    name: "Couches",
    tagline: "Designed for everyday living",
    image: furnitureImages.featured.couches,
    href: "/product-catalog",
    productShot: true,
  },
  {
    name: "Chairs",
    tagline: "Style with purpose",
    image: furnitureImages.featured.chairs,
    href: "/product-catalog",
  },
  {
    name: "Tables",
    tagline: "Functional beauty",
    image: furnitureImages.featured.tables,
    href: "/product-catalog",
  },
];

const lifestyleSlides = furnitureImages.lifestyle;

const rooms = [
  { name: "Living Room", image: furnitureImages.rooms.livingRoom, href: "/product-catalog" },
  { name: "Bedroom", image: furnitureImages.rooms.bedroom, href: "/mattresses" },
  { name: "Dining Room", image: furnitureImages.rooms.diningRoom, href: "/product-catalog" },
];

const craftPoints = [
  "Premium Quality Materials",
  "Expert Craftsmanship",
  "Modern & Timeless Designs",
  "Built for Everyday Living",
];

const testimonials = [
  {
    quote:
      "Our living room feels complete. The Avalon sofa is beautiful and incredibly comfortable.",
    name: "Anitha R.",
    location: "Chennai",
    avatar: furnitureImages.avatars.anitha,
  },
  {
    quote:
      "Quality you can see and feel. The dining set has transformed our home.",
    name: "Karthik M.",
    location: "Coimbatore",
    avatar: furnitureImages.avatars.karthik,
  },
  {
    quote:
      "Elegant designs and durable build — exactly what we wanted for our new home.",
    name: "Divya S.",
    location: "Bengaluru",
    avatar: furnitureImages.avatars.divya,
  },
];

function CircleArrow({ light = false }) {
  return (
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full shadow-md transition ${
        light
          ? "bg-white/95 text-avalon-black group-hover:bg-avalon-red group-hover:text-white"
          : "bg-white text-avalon-black group-hover:bg-avalon-red group-hover:text-white"
      }`}
      aria-hidden="true"
    >
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <path
          d="M3 8H13M13 8L9 4M13 8L9 12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function UspLineIcon({ type }) {
  const className = "h-6 w-6 text-avalon-black";
  if (type === "diamond") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
        <path
          d="M12 3l8 7-8 11L4 10l8-7z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (type === "leaf") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
        <path
          d="M12 21c-4-4-6-8-6-12a6 6 0 0112 0c0 4-2 8-6 12z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    );
  }
  if (type === "home") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
        <path
          d="M4 10.5L12 4l8 6.5V20a1 1 0 01-1 1h-5v-6H10v6H5a1 1 0 01-1-1v-9.5z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 3l7 3v6c0 4.5-3.5 8-7 9-3.5-1-7-4.5-7-9V6l7-3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const uspItems = [
  { type: "diamond", title: "Premium Craftsmanship" },
  { type: "leaf", title: "Sustainable Materials" },
  { type: "home", title: "Designed for Indian Homes" },
  { type: "shield", title: "Trusted Quality" },
];

export default function FurnitureClient() {
  const [activeCategory, setActiveCategory] = useState("Sofas");
  const [lifestyleIndex, setLifestyleIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const visibleTestimonials = [
    testimonials[testimonialIndex % testimonials.length],
    testimonials[(testimonialIndex + 1) % testimonials.length],
    testimonials[(testimonialIndex + 2) % testimonials.length],
  ];

  return (
    <>
      <PageHero
        label="FURNITURE COLLECTION"
        title="Design Spaces You'll"
        highlight="Love"
        titleSuffix=" to Live In"
        description="Thoughtfully crafted furniture that brings comfort, style and harmony to every corner of your home."
        image={furnitureImages.hero}
        imageAlt="Luxury living room with premium Avalon-style furniture"
        bakedDiagonal={false}
        imagePosition="object-[62%_center]"
        imageTagline="A Better You Everyday"
        carouselDots={{ total: 2, active: 0 }}
        priority
      >
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <Button href="/product-catalog">Explore Collection</Button>
          <Link
            href="/find-a-dealer"
            className="inline-flex items-center gap-2 rounded-full border border-avalon-black bg-transparent px-6 py-3 text-sm font-semibold text-avalon-black transition hover:border-avalon-red hover:text-avalon-red"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M8 14s5-3.5 5-7a5 5 0 10-10 0c0 3.5 5 7 5 7z"
                stroke="currentColor"
                strokeWidth="1.4"
              />
              <circle cx="8" cy="7" r="1.5" fill="currentColor" />
            </svg>
            Visit a Showroom
          </Link>
        </div>
        <div className="mt-8 border-t border-avalon-border/70 pt-6">
          <div className="grid grid-cols-2 sm:flex sm:divide-x sm:divide-avalon-border/80">
            {[
              "1000+ Happy Homes",
              "Premium Quality Materials",
              "Modern Designs",
              "Trusted Across India",
            ].map((label) => (
              <p
                key={label}
                className="py-2 text-[11px] font-semibold leading-snug text-gray-600 sm:flex-1 sm:px-5 sm:py-0 sm:first:pl-0 sm:last:pr-0 sm:text-[12px]"
              >
                {label}
              </p>
            ))}
          </div>
        </div>
      </PageHero>

      {/* Category icon bar */}
      <section className="border-b border-avalon-border/60 bg-[#FAF9F6]">
        <div className="container-avalon py-4 md:py-5">
          <div className="mobile-scroll-rail lg:overflow-visible lg:p-0 lg:m-0">
          <div className="mobile-scroll-rail__track gap-2 sm:gap-2.5 lg:flex lg:w-full lg:flex-wrap lg:justify-center" role="tablist" aria-label="Furniture categories">
            {categoryNav.map((name) => {
              const active = activeCategory === name;
              return (
                <button
                  key={name}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveCategory(name)}
                  className={`flex min-w-[88px] flex-col items-center gap-2.5 rounded-xl border bg-white px-3 py-4 transition-all sm:min-w-[104px] ${
                    active
                      ? "border-avalon-red text-avalon-red shadow-[0_8px_24px_-8px_rgba(210,35,42,0.25)]"
                      : "border-avalon-border/70 text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  <FurnitureCategoryIcon
                    name={name}
                    className={`h-6 w-8 sm:h-7 sm:w-9 ${active ? "text-avalon-red" : "text-gray-500"}`}
                  />
                  <span className={`text-[10px] font-semibold sm:text-[11px] ${active ? "text-avalon-red" : ""}`}>
                    {name}
                  </span>
                </button>
              );
            })}
          </div>
          </div>
        </div>
      </section>

      {/* Featured collection */}
      <section className="bg-[#FAF9F6] py-12 md:py-16">
        <div className="container-avalon">
          <div className="home-split-layout mb-8 md:mb-10">
            <div className="home-split-intro">
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-avalon-red sm:text-[11px]">
                Featured Collection
              </span>
              <h2 className="mt-2.5 font-serif text-[1.85rem] leading-tight text-avalon-black sm:text-[2.15rem] xl:text-[2.4rem]">
                Furniture for Every{" "}
                <span className="text-avalon-red">Lifestyle</span>
              </h2>
            </div>
            <div className="flex flex-col justify-end lg:items-end lg:text-right">
              <p className="max-w-[300px] text-[12px] leading-relaxed text-gray-600 sm:text-[13px]">
                From living rooms to bedrooms, discover pieces designed for comfort and lasting
                quality.
              </p>
              <Link
                href="/product-catalog"
                className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-avalon-red hover:underline sm:text-[13px]"
              >
                View All Furniture
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
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
          </div>
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
            {featured.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group relative aspect-[3/4.15] overflow-hidden rounded-[1.25rem] shadow-[0_24px_48px_-20px_rgba(15,15,15,0.35)]"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className={
                    item.productShot
                      ? "object-contain object-center p-6 transition duration-700 ease-out group-hover:scale-[1.03] sm:p-8"
                      : "object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                  }
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div
                  className={`absolute inset-0 ${
                    item.productShot
                      ? "bg-gradient-to-t from-black/70 via-[#f6f4f1]/40 to-[#f6f4f1]"
                      : "bg-gradient-to-t from-black/75 via-black/20 to-black/5"
                  }`}
                  aria-hidden="true"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4 sm:p-5">
                  <div className="min-w-0 text-white">
                    <h3 className="font-serif text-lg sm:text-xl">{item.name}</h3>
                    <p className="mt-0.5 text-[11px] text-white/88 sm:text-xs">{item.tagline}</p>
                  </div>
                  <CircleArrow />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* USP bar */}
      <section className="border-y border-avalon-border/50 bg-[#F3F2F0]">
        <div className="container-avalon py-6 md:py-7">
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-6">
            {uspItems.map((item) => (
              <div key={item.title} className="flex items-center gap-3">
                <UspLineIcon type={item.type} />
                <p className="text-[12px] font-semibold leading-tight text-avalon-black sm:text-[13px]">
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spaces that feel like home */}
      <section className="bg-[#FAF9F6] py-14 md:py-20">
        <div className="container-avalon grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)_auto] lg:items-center lg:gap-8">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-avalon-soft shadow-[0_32px_64px_-24px_rgba(0,0,0,0.2)] lg:aspect-[5/4]">
            <Image
              src={lifestyleSlides[lifestyleIndex].image}
              alt={lifestyleSlides[lifestyleIndex].label}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
          <div className="relative px-0 lg:px-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-avalon-red">
              Modern Furniture
            </span>
            <h2 className="mt-2.5 font-serif text-[1.85rem] leading-tight text-avalon-black sm:text-[2.25rem]">
              Spaces that Feel Like{" "}
              <span className="text-avalon-red">Home</span>
            </h2>
            <p className="mt-4 max-w-md text-[13px] leading-relaxed text-gray-600 sm:text-[14px]">
              Create inviting rooms with furniture that balances comfort, function and timeless
              design — made for the way you live.
            </p>
            <Button href="/product-catalog" className="mt-6">
              Explore Collection
            </Button>
            <p
              className="mt-10 font-serif text-4xl leading-none text-avalon-black/10 sm:text-5xl"
              aria-hidden="true"
            >
              {String(lifestyleIndex + 1).padStart(2, "0")}{" "}
              <span className="text-2xl sm:text-3xl">/ {String(lifestyleSlides.length).padStart(2, "0")}</span>
            </p>
          </div>
          <div className="flex flex-row items-center justify-center gap-2 lg:flex-col lg:justify-center">
            <button
              type="button"
              onClick={() =>
                setLifestyleIndex((i) => (i - 1 + lifestyleSlides.length) % lifestyleSlides.length)
              }
              className="flex h-9 w-9 items-center justify-center rounded-full border border-avalon-border text-gray-500 hover:border-avalon-red hover:text-avalon-red"
              aria-label="Previous room"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path
                  d="M3 8l3-4 3 4"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className="mobile-scroll-rail max-lg:mx-0 lg:overflow-visible">
            <div className="mobile-scroll-rail__track flex-row gap-2 lg:flex-col">
              {lifestyleSlides.map((slide, i) => (
                <button
                  key={slide.label}
                  type="button"
                  onClick={() => setLifestyleIndex(i)}
                  className={`relative h-14 w-[72px] shrink-0 overflow-hidden rounded-lg border-2 lg:h-[68px] lg:w-[80px] ${
                    lifestyleIndex === i ? "border-avalon-red" : "border-transparent opacity-65"
                  }`}
                  aria-label={slide.label}
                >
                  <Image src={slide.image} alt="" fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
            </div>
            <button
              type="button"
              onClick={() => setLifestyleIndex((i) => (i + 1) % lifestyleSlides.length)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-avalon-border text-gray-500 hover:border-avalon-red hover:text-avalon-red"
              aria-label="Next room"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path
                  d="M3 4l3 4 3-4"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Designed for modern living */}
      <section className="bg-[#FAF9F6] py-14 md:py-20">
        <div className="container-avalon grid gap-8 lg:grid-cols-[minmax(0,280px)_1fr] lg:items-start lg:gap-10">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-avalon-red">
              Inspired Living
            </span>
            <h2 className="mt-2.5 font-serif text-[1.85rem] leading-tight text-avalon-black sm:text-[2.15rem]">
              Designed for{" "}
              <span className="text-avalon-red">Modern Living</span>
            </h2>
            <p className="mt-3 text-[13px] leading-relaxed text-gray-600">
              Curated collections for every room in your home.
            </p>
            <Link
              href="/product-catalog"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-avalon-black bg-transparent px-6 py-2.5 text-[12px] font-semibold text-avalon-black transition hover:border-avalon-red hover:text-avalon-red sm:text-[13px]"
            >
              Explore by Room
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
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
          <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
            {rooms.map((room) => (
              <Link
                key={room.name}
                href={room.href}
                className="group relative aspect-[4/3.2] overflow-hidden rounded-[1.15rem] shadow-[0_20px_40px_-18px_rgba(0,0,0,0.3)]"
              >
                <Image
                  src={room.image}
                  alt={room.name}
                  fill
                  className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                  sizes="33vw"
                />
                <div className="absolute inset-0 bg-black/30" aria-hidden="true" />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
                  <h3 className="font-serif text-lg text-white sm:text-xl">{room.name}</h3>
                  <CircleArrow light />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Craftsmanship — split luxury layout (comp) */}
      <section className="bg-[#FAF9F6] py-14 md:py-20">
        <div className="container-avalon grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="max-w-lg">
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-avalon-red">
              Quality Craftsmanship
            </span>
            <h2 className="mt-2.5 font-serif text-[2rem] leading-tight text-avalon-black sm:text-[2.35rem]">
              Furniture Built to <span className="text-avalon-red">Last</span>
            </h2>
            <p className="mt-4 text-[13px] leading-relaxed text-gray-600 sm:text-[14px]">
              Every piece reflects our commitment to quality materials and expert craftsmanship.
            </p>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-x-6">
              {craftPoints.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 text-[12px] font-medium text-avalon-black sm:text-[13px]"
                >
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-avalon-red/30 bg-white text-[10px] text-avalon-red"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <a
            href={assets.home.manufacturingVideo}
            className="group relative block aspect-[4/3] overflow-hidden rounded-[1.25rem] shadow-[0_32px_64px_-24px_rgba(0,0,0,0.35)]"
            aria-label="Watch our craftsmanship"
          >
            <Image
              src={furnitureImages.craftsmanship}
              alt="Artisan woodworking and furniture craftsmanship"
              fill
              className="object-cover transition duration-700 group-hover:scale-[1.02]"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-black/25 transition group-hover:bg-black/30" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white">
              <span className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-avalon-red text-white shadow-xl ring-4 ring-white/20">
                <svg width="20" height="22" viewBox="0 0 10 12" fill="currentColor" aria-hidden="true">
                  <path d="M0 0v12l10-6L0 0z" />
                </svg>
              </span>
              <span className="text-[13px] font-semibold tracking-wide">Watch Our Craftsmanship</span>
            </div>
          </a>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#FAF9F6] py-14 md:py-20">
        <div className="container-avalon">
          <div className="mb-8">
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-avalon-red">
              Our Customers
            </span>
            <h2 className="mt-2 font-serif text-[1.85rem] text-avalon-black sm:text-[2.15rem]">
              Loved by Homes Across India
            </h2>
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setTestimonialIndex((i) => (i - 1 + testimonials.length) % testimonials.length)
              }
              className="absolute -left-2 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-avalon-border bg-white text-gray-500 hover:text-avalon-black md:flex lg:-left-5"
              aria-label="Previous testimonials"
            >
              ‹
            </button>
            <div className="grid gap-4 md:grid-cols-3 md:gap-5">
              {visibleTestimonials.map((t, idx) => (
                <article
                  key={`${t.name}-${idx}`}
                  className="rounded-[1.15rem] border border-avalon-border/80 bg-white p-7 shadow-[0_16px_40px_-20px_rgba(0,0,0,0.12)]"
                >
                  <p className="text-[13px] leading-relaxed text-gray-700 sm:text-[14px]">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-4 flex gap-0.5 text-amber-500" aria-hidden="true">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="text-[15px] leading-none">★</span>
                    ))}
                  </div>
                  <div className="mt-5 flex items-center gap-3">
                    <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-white shadow-md">
                      <Image
                        src={t.avatar}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="44px"
                      />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-avalon-black">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.location}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setTestimonialIndex((i) => (i + 1) % testimonials.length)}
              className="absolute -right-2 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-avalon-border bg-white text-gray-500 hover:text-avalon-black md:flex lg:-right-5"
              aria-label="Next testimonials"
            >
              ›
            </button>
          </div>
        </div>
      </section>

      <CTABanner
        title="Better Spaces. A Brighter Tomorrow."
        description="Visit an authorized Avalon dealer to experience our furniture collections in person."
        buttonLabel="Find a Dealer"
        buttonHref="/find-a-dealer"
        backgroundImage={furnitureImages.cta}
      />
    </>
  );
}
