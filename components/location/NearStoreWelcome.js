"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import { dealers } from "@/lib/products";
import { assets } from "@/lib/assets";
import {
  NEAR_STORE_SESSION_KEY,
  estimateTravelTimeRange,
  findNearestDealer,
  formatDistance,
  readStoredUserLocation,
  storeUserLocation,
} from "@/lib/geo";

const PROMPT_DELAY_MS = 1200;

const promptFeatures = [
  {
    icon: assets.findDealer.location,
    label: "Find nearest store",
  },
  {
    icon: assets.findDealer.gridLocation,
    label: "Get accurate directions",
  },
  {
    icon: assets.findDealer.shop,
    label: "Discover in-store experience",
  },
];

function sessionGet(key) {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function sessionSet(key, value) {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

function readClientNearStoreState() {
  const dismissed = sessionGet(NEAR_STORE_SESSION_KEY);
  if (dismissed === "declined" || dismissed === "closed") {
    return { phase: "hidden", nearest: null };
  }

  const stored = readStoredUserLocation();
  if (stored) {
    const result = findNearestDealer(dealers, stored.lat, stored.lng);
    if (result && dismissed !== "success-seen") {
      return { phase: "success", nearest: result };
    }
    return { phase: "hidden", nearest: null };
  }

  return { phase: "idle", nearest: null };
}

function CloseButton({ onClick, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-9 w-9 items-center justify-center rounded-full text-avalon-black/70 transition-colors hover:bg-black/5 hover:text-avalon-black ${className}`}
      aria-label="Close"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M4 4L12 12M12 4L4 12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}

function NearStoreWelcomePanel() {
  const initial = readClientNearStoreState();
  const [phase, setPhase] = useState(initial.phase);
  const [nearest, setNearest] = useState(initial.nearest);

  useEffect(() => {
    if (phase !== "idle") return undefined;
    const timer = window.setTimeout(() => setPhase("prompt"), PROMPT_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase === "prompt" || phase === "success" || phase === "locating") {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
    return undefined;
  }, [phase]);

  const hide = useCallback((sessionValue) => {
    if (sessionValue) sessionSet(NEAR_STORE_SESSION_KEY, sessionValue);
    setPhase("hidden");
  }, []);

  const applyLocation = useCallback(
    (lat, lng) => {
      storeUserLocation(lat, lng);
      const result = findNearestDealer(dealers, lat, lng);
      if (!result) {
        hide("declined");
        return;
      }
      setNearest(result);
      setPhase("success");
    },
    [hide],
  );

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      hide("declined");
      return;
    }
    setPhase("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        applyLocation(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        hide("declined");
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 300000 },
    );
  }, [applyLocation, hide]);

  if (phase === "idle" || phase === "hidden") return null;

  const overlay = (
    <div
      className="fixed inset-0 z-[45] flex items-end justify-center bg-black/45 p-0 sm:items-center sm:p-4"
      aria-live="polite"
    >
      {phase === "prompt" && (
        <div
          className="pointer-events-auto relative flex max-h-[min(96vh,820px)] w-full max-w-[540px] flex-col overflow-hidden rounded-t-3xl bg-[var(--hero-merge)] shadow-2xl sm:rounded-3xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="near-store-title"
        >
          <div className="relative min-h-[11.5rem] shrink-0 sm:min-h-[13rem]">
            <Image
              src={assets.home.hero}
              alt=""
              fill
              className="object-cover object-[70%_center]"
              sizes="540px"
              priority
            />
            <div
              className="absolute inset-0 bg-gradient-to-r from-[var(--hero-merge)] via-[var(--hero-merge)]/92 to-transparent"
              aria-hidden="true"
            />
            <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4 sm:p-5">
              <Logo priority className="!min-h-0 !min-w-0 scale-90 origin-left sm:scale-100" />
              <CloseButton onClick={() => hide("declined")} className="bg-white/80 shadow-sm" />
            </div>
            <p
              className="vertical-text pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 text-[9px] tracking-[0.22em] text-gray-500 sm:block"
              aria-hidden="true"
            >
              A BETTER TOMORROW BEGINS WITH BETTER SLEEP.
            </p>
          </div>

          <div className="flex flex-1 flex-col px-5 pb-5 pt-4 sm:px-7 sm:pb-7 sm:pt-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400">
              Near you
            </p>
            <h2
              id="near-store-title"
              className="mt-2 font-serif text-[1.65rem] leading-[1.15] text-avalon-black sm:text-[1.85rem]"
            >
              Comfort is closer than you think
            </h2>
            <p className="mt-2.5 text-sm leading-relaxed text-gray-600">
              Share your location once and we&apos;ll show how far you are from your
              nearest Avalon store.
            </p>

            <ul className="mt-6 grid grid-cols-3 gap-2 border-y border-avalon-border/80 py-5 sm:gap-3">
              {promptFeatures.map((item) => (
                <li key={item.label} className="text-center">
                  <span
                    className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-avalon-border bg-white"
                    aria-hidden="true"
                  >
                    <Image src={item.icon} alt="" width={18} height={18} />
                  </span>
                  <span className="block text-[10px] leading-snug text-gray-600 sm:text-[11px]">
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-5 space-y-3">
              <button
                type="button"
                onClick={requestLocation}
                className="flex w-full items-center justify-between gap-3 rounded-full bg-avalon-red px-4 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#c9181f]"
              >
                <span className="flex items-center gap-2.5">
                  <Image
                    src={assets.findDealer.location}
                    alt=""
                    width={18}
                    height={18}
                    className="brightness-0 invert"
                  />
                  Use my location
                </span>
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20"
                  aria-hidden="true"
                >
                  <Image
                    src={assets.findDealer.arrow}
                    alt=""
                    width={14}
                    height={14}
                    className="brightness-0 invert"
                  />
                </span>
              </button>
              <button
                type="button"
                onClick={() => hide("declined")}
                className="w-full rounded-full border border-avalon-border bg-white py-3.5 text-sm font-semibold text-avalon-black transition hover:bg-avalon-warm"
              >
                Not now
              </button>
            </div>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] text-gray-400">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M7 11V8a5 5 0 0110 0v3M6 11h12v9H6V11z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Your location is used only to find nearby stores.
            </p>
          </div>
        </div>
      )}

      {phase === "locating" && (
        <div
          className="pointer-events-auto w-full max-w-[540px] rounded-t-3xl bg-white p-8 shadow-2xl sm:rounded-3xl"
          role="status"
          aria-busy="true"
        >
          <div className="flex items-center gap-4">
            <span
              className="inline-block h-9 w-9 shrink-0 animate-spin rounded-full border-2 border-avalon-border border-t-avalon-red"
              aria-hidden="true"
            />
            <p className="text-sm text-gray-600">Finding stores near you…</p>
          </div>
        </div>
      )}

      {phase === "success" && nearest && (
        <div
          className="pointer-events-auto relative flex max-h-[min(96vh,820px)] w-full max-w-[540px] flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="near-store-success-title"
        >
          <div className="relative flex justify-end p-4 pb-0 sm:p-5 sm:pb-0">
            <CloseButton onClick={() => hide("success-seen")} />
          </div>

          <div className="flex-1 overflow-y-auto px-5 pb-5 sm:px-7 sm:pb-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-avalon-red">
              Good news
            </p>
            <h2
              id="near-store-success-title"
              className="mt-2 max-w-[18rem] font-serif text-[1.55rem] leading-snug text-avalon-black sm:text-[1.75rem]"
            >
              An Avalon store is just{" "}
              <span className="text-avalon-red">
                {formatDistance(nearest.distanceKm)}
              </span>{" "}
              away
            </h2>

            <p className="mt-3 text-sm font-bold uppercase tracking-wide text-avalon-black">
              {nearest.dealer.name}
              <span className="font-semibold normal-case text-gray-500">
                {" "}
                · {nearest.dealer.city}
              </span>
            </p>
            <p className="mt-1.5 flex items-start gap-2 text-sm text-gray-600">
              <Image
                src={assets.findDealer.location}
                alt=""
                width={16}
                height={16}
                className="mt-0.5 shrink-0 opacity-70"
              />
              <span>{nearest.dealer.address}</span>
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] sm:items-start">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-avalon-soft">
                <Image
                  src={assets.home.findShowroom}
                  alt={`${nearest.dealer.name} storefront`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 540px) 45vw, 220px"
                />
              </div>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2.5">
                  <Image
                    src={assets.listing.delivery}
                    alt=""
                    width={18}
                    height={18}
                    className="mt-0.5 shrink-0 opacity-80"
                  />
                  <span>
                    ≈ {formatDistance(nearest.distanceKm)} from your location
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="mt-0.5 shrink-0 text-gray-600"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5" />
                    <path
                      d="M12 7v5l3 2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>
                    {estimateTravelTimeRange(nearest.distanceKm)} estimated travel
                    time
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Image
                    src={assets.findDealer.arrow}
                    alt=""
                    width={18}
                    height={18}
                    className="mt-0.5 shrink-0 opacity-80"
                  />
                  <span>Get directions easily</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Link
                href={`/find-a-dealer?dealer=${nearest.dealer.id}`}
                onClick={() => hide("success-seen")}
                className="inline-flex items-center justify-between gap-2 rounded-full bg-avalon-red px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#c9181f]"
              >
                Visit this store
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20"
                  aria-hidden="true"
                >
                  <Image
                    src={assets.findDealer.arrow}
                    alt=""
                    width={14}
                    height={14}
                    className="brightness-0 invert"
                  />
                </span>
              </Link>
              <Link
                href="/try-before-you-buy"
                onClick={() => hide("success-seen")}
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-avalon-red bg-white px-4 py-3.5 text-sm font-semibold text-avalon-red transition hover:bg-[#fff5f5]"
              >
                <Image
                  src={assets.tryBeforeYouBuy.calendar}
                  alt=""
                  width={18}
                  height={18}
                  className="icon-avalon-red"
                />
                Book a visit
              </Link>
            </div>

            <div className="mt-6 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
              <span className="h-px flex-1 bg-avalon-border" aria-hidden="true" />
              Experience comfort in person
              <span className="h-px flex-1 bg-avalon-border" aria-hidden="true" />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return overlay;
}

export default function NearStoreWelcome() {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  if (!mounted) return null;

  return <NearStoreWelcomePanel />;
}
