"use client";

import { useEffect, useRef } from "react";
import { getGsap, isFinePointer, prefersReducedMotion } from "@/lib/motion";

/**
 * Curseur personnalisé (pointeur fin uniquement).
 * - point plein qui suit exactement la souris ;
 * - anneau qui suit avec inertie, s’agrandit sur les liens ;
 * - [data-cursor="Voir"] (ou tout libellé) : l’anneau devient une pastille avec texte.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!isFinePointer() || prefersReducedMotion()) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");
    const { gsap } = getGsap();
    const d = dot.current!;
    const r = ring.current!;
    gsap.set([d, r], { xPercent: -50, yPercent: -50, opacity: 0 });
    const dx = gsap.quickTo(d, "x", { duration: 0.08, ease: "none" });
    const dy = gsap.quickTo(d, "y", { duration: 0.08, ease: "none" });
    const rx = gsap.quickTo(r, "x", { duration: 0.5, ease: "power3.out" });
    const ry = gsap.quickTo(r, "y", { duration: 0.5, ease: "power3.out" });
    let visible = false;
    let mode = "";

    const setMode = (next: string, text = "") => {
      if (next === mode) return;
      mode = next;
      r.dataset.mode = next;
      if (label.current) label.current.textContent = text;
    };

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!visible) {
        visible = true;
        gsap.to([d, r], { opacity: 1, duration: 0.3 });
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
      const t = e.target as HTMLElement;
      const labelled = t.closest<HTMLElement>("[data-cursor]");
      if (labelled) return setMode("label", labelled.dataset.cursor);
      if (t.closest("input, textarea, select")) return setMode("text");
      if (t.closest("a, button, [role='button'], label, summary")) return setMode("link");
      setMode("");
    };
    const leave = () => {
      visible = false;
      gsap.to([d, r], { opacity: 0, duration: 0.3 });
    };
    const down = () => gsap.to(r, { scale: 0.8, duration: 0.2 });
    const up = () => gsap.to(r, { scale: 1, duration: 0.4, ease: "elastic.out(1,0.5)" });

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  return (
    <div className="cursor" aria-hidden="true">
      <div ref={ring} className="cursor-ring">
        <span ref={label} className="cursor-label" />
      </div>
      <div ref={dot} className="cursor-dot" />
    </div>
  );
}
