"use client";

import { useEffect, useRef } from "react";
import { setupGsap } from "@/lib/gsap";

/** Bouton qui suit légèrement le pointeur quand il s'approche. Souris seulement. */
export default function Magnetic({ children, strength = 0.35 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    const gsap = setupGsap();
    const x = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
    const y = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const dist = Math.hypot(dx, dy);
      const radius = Math.max(r.width, r.height) * 1.1;
      if (dist < radius) {
        x(dx * strength);
        y(dy * strength);
      } else {
        x(0);
        y(0);
      }
    };
    const leave = () => {
      x(0);
      y(0);
    };
    window.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [strength]);

  return (
    <span ref={ref} className="magnetic">
      {children}
    </span>
  );
}
