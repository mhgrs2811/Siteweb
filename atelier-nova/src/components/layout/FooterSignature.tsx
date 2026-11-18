"use client";

import { useEffect, useRef } from "react";
import { site } from "@/config/site";
import { getGsap, isFinePointer, prefersReducedMotion } from "@/lib/motion";

/**
 * Signature typographique animée : le nom de l’agence occupe toute la largeur.
 * Les lettres montent au défilement ; au survol, leur graisse suit le curseur
 * comme une vague (axe variable de Geist).
 */
export function FooterSignature() {
  const ref = useRef<HTMLDivElement>(null);
  const parts = site.name.split(" ");
  const last = parts.pop() ?? "";
  const first = parts.join(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const { gsap } = getGsap();
    const letters = Array.from(el.querySelectorAll<HTMLElement>("[data-l]"));
    const ctx = gsap.context(() => {
      gsap.from(letters, {
        yPercent: 110,
        duration: 1.4,
        stagger: 0.04,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
      });
    }, el);

    if (!isFinePointer()) return () => ctx.revert();
    const sans = letters.filter((l) => l.dataset.l === "sans");
    let raf = 0;
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        for (const l of sans) {
          const r = l.getBoundingClientRect();
          const d = Math.abs(e.clientX - (r.left + r.width / 2));
          const w = Math.round(250 + 550 * Math.max(0, 1 - d / 320));
          l.style.fontWeight = String(w);
        }
      });
    };
    const leave = () => sans.forEach((l) => (l.style.fontWeight = ""));
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      ctx.revert();
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="wrap-wide select-none pb-4 pt-24 md:pt-36">
      <div className="flex items-end justify-between overflow-hidden leading-[0.78]">
        {first.split("").map((c, i) => (
          <span
            key={`a${i}`}
            data-l="sans"
            className="inline-block text-[clamp(3.2rem,15.5vw,19rem)] font-[350] uppercase tracking-[-0.05em] transition-[font-weight] duration-300"
          >
            {c}
          </span>
        ))}
        <span className="inline-block w-[0.06em]" />
        {last.split("").map((c, i) => (
          <span key={`b${i}`} data-l="serif" className="t-it inline-block text-[clamp(3.6rem,17vw,21rem)] text-nova">
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}
