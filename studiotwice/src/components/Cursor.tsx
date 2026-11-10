"use client";

import { useEffect, useRef } from "react";
import { setupGsap } from "@/lib/gsap";

/** Curseur maison sur les appareils à pointeur précis. */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    const gsap = setupGsap();
    document.documentElement.classList.add("has-cursor");
    const x = gsap.quickTo(el, "x", { duration: 0.32, ease: "power3.out" });
    const y = gsap.quickTo(el, "y", { duration: 0.32, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      x(e.clientX);
      y(e.clientY);
      el.classList.add("is-visible");
    };
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      const hit = t?.closest("a, button, [data-cursor]");
      el.classList.toggle("is-active", Boolean(hit));
    };
    const down = () => el.classList.add("is-down");
    const up = () => el.classList.remove("is-down");
    const leave = () => el.classList.remove("is-visible");
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <div className="cursor" ref={ref} aria-hidden="true">
      <div className="cursor__ring" />
      <div className="cursor__dot" />
    </div>
  );
}
