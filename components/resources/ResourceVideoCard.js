"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function ResourceVideoCard({
  title,
  subtitle,
  src,
  poster,
  duration,
}) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <article className="overflow-hidden rounded-xl border border-avalon-border bg-white shadow-sm">
        <button
          type="button"
          className="relative block aspect-video w-full cursor-pointer overflow-hidden"
          onClick={() => setOpen(true)}
          aria-label={`Play video: ${title}`}
        >
          <Image
            src={poster}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/25 transition hover:bg-black/35"
            aria-hidden="true"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-lg text-avalon-red shadow-md">
              ▶
            </span>
          </div>
          {duration && (
            <span className="absolute right-2.5 bottom-2.5 rounded bg-black/75 px-2 py-0.5 text-[11px] font-medium text-white">
              {duration}
            </span>
          )}
        </button>
        <div className="border-t border-avalon-border/60 p-4">
          <h3 className="text-sm font-semibold text-avalon-black">{title}</h3>
          <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>
        </div>
      </article>

      {open && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={title}
          onClick={() => setOpen(false)}
        >
          <div
            ref={dialogRef}
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute -top-10 right-0 text-sm font-semibold text-white hover:text-white/80"
            >
              Close
            </button>
            <video
              className="max-h-[80vh] w-full rounded-xl bg-black"
              controls
              autoPlay
              playsInline
              poster={poster}
            >
              <source src={src} type="video/mp4" />
            </video>
          </div>
        </div>
      )}
    </>
  );
}
