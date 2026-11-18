"use client";

import { useEffect, useRef, type ElementType, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { getGsap, prefersReducedMotion } from "@/lib/motion";

type Mode = "lines" | "words" | "fade" | "clip" | "stagger" | "scale";

type RevealProps<T extends ElementType> = {
  as?: T;
  mode?: Mode;
  delay?: number;
  stagger?: number;
  start?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children">;

/**
 * Révélation au défilement (GSAP + ScrollTrigger).
 * Le contenu reste visible sans JavaScript et en mouvement réduit :
 * l’état initial n’est posé qu’au montage.
 */
export function Reveal<T extends ElementType = "div">({
  as,
  mode = "fade",
  delay = 0,
  stagger = 0.08,
  start = "top 85%",
  children,
  ...rest
}: RevealProps<T>) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const { gsap } = getGsap();
    // Déjà visible au montage (au-dessus de la ligne de flottaison) : pas d’animation d’entrée tardive.
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.85 && r.bottom > 0 && start === "top 85%") return;

    const ctx = gsap.context(() => {}, el);
    const targetsFor = () =>
      mode === "lines" || mode === "words"
        ? el.querySelectorAll(mode === "lines" ? ".split-line > span" : ".split-word > span")
        : mode === "stagger"
          ? el.children
          : [el];

    // État initial
    ctx.add(() => {
      if (mode === "lines" || mode === "words") gsap.set(targetsFor(), { yPercent: 115, rotate: 2 });
      else if (mode === "clip") gsap.set(el, { clipPath: "inset(18% 8% 18% 8%)" });
      else if (mode === "stagger") gsap.set(el.children, { y: 40, opacity: 0 });
      else if (mode === "scale") gsap.set(el, { scale: 0.92, opacity: 0 });
      else gsap.set(el, { y: 36, opacity: 0 });
    });

    // Déclenchement par IntersectionObserver (plus léger qu’un ScrollTrigger par élément)
    const pct = parseInt(start.split(" ")[1] ?? "85", 10);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        ctx.add(() => {
          if (mode === "lines" || mode === "words") {
            gsap.to(targetsFor(), { yPercent: 0, rotate: 0, duration: 1.2, stagger, delay });
          } else if (mode === "clip") {
            gsap.to(el, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, delay, ease: "expo.inOut" });
            const media = el.querySelector("img, video");
            if (media) gsap.from(media, { scale: 1.25, duration: 1.8, delay, ease: "expo.out" });
          } else if (mode === "stagger") {
            gsap.to(el.children, { y: 0, opacity: 1, duration: 1, stagger, delay });
          } else if (mode === "scale") {
            gsap.to(el, { scale: 1, opacity: 1, duration: 1.4, delay });
          } else {
            gsap.to(el, { y: 0, opacity: 1, duration: 1.1, delay });
          }
        });
      },
      { rootMargin: `0px 0px -${100 - (Number.isFinite(pct) ? pct : 85)}% 0px` },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      ctx.revert();
    };
  }, [mode, delay, stagger, start]);

  return (
    <Tag ref={ref} {...rest}>
      {children}
    </Tag>
  );
}
