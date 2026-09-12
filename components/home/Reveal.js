"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Reveal
 * Lightweight scroll-triggered animation wrapper. Fades + slides children
 * into place the first time they enter the viewport. No external
 * dependencies — just IntersectionObserver + CSS transitions, so it drops
 * into any Next.js project without extra installs.
 */
export default function Reveal({
  children,
  as: Tag = "div",
  className = "",
  delay = 0,
  duration = 700,
  y = 26,
  x = 0,
  scale = 0.98,
  once = true,
  threshold = 0.15,
  style = {},
  ...props
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(() =>
    typeof window !== "undefined" &&
    Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches)
  );

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once, threshold]);

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translate3d(0,0,0) scale(1)"
          : `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
        transition: `opacity ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        willChange: "opacity, transform",
        ...style,
      }}
      {...props}
    >
      {children}
    </Tag>
  );
}
