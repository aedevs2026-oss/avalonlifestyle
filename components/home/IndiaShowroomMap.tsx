"use client";

import { useEffect, useMemo, useState } from "react";
import India from "@svg-maps/india";
import { dealers } from "@/lib/products";

/** Project WGS84 → @svg-maps/india viewBox (612×696) */
const BOUNDS = { minLat: 8, maxLat: 35.5, minLng: 68, maxLng: 97 };
const SVG_W = 612;
const SVG_H = 696;

type DealerPin = {
  id: number;
  name: string;
  city: string;
  lat: number;
  lng: number;
  svgX: number;
  svgY: number;
};

function latLngToSvg(lat: number, lng: number) {
  const x =
    ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * SVG_W;
  const y =
    ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * SVG_H;
  return {
    svgX: Math.min(SVG_W - 6, Math.max(6, x)),
    svgY: Math.min(SVG_H - 6, Math.max(6, y)),
  };
}

export default function IndiaShowroomMap() {
  const dealerPins = useMemo<DealerPin[]>(
    () =>
      dealers
        .filter(
          (d): d is (typeof dealers)[number] & { lat: number; lng: number } =>
            typeof d.lat === "number" && typeof d.lng === "number",
        )
        .map((d) => ({
          id: d.id,
          name: d.name,
          city: d.city,
          lat: d.lat,
          lng: d.lng,
          ...latLngToSvg(d.lat, d.lng),
        })),
    [],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const activeDealer = dealerPins[activeIndex] ?? dealerPins[0];

  useEffect(() => {
    if (dealerPins.length < 2) return;
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % dealerPins.length);
    }, 3500);
    return () => window.clearInterval(interval);
  }, [dealerPins.length]);

  const previous = () => {
    if (dealerPins.length === 0) return;
    setActiveIndex((current) =>
      current === 0 ? dealerPins.length - 1 : current - 1,
    );
  };

  const next = () => {
    if (dealerPins.length === 0) return;
    setActiveIndex((current) =>
      current === dealerPins.length - 1 ? 0 : current + 1,
    );
  };

  if (!activeDealer) {
    return null;
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-white">
      {/* India map — right-weighted like the design comp */}
      <div
        className="
          absolute
          inset-y-0
          right-0
          w-[88%]
          sm:w-[90%]
        "
      >
        <svg
          viewBox={India.viewBox}
          className="h-full w-full"
          role="img"
          aria-label="Avalon dealer locations across India"
        >
          <g>
            {India.locations.map((location) => (
              <path
                key={location.id}
                d={location.path}
                className="fill-[#ececec] stroke-white transition-colors duration-300 hover:fill-[#e2e2e2]"
                strokeWidth="0.65"
              />
            ))}
          </g>

          <g>
            {dealerPins.map((dealer, index) => {
              const active = index === activeIndex;
              return (
                <g
                  key={dealer.id}
                  transform={`translate(${dealer.svgX} ${dealer.svgY})`}
                  className="cursor-pointer"
                  onClick={() => setActiveIndex(index)}
                  role="presentation"
                >
                  {active && (
                    <circle
                      r={11}
                      fill="rgba(237, 28, 36, 0.22)"
                      className="animate-ping"
                      style={{ transformOrigin: "center" }}
                    />
                  )}
                  <circle
                    r={active ? 5.5 : 4.5}
                    fill="#ed1c24"
                    stroke="#ffffff"
                    strokeWidth={active ? 2 : 1.5}
                  />
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Dealer tooltip — bottom right */}
      <div
        className="
          absolute
          bottom-[42px]
          right-[2%]
          z-30
          w-[158px]
          rounded-[10px]
          bg-[#171717]
          px-3
          py-2.5
          text-white
          shadow-[0_8px_22px_rgba(0,0,0,0.16)]
          sm:w-[168px]
        "
      >
        <div className="flex items-center gap-2.5">
          <div
            className="
              flex
              h-[28px]
              w-[28px]
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-white
            "
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z"
                stroke="#171717"
                strokeWidth="2"
              />
              <circle cx="12" cy="9" r="2.2" stroke="#171717" strokeWidth="2" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="truncate text-[9px] font-semibold leading-tight sm:text-[10px]">
              {activeDealer.name}
            </p>
            <p className="mt-[2px] truncate text-[8px] leading-tight text-white/65 sm:text-[9px]">
              {activeDealer.city} showroom
            </p>
          </div>
        </div>
      </div>

      {/* Carousel controls — bottom right */}
      <div
        className="
          absolute
          bottom-[2px]
          right-[2%]
          z-40
          flex
          items-center
          gap-2
        "
      >
        <button
          type="button"
          onClick={previous}
          aria-label="Previous dealer"
          className="
            flex
            h-[32px]
            w-[32px]
            items-center
            justify-center
            rounded-full
            border
            border-[#d9d9d9]
            bg-white
            text-[#444]
            transition-all
            duration-200
            hover:border-avalon-red
            hover:text-avalon-red
          "
        >
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path
              d="M13 8H3M3 8L7 4M3 8L7 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button
          type="button"
          onClick={next}
          aria-label="Next dealer"
          className="
            flex
            h-[32px]
            w-[32px]
            items-center
            justify-center
            rounded-full
            border
            border-avalon-red/45
            bg-white
            text-avalon-red
            transition-all
            duration-200
            hover:bg-avalon-red
            hover:text-white
          "
        >
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 8H13M13 8L9 4M13 8L9 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
