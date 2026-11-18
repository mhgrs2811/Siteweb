"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { getGsap, isFinePointer, prefersReducedMotion } from "@/lib/motion";

/** Attire légèrement son contenu vers le curseur (desktop uniquement). */
export function Magnetic({ children, strength = 0.35, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !isFinePointer() || prefersReducedMotion()) return;
    const { gsap } = getGsap();
    const target = el.firstElementChild as HTMLElement | null;
    if (!target) return;
    const xTo = gsap.quickTo(target, "x", { duration: 0.6, ease: "power3.out" });
    const yTo = gsap.quickTo(target, "y", { duration: 0.6, ease: "power3.out" });

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => {
      gsap.to(target, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.4)" });
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [strength]);

  return (
    <span ref={ref} className={`inline-block p-3 -m-3 ${className ?? ""}`}>
      {children}
    </span>
  );
}
