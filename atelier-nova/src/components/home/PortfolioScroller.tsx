"use client";

import { useEffect } from "react";
import { projects } from "@/content";
import { getGsap, prefersReducedMotion } from "@/lib/motion";

/**
 * Pilote du portfolio horizontal (desktop) : épingle la section, fait
 * défiler la piste et met à jour la progression. Aucun rendu propre :
 * le balisage est servi par le composant serveur PortfolioShowcase.
 */
export function PortfolioScroller({ id }: { id: string }) {
  useEffect(() => {
    const root = document.getElementById(id);
    const section = root?.querySelector<HTMLElement>("[data-pin]");
    const track = root?.querySelector<HTMLElement>("[data-track]");
    const progress = root?.querySelector<HTMLElement>("[data-progress]");
    const counter = root?.querySelector<HTMLElement>("[data-counter]");
    if (!section || !track || prefersReducedMotion()) return;
    const { gsap } = getGsap();
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const distance = () => track.scrollWidth - window.innerWidth;
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progress) progress.style.transform = `scaleX(${self.progress})`;
            if (counter) {
              const i = Math.min(projects.length, Math.max(1, Math.round(self.progress * projects.length + 0.5)));
              counter.textContent = String(i).padStart(2, "0");
            }
          },
        },
      });
      // Parallaxe interne : les mockups glissent un peu plus vite que leur panneau.
      track.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
        gsap.fromTo(
          el,
          { xPercent: 12 },
          {
            xPercent: -12,
            ease: "none",
            scrollTrigger: { trigger: el.closest("[data-panel]"), containerAnimation: tween, start: "left right", end: "right left", scrub: true },
          },
        );
      });
      return () => tween.kill();
    });
    return () => mm.revert();
  }, [id]);

  return null;
}
