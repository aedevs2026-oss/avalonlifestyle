"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { assets } from "@/lib/assets";
import Reveal from "./Reveal";
import { staggerDelay } from "./reveal-utils";

const items = [
  { icon: assets.tryBeforeYouBuy.bed, title: "Premium Mattresses" },
  { icon: assets.listing.shield, title: "10 Years Warranty" },
  { icon: assets.listing.delivery, title: "Free Delivery Across India" },
  { icon: assets.listing.heart, title: "Loved by Thousands" },
];

const tickerMessages = [
  "Good Sleep Builds a Brighter Tomorrow",
  "Experience Premium Comfort, Every Night",
  "Trusted Across Tamil Nadu & Beyond",
];

const TICKER_MS = 5500;

export default function HomeTrustBar() {
  const [tickerIndex, setTickerIndex] = useState(0);

  const stepTicker = useCallback((delta) => {
    setTickerIndex((i) => (i + delta + tickerMessages.length) % tickerMessages.length);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => stepTicker(1), TICKER_MS);
    return () => window.clearInterval(id);
  }, [stepTicker]);

  return (
    <section className="border-y border-avalon-border bg-white">
      <div className="container-avalon py-5 md:py-6">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-10 flex-1">
            {items.map((item, index) => (
              <Reveal
                key={item.title}
                delay={staggerDelay(index, 90)}
                duration={550}
                y={14}
                className="flex items-center gap-3 min-w-0 group"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-avalon-border bg-avalon-soft transition-transform duration-300 group-hover:scale-110 group-hover:border-avalon-red/40">
                  <Image src={item.icon} alt="" width={18} height={18} />
                </div>
                <p className="text-[13px] font-semibold text-avalon-black leading-tight">
                  {item.title}
                </p>
              </Reveal>
            ))}
          </div>
          <div className="hidden xl:flex items-center gap-4 shrink-0 pl-8 border-l border-avalon-border min-w-[320px]">
            <button
              type="button"
              onClick={() => stepTicker(-1)}
              className="text-gray-400 hover:text-avalon-red transition-colors"
              aria-label="Previous message"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M10 3L5 8L10 13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <p
              className="flex-1 text-center text-[11px] font-semibold tracking-[0.1em] text-gray-500 uppercase whitespace-nowrap transition-opacity duration-300"
              key={tickerIndex}
            >
              {tickerMessages[tickerIndex]}
            </p>
            <button
              type="button"
              onClick={() => stepTicker(1)}
              className="text-gray-400 hover:text-avalon-red transition-colors"
              aria-label="Next message"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M6 3L11 8L6 13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
