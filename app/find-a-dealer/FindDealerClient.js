"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import PageHero from "@/components/sections/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import DealerMap from "@/components/sections/DealerMap";
import { FAQSection } from "@/components/sections/FAQSection";
import { assets } from "@/lib/assets";
import { dealers, findDealerFeaturedCities } from "@/lib/products";
import {
  formatDistance,
  haversineKm,
  readStoredUserLocation,
  storeUserLocation,
} from "@/lib/geo";

const valueProps = [
  {
    icon: assets.findDealer.gridLocation,
    title: "Wide Dealer Network",
    description: "Across Tamil Nadu and beyond",
  },
  {
    icon: assets.findDealer.shop,
    title: "Experience in Person",
    description: "Test and feel the comfort",
  },
  {
    icon: assets.findDealer.message,
    title: "Expert Guidance",
    description: "Get personalized recommendations",
  },
  {
    icon: assets.findDealer.shield,
    title: "Authentic Products",
    description: "100% genuine Avalon products",
  },
];

function readInitialSelectedDealerId() {
  if (typeof window === "undefined") return dealers[0]?.id ?? null;
  const dealerParam = new URLSearchParams(window.location.search).get("dealer");
  if (!dealerParam) return dealers[0]?.id ?? null;
  const id = Number.parseInt(dealerParam, 10);
  return dealers.some((d) => d.id === id) ? id : (dealers[0]?.id ?? null);
}

export default function FindDealerClient() {
  const [dealerList, setDealerList] = useState(dealers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState(() => readInitialSelectedDealerId());
  const [userLocation, setUserLocation] = useState(() => readStoredUserLocation());

  useEffect(() => {
    fetch("/api/dealers")
      .then((res) => res.json())
      .then((data) => {
        if (data.dealers?.length) {
          setDealerList(data.dealers);
          setSelectedId((current) => {
            if (data.dealers.some((d) => d.id === current)) return current;
            return data.dealers[0]?.id ?? null;
          });
        }
      })
      .catch(() => {
        /* keep static fallback */
      });
  }, []);
  const [radiusKm, setRadiusKm] = useState(25);
  const [sortBy, setSortBy] = useState(() =>
    readStoredUserLocation() ? "distance" : "distance",
  );
  const [locating, setLocating] = useState(false);

  const enriched = useMemo(() => {
    return dealerList.map((dealer) => {
      let distanceKm = null;
      if (userLocation && dealer.lat != null && dealer.lng != null) {
        distanceKm = haversineKm(
          userLocation.lat,
          userLocation.lng,
          dealer.lat,
          dealer.lng,
        );
      }
      return { ...dealer, distanceKm };
    });
  }, [dealerList, userLocation]);

  const filteredDealers = useMemo(() => {
    let list = enriched;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.address.toLowerCase().includes(q) ||
          d.city.toLowerCase().includes(q) ||
          d.pincode.includes(searchQuery.trim()),
      );
    }

    if (userLocation) {
      list = list.filter(
        (d) => d.distanceKm == null || d.distanceKm <= radiusKm,
      );
    }

    if (sortBy === "distance" && userLocation) {
      list = [...list].sort(
        (a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity),
      );
    } else if (sortBy === "name") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [enriched, searchQuery, userLocation, radiusKm, sortBy]);

  const handleUseLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert("Location is not available in this browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        storeUserLocation(lat, lng);
        setUserLocation({ lat, lng });
        setSortBy("distance");
        setLocating(false);
      },
      () => {
        setLocating(false);
        alert("Unable to get your location. Try searching by city or pincode.");
      },
      { enableHighAccuracy: true, timeout: 12000 },
    );
  }, []);

  const selectDealer = useCallback((id) => {
    setSelectedId(id);
    document.getElementById(`dealer-card-${id}`)?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, []);

  return (
    <>
      <PageHero
        label="FIND A DEALER"
        title="Experience Avalon"
        highlight="Near You."
        description="Visit an authorized Avalon dealer to experience our premium mattresses and furniture in person. Test comfort, compare models, and get expert guidance."
        footnote="REAL COMFORT. CLOSER TO YOU."
        image={assets.findDealer.hero}
        imageAlt="Avalon premium mattress showroom"
        bakedDiagonal
        priority
      />

      <section className="border-y border-avalon-border bg-white">
        <div className="container-avalon grid grid-cols-2 gap-6 py-8 lg:grid-cols-4">
          {valueProps.map((item, i) => (
            <div
              key={item.title}
              className={`flex flex-col items-center px-4 text-center ${
                i > 0 ? "lg:border-l lg:border-avalon-border" : ""
              }`}
            >
              <div className="mb-3 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#fff0f0]">
                <Image
                  src={item.icon}
                  alt=""
                  width={20}
                  height={20}
                  className="icon-avalon-red"
                />
              </div>
              <p className="text-sm font-semibold text-avalon-black">
                {item.title}
              </p>
              <p className="text-xs text-gray-500">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-padding bg-avalon-soft">
        <div className="container-avalon">
          <SectionHeading
            label="LOCATE A DEALER"
            title="Find the Nearest Avalon Dealer"
            description="Search by city, area or pincode to see authorized showrooms near you."
            className="mb-8"
          />

          <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Image
                src={assets.findDealer.search}
                alt=""
                width={18}
                height={18}
                className="absolute top-1/2 left-4 -translate-y-1/2 opacity-60"
              />
              <input
                type="search"
                placeholder="City, area or pincode"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-avalon-border bg-white py-3 pr-4 pl-11 text-sm focus:border-avalon-red focus:outline-none"
                aria-label="Search dealers"
              />
            </div>
            <Button type="button" showArrow={false} className="shrink-0">
              Search
            </Button>
            <button
              type="button"
              onClick={handleUseLocation}
              disabled={locating}
              className="flex items-center justify-center gap-1.5 whitespace-nowrap text-sm font-semibold text-avalon-red disabled:opacity-60"
            >
              <Image
                src={assets.findDealer.gridLocation}
                alt=""
                width={16}
                height={16}
                className="icon-avalon-red"
              />
              {locating ? "Locating…" : "Use My Location"}
            </button>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              Radius
              <select
                className="rounded-full border border-avalon-border bg-white px-3 py-2 text-sm"
                aria-label="Search radius"
                value={radiusKm}
                onChange={(e) => setRadiusKm(Number(e.target.value))}
              >
                <option value={25}>25 km</option>
                <option value={50}>50 km</option>
                <option value={100}>100 km</option>
              </select>
            </label>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="flex min-h-0 flex-col">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="font-semibold text-avalon-black">
                  Dealers Near You ({filteredDealers.length})
                </h3>
                <select
                  className="rounded-lg border border-avalon-border bg-white px-3 py-1.5 text-sm"
                  aria-label="Sort dealers"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="distance">Sort by: Distance</option>
                  <option value="name">Sort by: Name</option>
                </select>
              </div>
              <div className="max-h-[520px] space-y-4 overflow-y-auto pr-1">
                {filteredDealers.length === 0 ? (
                  <p className="rounded-xl border border-avalon-border bg-white p-6 text-center text-sm text-gray-600">
                    No dealers match your search. Try a different city or widen
                    the radius.
                  </p>
                ) : (
                  filteredDealers.map((dealer) => {
                    const active = dealer.id === selectedId;
                    return (
                      <article
                        key={dealer.id}
                        id={`dealer-card-${dealer.id}`}
                        role="button"
                        tabIndex={0}
                        onClick={() => selectDealer(dealer.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            selectDealer(dealer.id);
                          }
                        }}
                        className={`cursor-pointer rounded-xl border bg-white p-5 transition-shadow card-hover ${
                          active
                            ? "border-avalon-red shadow-[0_4px_18px_rgba(237,28,36,0.12)]"
                            : "border-avalon-border"
                        }`}
                      >
                        <div className="mb-3 flex items-start gap-3">
                          <Image
                            src={assets.findDealer.location}
                            alt=""
                            width={20}
                            height={20}
                            className="mt-0.5 shrink-0 icon-avalon-red"
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-avalon-black">
                              {dealer.name}
                            </h4>
                            <span className="mt-1 inline-block rounded bg-blue-50 px-2 py-0.5 text-[0.65rem] font-semibold text-blue-600">
                              Authorized Dealer
                            </span>
                          </div>
                          {dealer.distanceKm != null && (
                            <span className="shrink-0 text-xs font-medium text-gray-500">
                              {formatDistance(dealer.distanceKm)}
                            </span>
                          )}
                        </div>
                        <p className="mb-2 text-sm text-gray-600">
                          {dealer.address}
                        </p>
                        <p className="mb-1 text-xs text-gray-500">
                          {dealer.hoursWeek}
                        </p>
                        <p className="mb-4 text-xs text-gray-500">
                          {dealer.hoursSun}
                        </p>
                        <div
                          className="flex flex-wrap gap-4 text-xs font-semibold text-avalon-red"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {dealer.phone && (
                            <a
                              href={`tel:${dealer.phone.replace(/\s/g, "")}`}
                              className="flex items-center gap-1"
                            >
                              <Image
                                src={assets.findDealer.phone}
                                alt=""
                                width={14}
                                height={14}
                                className="icon-avalon-red"
                              />
                              Call
                            </a>
                          )}
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dealer.address)}`}
                            className="flex items-center gap-1"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Image
                              src={assets.findDealer.arrow}
                              alt=""
                              width={14}
                              height={14}
                              className="icon-avalon-red"
                            />
                            Directions
                          </a>
                          <a
                            href="/product-catalog"
                            className="flex items-center gap-1"
                          >
                            View Products
                          </a>
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
            </div>

            <div
              className="relative aspect-square overflow-hidden rounded-2xl border border-avalon-border bg-white shadow-sm lg:aspect-auto lg:min-h-[500px]"
            >
              <DealerMap
                dealers={filteredDealers}
                selectedId={selectedId}
                onSelectDealer={selectDealer}
                className="!absolute inset-0 !min-h-full"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-16">
        <Image
          src={assets.findDealer.bottom}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-white/85" />
        <div className="container-avalon relative z-10 mx-auto max-w-lg text-center">
          <h2 className="mb-3 font-serif text-2xl md:text-3xl">
            Can&apos;t find a dealer near you?
          </h2>
          <p className="mb-6 text-sm text-gray-600">
            We&apos;re expanding our network. Get notified when a dealer opens in
            your area.
          </p>
          <Button variant="outline" showArrow={false}>
            <Image src={assets.findDealer.bell} alt="" width={18} height={18} />
            Notify Me
          </Button>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-avalon">
          <SectionHeading
            label="EXPLORE BY CITY"
            title="Popular Cities"
            className="mb-8"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {findDealerFeaturedCities.map((city) => (
              <button
                key={city.name}
                type="button"
                className="card-hover flex w-full items-center gap-4 rounded-xl border border-avalon-border bg-avalon-soft p-5 text-left"
                onClick={() => setSearchQuery(city.name)}
              >
                <Image
                  src={assets.findDealer.buildings}
                  alt=""
                  width={28}
                  height={28}
                  className="icon-avalon-red opacity-80"
                />
                <div className="flex-1">
                  <p className="font-semibold text-avalon-black">{city.name}</p>
                  <p className="text-xs text-gray-500">
                    {city.dealers} {city.dealers === 1 ? "Dealer" : "Dealers"}
                  </p>
                </div>
                <Image
                  src={assets.findDealer.arrow}
                  alt=""
                  width={16}
                  height={16}
                  className="icon-avalon-red"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      <FAQSection
        label="FREQUENTLY ASKED QUESTIONS"
        title="Your Questions, Answered."
        description="Find answers to common questions about our dealer network."
        items={[
          {
            question: "How do I find an authorized Avalon dealer?",
            answer:
              "Search by city, area or pincode on this page, or use your location to see dealers nearby.",
          },
          {
            question: "Can I test the mattress at the dealer store?",
            answer:
              "Yes. Authorized dealers encourage you to sit, lie down and compare models before you buy.",
          },
          {
            question: "Do all dealers have the same product range?",
            answer:
              "Core mattress collections are available across the network. Some furniture pieces may vary by showroom.",
          },
          {
            question: "Are there any exclusive outlets?",
            answer:
              "Some cities have flagship experience centres with the full Avalon range. Use the map to identify them.",
          },
          {
            question: "How can I become an Avalon dealer?",
            answer:
              "Visit the Become a Dealer page and submit an enquiry. Our partnership team will guide you through the process.",
          },
        ]}
        buttonHref="/resources"
        buttonLabel="View All FAQs"
      />
    </>
  );
}
