"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { home, projects, ui } from "@/content";
import { SectionLabel, FictionalBadge } from "@/components/ui/Label";
import { BrowserFrame, PhoneFrame } from "@/components/ui/Frames";
import { ButtonLink } from "@/components/ui/Button";
import { getGsap, prefersReducedMotion } from "@/lib/motion";

/**
 * Portfolio cinématographique.
 * Desktop : la section se fige et les cinq univers défilent horizontalement,
 * chacun dans ses propres couleurs. Mobile / tablette : carrousel tactile
 * natif (scroll-snap), aucun détournement du défilement.
 */
export function PortfolioShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
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
            if (progressRef.current) progressRef.current.style.transform = `scaleX(${self.progress})`;
            if (counterRef.current) {
              const i = Math.min(projects.length, Math.max(1, Math.round(self.progress * projects.length + 0.5)));
              counterRef.current.textContent = String(i).padStart(2, "0");
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
  }, []);

  return (
    <section ref={sectionRef} id="realisations" data-surface="dark" aria-labelledby="portfolio-title" className="surface-dark relative overflow-hidden">
      <div
        ref={trackRef}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto lg:h-[100svh] lg:snap-none lg:overflow-visible"
      >
        {/* Panneau d’introduction */}
        <div className="flex w-[88vw] shrink-0 snap-start flex-col justify-between px-[var(--gutter)] py-24 sm:w-[70vw] lg:w-[46vw] lg:py-28">
          <SectionLabel index="03">{home.portfolio.label}</SectionLabel>
          <div className="mt-16 lg:mt-0">
            <h2 id="portfolio-title" className="t-h2 max-w-[11ch]">
              Cinq univers, <span className="t-it">cinq systèmes</span> visuels.
            </h2>
            <p className="mt-8 max-w-[44ch] text-muted">{home.portfolio.intro}</p>
            <div className="mt-10">
              <ButtonLink href="/realisations" variant="ghost">
                {home.portfolio.cta}
              </ButtonLink>
            </div>
          </div>
          <p className="t-label mt-16 hidden items-center gap-4 text-muted lg:flex">
            <span aria-hidden="true" className="inline-block h-px w-12 bg-current" />
            Défiler pour parcourir
          </p>
          <p className="t-label mt-12 flex items-center gap-4 text-muted lg:hidden">
            <span aria-hidden="true" className="inline-block h-px w-12 bg-current" />
            Glisser pour parcourir
          </p>
        </div>

        {projects.map((p, i) => (
          <article
            key={p.slug}
            data-panel
            aria-labelledby={`p-${p.slug}`}
            className="relative flex w-[88vw] shrink-0 snap-start flex-col overflow-hidden sm:w-[78vw] lg:h-full lg:w-[82vw] xl:w-[78vw]"
            style={{ backgroundColor: p.theme.bg, color: p.theme.fg }}
          >
            <Link
              href={`/realisations/${p.slug}`}
              data-cursor={ui.viewProject}
              className="group flex h-full flex-col p-6 sm:p-8 lg:grid lg:grid-cols-12 lg:gap-8 lg:p-12 xl:p-16"
            >
              <div className="flex flex-col lg:col-span-4 lg:justify-between">
                <div className="flex items-center justify-between gap-4">
                  <span className="t-label tabular-nums opacity-70">
                    {p.number} / {String(projects.length).padStart(2, "0")}
                  </span>
                  <FictionalBadge />
                </div>
                <div className="mt-8 lg:mt-0">
                  <p className="t-label opacity-70">{p.categoryLabel}</p>
                  <h3 id={`p-${p.slug}`} className="mt-4 text-[clamp(2.3rem,1rem+2.9vw,4.8rem)] font-medium leading-[0.92] tracking-[-0.045em] hyphens-auto">
                    {p.name}
                  </h3>
                  <p className="t-it mt-5 max-w-[22ch] text-[clamp(1.35rem,1rem+1vw,2rem)] leading-[1.15] opacity-85">{p.tagline}</p>
                  <span className="mt-8 inline-flex min-h-11 items-center gap-3 border-b border-current pb-1 font-medium">
                    {ui.viewProject}
                    <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1.5">
                      →
                    </span>
                  </span>
                </div>
              </div>

              <div className="relative mt-10 lg:col-span-8 lg:mt-0 lg:flex lg:items-center">
                <div data-parallax className="relative w-full">
                  <BrowserFrame
                    src={p.images.desktopHero}
                    alt={`Capture de la page d’accueil du concept ${p.name}`}
                    url={`concept.ateliernova.be/${p.slug}`}
                    sizes="(min-width: 1024px) 52vw, 85vw"
                    tone={isLight(p.theme.bg) ? "light" : "dark"}
                    className="transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:-translate-y-2"
                  />
                  <PhoneFrame
                    src={p.images.mobile[0]}
                    alt={`Version mobile du concept ${p.name}`}
                    sizes="(min-width: 1024px) 13vw, 30vw"
                    className={[
                      "absolute -bottom-6 w-[27%] max-w-[230px] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:-translate-y-4 lg:-bottom-10",
                      i % 2 === 0 ? "-right-2 lg:-right-6" : "-left-2 lg:-left-8",
                    ].join(" ")}
                  />
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>

      {/* Progression (desktop) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 hidden items-center gap-6 px-[var(--gutter)] pb-6 mix-blend-difference lg:flex">
        <span ref={counterRef} className="t-label tabular-nums text-ivory">
          01
        </span>
        <span className="relative h-px flex-1 bg-ivory/30">
          <span ref={progressRef} className="absolute inset-0 origin-left scale-x-0 bg-ivory" />
        </span>
        <span className="t-label tabular-nums text-ivory">{String(projects.length).padStart(2, "0")}</span>
      </div>
    </section>
  );
}

function isLight(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 140;
}
