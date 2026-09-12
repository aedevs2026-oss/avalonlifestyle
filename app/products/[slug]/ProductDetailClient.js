"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Button from "@/components/ui/Button";
import { CTABanner } from "@/components/sections/PageHero";
import { ProductGrid } from "@/components/sections/ProductCard";
import { assets } from "@/lib/assets";
import { getProductBySlug, products, formatPrice } from "@/lib/products";
import { shareProduct } from "@/lib/productShare";
import { toggleWishlistSlug, useWishlistContains } from "@/lib/wishlist";

const featureIcons = [
  { icon: assets.singleProduct.pocketSpring, label: "Pocket Spring Technology" },
  { icon: assets.singleProduct.breathable, label: "Breathable Fabric" },
  { icon: assets.singleProduct.pressure, label: "Pressure Relief" },
  { icon: assets.singleProduct.motion, label: "Motion Isolation" },
  { icon: assets.singleProduct.spinal, label: "Spinal Support" },
  { icon: assets.singleProduct.durability, label: "Long-Lasting Durability" },
];

const tabs = ["Overview", "Features", "Specifications", "Materials", "Care Instructions", "Reviews"];

const layers = [
  "Premium Knitted Fabric",
  "Memory Foam Layer",
  "High Resilience Foam",
  "Individual Pocket Springs",
  "Base Support Foam",
];

export default function ProductDetailClient({ slug }) {
  const product = getProductBySlug(slug);
  const [activeTab, setActiveTab] = useState("Overview");
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0]?.id);
  const [activeImage, setActiveImage] = useState(0);
  const wishlisted = useWishlistContains(slug);
  const [shareNotice, setShareNotice] = useState(null);

  useEffect(() => {
    if (!shareNotice) return undefined;
    const timer = window.setTimeout(() => setShareNotice(null), 3200);
    return () => window.clearTimeout(timer);
  }, [shareNotice]);

  const handleShare = useCallback(async () => {
    if (!product) return;
    const result = await shareProduct(product);
    if (result.aborted) return;
    if (result.ok && result.method === "clipboard") {
      setShareNotice("Link and catalogue URL copied to clipboard.");
    } else if (result.ok) {
      setShareNotice("Thanks for sharing Avalon.");
    } else {
      setShareNotice("Unable to share. Try again or copy the page URL.");
    }
  }, [product]);

  const handleWishlistToggle = useCallback(() => {
    toggleWishlistSlug(slug);
  }, [slug]);

  if (!product) notFound();

  const displaySizes = [
    ...(product?.sizes || []),
    { id: "custom", name: "Custom Size", dimensions: "Made to fit", price: product?.price },
  ];

  const selectedSizeDetails =
    displaySizes.find((item) => item.id === selectedSize) || displaySizes[0];

  const gallery = [
    product.image,
    product.layersImage,
    assets.singleProduct.gallery1,
    assets.singleProduct.lifestyle,
  ].filter(Boolean);

  const related = products.filter((p) => p.slug !== slug).slice(0, 4);

  const reviews = [
    { title: "Best mattress I've ever owned", rating: 5, text: "The Prince mattress transformed my sleep. No more back pain!", author: "Ramesh K.", location: "Chennai", date: "Jan 2024" },
    { title: "Worth every rupee", rating: 5, text: "Premium quality and excellent support. Highly recommend.", author: "Priya S.", location: "Bengaluru", date: "Dec 2023" },
    { title: "Great for couples", rating: 4.5, text: "Motion isolation is excellent. My partner's movements don't disturb me.", author: "Arun M.", location: "Salem", date: "Nov 2023" },
  ];

  return (
    <>
      <section className="section-padding bg-white pt-8">
        <div className="container-avalon">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Mattresses", href: "/mattresses" },
              { label: product.name },
            ]}
          />

          <div className="grid lg:grid-cols-2 gap-10 mt-8">
            {/* Gallery */}
            <div className="flex gap-4">
              <div className="hidden sm:flex flex-col gap-3">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 ${activeImage === i ? "border-avalon-red" : "border-avalon-border"}`}
                    aria-label={`View image ${i + 1}`}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                  </button>
                ))}
              </div>
              <div className="relative flex-1 aspect-square rounded-2xl overflow-hidden bg-avalon-soft">
                <Image
                  src={gallery[activeImage]}
                  alt={`${product.name} mattress`}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {product.badge && (
                  <span className="absolute top-4 left-4 bg-avalon-red text-white text-xs font-bold px-3 py-1 rounded">
                    {product.badge}
                  </span>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-3 flex items-start justify-between gap-4">
                <span className="inline-block rounded border border-avalon-red px-3 py-1 text-xs font-bold text-avalon-red">
                  {product.type.toUpperCase()}
                </span>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex gap-3 text-xs font-medium text-gray-600">
                    <button
                      type="button"
                      onClick={handleShare}
                      className="inline-flex items-center gap-1 transition-colors hover:text-avalon-red"
                      aria-label={`Share ${product.name} and product catalogue`}
                    >
                      <Image src={assets.singleProduct.share} alt="" width={16} height={16} />
                      Share
                    </button>
                    <button
                      type="button"
                      onClick={handleWishlistToggle}
                      className={`inline-flex items-center gap-1 transition-colors ${
                        wishlisted
                          ? "text-avalon-red"
                          : "text-gray-600 hover:text-avalon-red"
                      }`}
                      aria-pressed={wishlisted}
                      aria-label={
                        wishlisted
                          ? `Remove ${product.name} from wishlist`
                          : `Add ${product.name} to wishlist`
                      }
                    >
                      <Image src={assets.listing.heart} alt="" width={16} height={16} />
                      {wishlisted ? "Saved to Wishlist" : "Add to Wishlist"}
                    </button>
                  </div>
                  {shareNotice && (
                    <p
                      className="max-w-[220px] text-right text-[10px] leading-snug text-avalon-red"
                      role="status"
                    >
                      {shareNotice}
                    </p>
                  )}
                </div>
              </div>
              <h1 className="mb-2 font-serif text-4xl text-avalon-black md:text-5xl">{product.name}</h1>
              <p className="text-gray-600 mb-4">{product.tagline}</p>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">{product.description}</p>

              <div className="flex items-center gap-2 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Image key={i} src={assets.singleProduct.star} alt="" width={16} height={16} />
                ))}
                <span className="text-sm text-gray-600">{product.rating} ({product.reviews} reviews)</span>
              </div>

              <p className="text-3xl font-bold text-avalon-red mb-1">{formatPrice(selectedSizeDetails?.price || product.price)}</p>
              <p className="text-xs text-gray-500 mb-6">
                {product.thickness} · {product.warranty}
                {product.usage ? ` · ${product.usage}` : ""}
              </p>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-sm">Select Size</p>
                  <button type="button" className="flex items-center gap-1 text-xs text-avalon-red font-medium">
                    <Image src={assets.singleProduct.sizeGuide} alt="" width={14} height={14} />
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {displaySizes.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedSize(item.id)}
                      className={`rounded-xl border p-3 text-left text-sm transition-all ${
                        selectedSize === item.id
                          ? "border-avalon-red bg-red-50"
                          : "border-avalon-border hover:border-gray-300"
                      }`}
                    >
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.dimensions}</p>
                    </button>
                  ))}
                </div>
              </div>

              <Button href="/find-a-dealer" className="w-full sm:w-auto mb-6">
                Find a Dealer Near You
              </Button>

              <div className="flex flex-wrap gap-4 pt-4 border-t border-avalon-border">
                {[
                  { icon: assets.listing.tick, label: "100% Genuine Product" },
                  { icon: assets.listing.shield, label: "10 Years Warranty" },
                  { icon: assets.listing.support, label: "Expert Support" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-xs text-gray-600">
                    <Image src={item.icon} alt="" width={16} height={16} />
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Icons */}
      <section className="border-y border-avalon-border bg-avalon-soft py-8">
        <div className="container-avalon grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {featureIcons.map((f) => (
            <div key={f.label} className="text-center">
              <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-red-50 mb-2">
                <Image src={f.icon} alt="" width={24} height={24} />
              </div>
              <p className="text-xs font-medium">{f.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Lifestyle Banner */}
      <section className="relative flex h-64 items-center md:h-80">
        <Image src={assets.singleProduct.lifestyle} alt="Person sleeping peacefully" fill className="object-cover object-[center_30%]" sizes="100vw" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="container-avalon relative z-10 text-white">
          <h2 className="font-serif text-2xl md:text-3xl">A Better Sleep For a Brighter Tomorrow.</h2>
          <p className="text-white/80 mt-2">Feel the difference with {product.name}.</p>
        </div>
      </section>

      {/* Tabs */}
      <section className="section-padding bg-white">
        <div className="container-avalon">
          <div className="mobile-scroll-rail -mb-px border-b border-avalon-border mb-8 lg:overflow-visible lg:m-0 lg:p-0">
            <div className="mobile-scroll-rail__track gap-1 lg:w-full lg:flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-avalon-red text-avalon-red"
                    : "border-transparent text-gray-500 hover:text-avalon-black"
                }`}
              >
                {tab}{tab === "Reviews" ? ` (${product.reviews})` : ""}
              </button>
            ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            <div>
              <h3 className="font-serif text-2xl mb-4">Engineered for Everyday Excellence</h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">{product.description}</p>
              <ul className="space-y-3">
                {(product.highlights || []).map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <Image src={assets.listing.tick} alt="" width={16} height={16} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-avalon-soft rounded-2xl p-8">
              {product.layersImage ? (
                <div className="relative mb-6 aspect-[4/3] overflow-hidden rounded-xl bg-white">
                  <Image
                    src={product.layersImage}
                    alt={`${product.name} mattress layers`}
                    fill
                    className="object-contain p-3"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                </div>
              ) : null}
              <h4 className="font-semibold mb-6 text-center">Mattress Layers</h4>
              <div className="space-y-3">
                {(product.layers || layers).map((layer, i) => (
                  <div
                    key={`${layer}-${i}`}
                    className="rounded-lg p-4 text-sm font-medium text-center"
                    style={{
                      background: `rgba(237, 28, 36, ${0.05 + i * 0.04})`,
                      borderLeft: `4px solid rgba(237, 28, 36, ${0.3 + i * 0.15})`,
                    }}
                  >
                    {i + 1}. {layer}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marketing */}
      <section className="grid lg:grid-cols-2">
        <div className="relative min-h-[350px]">
          <Image src={assets.singleProduct.main} alt={`${product.name} in bedroom setting`} fill className="object-cover" sizes="50vw" />
        </div>
        <div className="bg-avalon-warm p-8 lg:p-12 flex flex-col justify-center">
          <span className="label-red">DESIGNED FOR REAL LIFE</span>
          <h2 className="font-serif text-3xl mt-3 mb-4">More Than a Mattress. A Healthier You.</h2>
          <p className="text-gray-600 mb-6 text-sm">Every night on {product.name} is an investment in your health, productivity, and wellbeing.</p>
          <Button href="/find-a-dealer">Find a Dealer</Button>
        </div>
      </section>

      {/* Reviews */}
      <section className="section-padding bg-white">
        <div className="container-avalon">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-2xl">What Our Customers Say</h2>
            <a href="#" className="text-sm font-semibold text-avalon-red">View All Reviews →</a>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <article key={review.title} className="bg-avalon-soft rounded-2xl p-6 border border-avalon-border">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: Math.floor(review.rating) }).map((_, i) => (
                    <Image key={i} src={assets.singleProduct.star} alt="" width={14} height={14} />
                  ))}
                </div>
                <p className="font-semibold text-sm mb-2">{review.title}</p>
                <p className="text-sm text-gray-600 mb-4">{review.text}</p>
                <p className="text-xs font-medium">{review.author}</p>
                <p className="text-xs text-gray-500">{review.location} · {review.date}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="section-padding bg-avalon-soft">
        <div className="container-avalon">
          <h2 className="font-serif text-2xl mb-8">You May Also Like</h2>
          <ProductGrid products={related} columns={4} />
        </div>
      </section>

      <CTABanner
        title="Need Help Choosing?"
        description="Talk to our sleep experts for personalized recommendations."
        buttonLabel="Talk to an Expert"
        buttonHref="/contact"
        backgroundImage={assets.tryBeforeYouBuy.bedroom}
      />
    </>
  );
}
