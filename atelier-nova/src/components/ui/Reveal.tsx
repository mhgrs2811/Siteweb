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
    const ctx = gsap.context(() => {
      const st = { trigger: el, start, once: true };
      if (mode === "lines" || mode === "words") {
        const targets = el.querySelectorAll(mode === "lines" ? ".split-line > span" : ".split-word > span");
        gsap.from(targets, { yPercent: 115, rotate: 2, duration: 1.2, stagger, delay, scrollTrigger: st });
      } else if (mode === "clip") {
        gsap.fromTo(
          el,
          { clipPath: "inset(18% 8% 18% 8%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, delay, ease: "expo.inOut", scrollTrigger: st },
        );
        const media = el.querySelector("img, video");
        if (media) gsap.from(media, { scale: 1.25, duration: 1.8, delay, ease: "expo.out", scrollTrigger: st });
      } else if (mode === "stagger") {
        gsap.from(el.children, { y: 40, opacity: 0, duration: 1, stagger, delay, scrollTrigger: st });
      } else if (mode === "scale") {
        gsap.from(el, { scale: 0.92, opacity: 0, duration: 1.4, delay, scrollTrigger: st });
      } else {
        gsap.from(el, { y: 36, opacity: 0, duration: 1.1, delay, scrollTrigger: st });
      }
    }, el);
    return () => ctx.revert();
  }, [mode, delay, stagger, start]);

  return (
    <Tag ref={ref} {...rest}>
      {children}
    </Tag>
  );
}
