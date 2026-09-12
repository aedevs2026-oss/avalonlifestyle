"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { assets } from "@/lib/assets";
import {
  formatPrice,
  getProductBySlug,
  mattressCollectionOrder,
} from "@/lib/products";
import Reveal from "./Reveal";

import "swiper/css";
const featuredProducts = mattressCollectionOrder
  .map((slug) => getProductBySlug(slug))
  .filter(Boolean);

function FeaturedCard({ product }) {
  return (
    <Link href={`/products/${product.slug}`} className="featured-product-card group">
      <div className="featured-product-card__media">
        <Image
          src={product.image || assets.singleProduct.main}
          alt={`${product.name} mattress`}
          fill
          className="featured-product-card__img"
          sizes="(max-width: 768px) 85vw, 260px"
        />
      </div>
      <div className="featured-product-card__footer">
        <div className="featured-product-card__copy">
          <h3 className="featured-product-card__title">{product.name}</h3>
          <p className="featured-product-card__tagline">{product.tagline}</p>
        </div>
        <div className="featured-product-card__meta">
          <p className="featured-product-card__price">
            From {formatPrice(product.price)}
          </p>
          <span className="featured-product-card__arrow" aria-hidden="true">
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8H13M13 8L9 4M13 8L9 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

function FeaturedPagination({ swiper, slideCount }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!swiper) return undefined;

    const onChange = () => setActive(swiper.realIndex);
    onChange();
    swiper.on("slideChange", onChange);
    return () => {
      swiper.off("slideChange", onChange);
    };
  }, [swiper]);

  if (!swiper || slideCount < 2) return null;

  return (
    <div
      className="home-featured-slider__pagination"
      role="tablist"
      aria-label="Featured mattresses"
    >
      {Array.from({ length: slideCount }, (_, index) => (
        <button
          key={index}
          type="button"
          role="tab"
          aria-selected={active === index}
          aria-label={`Go to slide ${index + 1}`}
          className={
            active === index
              ? "home-featured-slider__bullet home-featured-slider__bullet--active"
              : "home-featured-slider__bullet"
          }
          onClick={() => swiper.slideToLoop(index)}
        />
      ))}
    </div>
  );
}

function NavArrow({ direction, onClick, label, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        home-featured-slider__nav
        flex
        h-9
        w-9
        items-center
        justify-center
        rounded-full
        border
        border-gray-200/90
        bg-white
        text-gray-500
        shadow-[0_4px_14px_rgba(17,19,24,0.08)]
        transition-colors
        hover:border-gray-300
        hover:text-avalon-black
        ${className}
      `}
      aria-label={label}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        {direction === "prev" ? (
          <path
            d="M10 3L5 8L10 13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M6 3L11 8L6 13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  );
}

export default function HomeRange() {
  const [swiper, setSwiper] = useState(null);

  return (
    <section className="bg-[var(--hero-merge)] py-10 sm:py-12 md:py-16">
      <div className="container-avalon">
        <div className="home-split-layout">
          <Reveal as="div" x={-20} duration={650} className="home-split-intro">
            <span
              className="
                inline-block
                text-[10px]
                sm:text-[11px]
                font-bold
                uppercase
                tracking-[0.22em]
                text-avalon-red
              "
            >
              Featured Collection
            </span>
            <h2
              className="
                mt-2.5
                font-serif
                text-[2rem]
                sm:text-[2.2rem]
                xl:text-[2.45rem]
                leading-[1.08]
                tracking-[-0.025em]
                text-avalon-black
              "
            >
              Our Best Mattresses
            </h2>
            <p
              className="
                mt-3
                max-w-[280px]
                text-[12px]
                sm:text-[13px]
                leading-[1.55]
                text-gray-500
              "
            >
              Engineered for every sleep style. Discover our most loved
              mattresses, crafted with premium materials.
            </p>
            <Link
              href="/product-catalog"
              className="
                mt-5
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-avalon-red
                bg-white
                px-6
                py-2.5
                text-[12px]
                font-semibold
                text-avalon-red
                transition-all
                duration-300
                hover:bg-avalon-red
                hover:text-white
                sm:text-[13px]
              "
            >
              View All Mattresses
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
          </Reveal>

          <Reveal delay={100} duration={700} className="home-featured-slider">
            <div className="home-featured-slider__row">
              <NavArrow
                direction="prev"
                label="Previous mattress"
                onClick={() => swiper?.slidePrev()}
                className="hidden md:flex"
              />
              <div className="home-featured-slider__track">
                <Swiper
                  className="home-featured-swiper !overflow-hidden"
                  modules={[Autoplay]}
                  spaceBetween={12}
                  slidesPerView={1.05}
                  loop
                  speed={600}
                  autoplay={{
                    delay: 4500,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }}
                  onSwiper={setSwiper}
                  breakpoints={{
                    480: { slidesPerView: 1.28, spaceBetween: 14 },
                    640: { slidesPerView: 1.75, spaceBetween: 16 },
                    768: { slidesPerView: 2, spaceBetween: 18 },
                    1024: { slidesPerView: 2.25, spaceBetween: 20 },
                    1280: { slidesPerView: 3, spaceBetween: 20 },
                    1536: { slidesPerView: 4, spaceBetween: 20 },
                  }}
                >
                  {featuredProducts.map((product) => (
                    <SwiperSlide key={product.slug}>
                      <FeaturedCard product={product} />
                    </SwiperSlide>
                  ))}
                </Swiper>
                <FeaturedPagination
                  swiper={swiper}
                  slideCount={featuredProducts.length}
                />
              </div>
              <NavArrow
                direction="next"
                label="Next mattress"
                onClick={() => swiper?.slideNext()}
                className="hidden md:flex"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
