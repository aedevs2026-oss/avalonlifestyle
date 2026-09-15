"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { assets } from "@/lib/assets";

/** Persists across refreshes and new tabs (until site data is cleared). */
const STORAGE_KEY = "avalon-splash-dismissed";

function hasDismissedSplash() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return true;
  }
}

function markSplashDismissed() {
  try {
    localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* ignore */
  }
}

function readDismissed() {
  if (typeof window === "undefined") {
    return true;
  }
  return hasDismissedSplash();
}

export default function SplashScreen() {
  const videoRef = useRef(null);
  const dismissed = useSyncExternalStore(
    () => () => {},
    readDismissed,
    () => true
  );
  const [closed, setClosed] = useState(false);
  const [fading, setFading] = useState(false);

  const visible = !dismissed && !closed;

  const dismiss = useCallback(() => {
    if (fading) return;
    markSplashDismissed();
    setFading(true);
    window.setTimeout(() => setClosed(true), 450);
  }, [fading]);

  useEffect(() => {
    if (!visible) return;
    const video = videoRef.current;
    if (!video) return;

    const play = async () => {
      try {
        video.muted = true;
        await video.play();
      } catch {
        /* autoplay blocked — user can tap Skip */
      }
    };
    play();
  }, [visible]);

  if (!visible) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center bg-black transition-opacity duration-500 ${
        fading ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Avalon brand introduction"
    >
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        playsInline
        muted
        preload="auto"
        onEnded={dismiss}
      >
        <source src={assets.brand.splashVideo.web} type="video/mp4" media="(min-width: 1024px)" />
        <source src={assets.brand.splashVideo.mobile} type="video/mp4" />
      </video>

      <button
        type="button"
        onClick={dismiss}
        className="absolute right-4 top-4 rounded-full border border-white/40 bg-black/35 px-4 py-2 text-xs font-semibold tracking-wide text-white backdrop-blur-sm transition hover:bg-black/55 sm:right-6 sm:top-6 sm:text-sm"
      >
        Skip
      </button>
    </div>
  );
}
