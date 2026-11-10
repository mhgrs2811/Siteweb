"use client";

import { useEffect, useRef } from "react";
import { setupGsap } from "@/lib/gsap";

/**
 * Léger décalage vertical au défilement, pour donner de la profondeur à un bloc.
 * `speed` est une fraction de la hauteur d'écran parcourue pendant la traversée du bloc.
 */
export default function Parallax({ children, speed = 0.08, className }: { children: React.ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    if (reduce || !desktop) return;
    const gsap = setupGsap();
    const ctx = gsap.context(() => {
      const d = window.innerHeight * speed;
      gsap.fromTo(
        el,
        { y: d },
        {
          y: -d,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [speed]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
