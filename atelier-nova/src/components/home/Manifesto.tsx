"use client";

import { useEffect, useRef } from "react";
import { home } from "@/content";
import { SectionLabel } from "@/components/ui/Label";
import { getGsap, prefersReducedMotion } from "@/lib/motion";

/**
 * Manifeste : la page passe du graphite à l’ivoire, puis le texte
 * s’allume mot à mot au rythme du défilement.
 */
export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const m = home.manifesto;
  const words = m.text.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { backgroundColor: "#0e0e0d", color: "#eeeae2" },
        {
          backgroundColor: "#eeeae2",
          color: "#0e0e0d",
          ease: "none",
          immediateRender: false,
          scrollTrigger: { trigger: el, start: "top bottom", end: "top 25%", scrub: true },
        },
      );
      gsap.fromTo(
        "[data-mw]",
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: "none",
          immediateRender: false,
          scrollTrigger: { trigger: "[data-mtext]", start: "top bottom", end: "bottom 45%", scrub: true },
        },
      );
      gsap.from("[data-trio] > *", {
        y: 80,
        opacity: 0,
        stagger: 0.12,
        duration: 1.3,
        scrollTrigger: { trigger: "[data-trio]", start: "top 80%", once: true },
      });
      gsap.from("[data-result] .split-line > span", {
        yPercent: 110,
        duration: 1.3,
        stagger: 0.1,
        scrollTrigger: { trigger: "[data-result]", start: "top 85%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="manifeste" data-surface="light" aria-labelledby="manifeste-title" className="surface-light relative section-y">
      <div className="wrap-wide">
        <div className="grid-12">
          <div className="col-span-4 md:col-span-2">
            <SectionLabel index="01">{m.label}</SectionLabel>
          </div>
          <h2 id="manifeste-title" className="sr-only">
            {m.label}
          </h2>
          <p
            data-mtext
            className="t-serif col-span-4 mt-10 text-[clamp(1.9rem,0.9rem+3.6vw,4.9rem)] leading-[1.06] md:col-span-10 md:mt-0 md:indent-[16.6%]"
          >
            {words.map((w, i) => (
              <span key={i} data-mw className="inline">
                {w}
                {i < words.length - 1 ? " " : ""}
              </span>
            ))}
          </p>
        </div>

        {/* Équation : regard + vitesse + rigueur */}
        <div data-trio className="mt-24 grid gap-14 md:mt-40 md:grid-cols-12 md:gap-6">
          {m.trio.map((item, i) => (
            <div
              key={item.word}
              className={[
                "relative border-t border-line pt-6",
                i === 0 ? "md:col-span-4" : i === 1 ? "md:col-span-4 md:mt-24" : "md:col-span-4 md:mt-48",
              ].join(" ")}
            >
              <span aria-hidden="true" className="t-serif absolute -top-[0.62em] right-0 text-[3.5rem] leading-none text-accent">
                {i < 2 ? "+" : "="}
              </span>
              <p className="t-h3">{item.word}</p>
              <p className="t-it mt-1 text-[clamp(1.6rem,1.2rem+1.4vw,2.6rem)] leading-none text-muted">{item.role}</p>
              <p className="t-label mt-8 text-muted">{item.verbs}</p>
            </div>
          ))}
        </div>

        <p data-result className="mt-24 text-[clamp(2.4rem,1.2rem+5.4vw,7.5rem)] font-medium leading-[0.95] tracking-[-0.045em] md:mt-36">
          <span className="split-line">
            <span>Des sites qui ne</span>
          </span>
          <span className="split-line md:pl-[25%]">
            <span>
              ressemblent <span className="t-it">qu’à vous.</span>
            </span>
          </span>
        </p>
      </div>
    </section>
  );
}
