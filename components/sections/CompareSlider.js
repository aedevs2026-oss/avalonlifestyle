"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";

/**
 * Interactive before/after mattress comparison slider.
 * Matches the Compare & Decide control in the Mattresses reference.
 */
export default function CompareSlider({
  leftImage,
  rightImage,
  leftLabel = "Memory Foam",
  leftSub = "Cloud-like comfort",
  rightLabel = "Pocket Spring",
  rightSub = "Responsive support",
  alt = "Mattress comparison",
}) {
  const containerRef = useRef(null);
  const [position, setPosition] = useState(50);
  const dragging = useRef(false);

  const updateFromClientX = useCallback((clientX) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(98, Math.max(2, next)));
  }, []);

  const onPointerDown = (e) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    updateFromClientX(e.clientX);
  };

  const onPointerMove = (e) => {
    if (!dragging.current) return;
    updateFromClientX(e.clientX);
  };

  const onPointerUp = () => {
    dragging.current = false;
  };

  return (
    <div
      ref={containerRef}
      className="relative aspect-[16/10] w-full cursor-ew-resize select-none overflow-hidden rounded-2xl bg-avalon-soft touch-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      role="img"
      aria-label={alt}
    >
      <Image
        src={rightImage}
        alt=""
        fill
        className="object-cover object-center"
        sizes="(max-width: 1024px) 100vw, 50vw"
        draggable={false}
        priority={false}
      />

      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image
          src={leftImage}
          alt=""
          fill
          className="object-cover object-center"
          sizes="(max-width: 1024px) 100vw, 50vw"
          draggable={false}
        />
      </div>

      <div className="pointer-events-none absolute bottom-4 left-4 max-w-[48%]">
        <div className="rounded-lg bg-white/95 px-3 py-2 shadow-sm">
          <p className="text-[10px] leading-snug text-avalon-black sm:text-[11px]">
            <span className="font-semibold">{leftLabel}</span>
            <span className="text-gray-600"> — {leftSub}</span>
          </p>
        </div>
      </div>
      <div className="pointer-events-none absolute right-4 bottom-4 max-w-[48%] text-right">
        <div className="rounded-lg bg-white/95 px-3 py-2 shadow-sm">
          <p className="text-[10px] leading-snug text-avalon-black sm:text-[11px]">
            <span className="font-semibold">{rightLabel}</span>
            <span className="text-gray-600"> — {rightSub}</span>
          </p>
        </div>
      </div>

      <div
        className="absolute inset-y-0 z-10 w-0.5 bg-white shadow-[0_0_8px_rgba(0,0,0,0.25)]"
        style={{ left: `${position}%` }}
      >
        <button
          type="button"
          className="absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-avalon-red text-white shadow-lg"
          aria-label="Drag to compare mattresses"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(position)}
          role="slider"
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") setPosition((p) => Math.max(2, p - 3));
            if (e.key === "ArrowRight") setPosition((p) => Math.min(98, p + 3));
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M7 4L3 9L7 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M11 4L15 9L11 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
