"use client";

import { useState } from "react";
import Image from "next/image";
import PageHero, { TrustBar } from "@/components/sections/PageHero";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Button from "@/components/ui/Button";
import { ProductGrid } from "@/components/sections/ProductCard";
import { assets } from "@/lib/assets";
import { products } from "@/lib/products";

const trustItems = [
  { icon: assets.listing.delivery, title: "Free Delivery", description: "On all orders" },
  { icon: assets.listing.shield, title: "10 Years Warranty", description: "Peace of mind" },
  { icon: assets.listing.support, title: "Expert Support", description: "Always here to help" },
  { icon: assets.listing.leaf, title: "Sustainable Materials", description: "A healthier planet" },
];

const productTypes = [
  "All Mattresses",
  "Pocket Spring",
  "Memory Foam",
  "Latex",
  "Gel Memory Foam",
  "Bonnell Spring",
  "Ortho Support",
];
const sizes = ["Single", "Queen", "King", "Custom"];
const firmness = ["Soft", "Medium", "Firm", "Extra Firm"];

export default function ProductCatalogClient() {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedType, setSelectedType] = useState("All Mattresses");

  const filtered = products.filter((p) => {
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.type.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType === "All Mattresses" || p.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <>
      <PageHero
        label="PRODUCT CATALOGUE"
        title="Discover Comfort for a"
        highlight="Brighter Tomorrow."
        description="Browse our complete range of premium mattresses designed for every sleep style and preference."
        image={assets.listing.hero}
        imageAlt="Avalon mattress in a premium bedroom setting"
        bakedDiagonal={false}
        priority
      >
        <div className="flex flex-wrap gap-4 mt-2">
          {[
            { icon: assets.listing.leaf, label: "Premium Materials" },
            { icon: assets.singleProduct.durability, label: "Long-Lasting Durability" },
            { icon: assets.listing.heart, label: "Loved by Thousands" },
            { icon: assets.listing.delivery, label: "Comfort Delivered" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-sm text-gray-600">
              <Image src={item.icon} alt="" width={18} height={18} />
              {item.label}
            </div>
          ))}
        </div>
      </PageHero>

      <section className="section-padding bg-avalon-soft">
        <div className="container-avalon">
          <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center">
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Product Catalogue" }]} />
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Image src={assets.findDealer.search} alt="" width={18} height={18} className="absolute top-1/2 left-4 -translate-y-1/2" />
                <input
                  type="search"
                  placeholder="Search for mattresses (e.g. pocket spring, memory foam...)"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-full border border-avalon-border bg-white py-3 pr-28 pl-11 text-sm focus:border-avalon-red focus:outline-none"
                  aria-label="Search products"
                />
                <Button size="sm" className="absolute top-1/2 right-1.5 -translate-y-1/2" showArrow={false}>
                  Search
                </Button>
              </div>
              <select className="rounded-full border border-avalon-border bg-white px-4 py-3 text-sm" aria-label="Sort products">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Name: A-Z</option>
              </select>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`rounded-lg border p-2 ${viewMode === "grid" ? "border-avalon-red bg-red-50" : "border-avalon-border"}`}
                  aria-label="Grid view"
                >
                  <Image src={assets.listing.grid} alt="" width={20} height={20} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`rounded-lg border p-2 ${viewMode === "list" ? "border-avalon-red bg-red-50" : "border-avalon-border"}`}
                  aria-label="List view"
                >
                  <Image src={assets.listing.list} alt="" width={20} height={20} />
                </button>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-8 lg:flex-row">
            <aside className="lg:w-64 shrink-0">
              <div className="bg-white rounded-2xl border border-avalon-border p-6 sticky top-24">
                <h3 className="font-semibold mb-4">Filters</h3>

                <div className="mb-6">
                  <p className="text-sm font-medium mb-2">Product Type</p>
                  <div className="space-y-2">
                    {productTypes.map((type) => (
                      <label key={type} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="radio"
                          name="type"
                          checked={selectedType === type}
                          onChange={() => setSelectedType(type)}
                          className="accent-avalon-red"
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-sm font-medium mb-2">Size</p>
                  <div className="space-y-2">
                    {sizes.map((size) => (
                      <label key={size} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="checkbox" className="accent-avalon-red" />
                        {size}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-sm font-medium mb-2">Firmness Level</p>
                  <div className="space-y-2">
                    {firmness.map((f) => (
                      <label key={f} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="checkbox" className="accent-avalon-red" />
                        {f}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-sm font-medium mb-2">Price Range</p>
                  <input type="range" min="5000" max="40000" className="w-full accent-avalon-red" aria-label="Price range" />
                  <p className="text-xs text-gray-500 mt-1">₹ 5,000 – ₹ 40,000</p>
                </div>

                <Button size="sm" className="w-full" showArrow={false}>Apply Filters</Button>

                <div className="mt-6 pt-6 border-t border-avalon-border">
                  <div className="flex items-center gap-3 mb-3">
                    <Image src={assets.listing.support} alt="" width={20} height={20} />
                    <p className="font-semibold text-sm">Need Help?</p>
                  </div>
                  <Button href="/contact" variant="outline" size="sm" className="w-full">Get Expert Advice</Button>
                </div>
              </div>
            </aside>

            <div className="flex-1">
              <p className="mb-6 text-sm text-gray-500">
                Showing {filtered.length} of {products.length} products
              </p>

              <ProductGrid products={filtered} columns={viewMode === "grid" ? 3 : 2} hideTypeBadge />

              <article className="mt-6 overflow-hidden rounded-2xl border border-avalon-border bg-white p-6">
                <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
                  <div className="relative h-32 w-full max-w-[180px] shrink-0 overflow-hidden rounded-xl bg-avalon-soft">
                    <Image src={assets.products.belle} alt="Custom comfort mattress" fill className="object-contain p-3" sizes="180px" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-2xl">Custom Comfort</h3>
                    <p className="mt-1 text-sm text-gray-600">Tailor-made for your space and comfort needs.</p>
                  </div>
                  <div className="flex gap-3">
                    <Button href="/contact" size="sm">Get a Quote</Button>
                    <Button href="/contact" variant="outline" size="sm">Enquire Now</Button>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="grid lg:grid-cols-2">
        <div className="relative min-h-[280px]">
          <Image src={assets.tryBeforeYouBuy.bedroom} alt="Bedroom with Avalon bed" fill className="object-cover" sizes="50vw" />
        </div>
        <div className="flex flex-col justify-center bg-white p-8 lg:p-14">
          <p className="label-red mb-2">Can&apos;t Find the Right Fit?</p>
          <h2 className="font-serif text-3xl text-avalon-black">We&apos;ll Help You Find It.</h2>
          <p className="mt-3 mb-6 max-w-md text-sm text-gray-600">Our sleep experts are here to guide you to the perfect mattress for your needs.</p>
          <Button href="/contact" className="self-start">Talk to an Expert</Button>
        </div>
      </section>

      <TrustBar items={trustItems} />

      <section className="relative overflow-hidden py-16 text-white">
        <Image src={assets.tryBeforeYouBuy.bedroom} alt="" fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-avalon-navy/75" />
        <div className="container-avalon relative z-10 flex flex-col items-center justify-between gap-6 md:flex-row">
          <div>
            <h2 className="font-serif text-2xl">Join Our Sleep Community</h2>
            <p className="text-sm text-white/70">Get the latest updates, sleep tips, and exclusive offers.</p>
          </div>
          <form
            className="flex gap-3 w-full md:w-auto"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thank you for subscribing!");
            }}
          >
            <input
              type="email"
              placeholder="Your email address"
              required
              className="flex-1 md:w-64 rounded-full px-5 py-3 text-sm text-avalon-black focus:outline-none"
              aria-label="Email for newsletter"
            />
            <Button type="submit" showArrow={false}>Subscribe</Button>
          </form>
        </div>
      </section>
    </>
  );
}
