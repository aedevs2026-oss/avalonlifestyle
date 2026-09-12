"use client";

import { useState } from "react";
import Image from "next/image";
import { assets } from "@/lib/assets";

export default function FAQAccordion({ items, className = "" }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className={`divide-y divide-avalon-border ${className}`}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.question}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 py-4 text-left"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? null : index)}
            >
              <span className="font-medium text-sm md:text-base text-avalon-black">
                {item.question}
              </span>
              <Image
                src={isOpen ? assets.findDealer.minus : assets.findDealer.plus}
                alt=""
                width={20}
                height={20}
                className="shrink-0"
              />
            </button>
            {isOpen && (
              <div className="pb-4 text-sm leading-relaxed text-gray-600">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function FAQSection({
  id,
  className = "",
  label,
  title,
  description,
  items,
  buttonHref,
  buttonLabel = "View All FAQs",
}) {
  return (
    <section id={id} className={`section-padding bg-white ${className}`}>
      <div className="container-avalon grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        <div>
          {label && <span className="label-red">{label}</span>}
          <h2 className="font-serif text-3xl md:text-4xl mt-3 mb-4 text-avalon-black">
            {title}
          </h2>
          {description && (
            <p className="text-gray-600 mb-6">{description}</p>
          )}
          {buttonHref && (
            <a
              href={buttonHref}
              className="inline-flex items-center gap-2 rounded-full border border-avalon-red px-6 py-3 text-sm font-semibold text-avalon-red hover:bg-avalon-red hover:text-white transition-all"
            >
              {buttonLabel}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          )}
        </div>
        <FAQAccordion items={items} />
      </div>
    </section>
  );
}
