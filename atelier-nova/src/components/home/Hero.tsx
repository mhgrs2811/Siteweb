"use client";

import { useEffect, useRef } from "react";
import { home, nav } from "@/content";
import { site } from "@/config/site";
import { Sculpture } from "@/components/three/Sculpture";
import { ButtonLink } from "@/components/ui/Button";
import { Scrollfinger } from "@/components/ui/Scrollfinger";
import { onIntro } from "@/lib/intro";
import { getGsap, prefersReducedMotion } from "@/lib/motion";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const h = home.hero;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const { gsap } = getGsap();
    const reduced = prefersReducedMotion();
    const reveals = el.querySelectorAll<HTMLElement>(".hero-reveal");
    const fades = el.querySelectorAll<HTMLElement>(".hero-fade");

    const ctx = gsap.context(() => {
      if (reduced) {
        reveals.forEach((r) => (r.style.animation = "none"));
        fades.forEach((f) => (f.style.animation = "none"));
        gsap.set(reveals, { y: 0, yPercent: 0 });
        gsap.set(fades, { opacity: 1 });
        return;
      }

      // Parallaxe typographique : chaque ligne glisse à sa vitesse en sortant.
      const lines = el.querySelectorAll<HTMLElement>("[data-hero-line]");
      const drift = [-6, 9, -4];
      lines.forEach((line, i) => {
        gsap.to(line, {
          xPercent: drift[i] ?? 0,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.6 },
        });
      });
      gsap.to("[data-hero-sub]", {
        y: -60,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "60% top", scrub: true },
      });
    }, el);

    const off = onIntro(() => {
      if (reduced) return;
      reveals.forEach((r) => (r.style.animation = "none"));
      fades.forEach((f) => (f.style.animation = "none"));
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.fromTo(reveals, { y: 0, yPercent: 105, rotate: 3 }, { y: 0, yPercent: 0, rotate: 0, duration: 1.5, stagger: 0.09 })
        .fromTo(fades, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.06 }, 0.45);
    });

    return () => {
      off();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={ref}
      id="top"
      data-surface="dark"
      aria-labelledby="hero-title"
      className="surface-dark grain relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-24 md:pt-28"
    >
      {/* Sculpture signature */}
      <Sculpture
        poster="/images/sculpture/nova-ring.webp"
        priority
        className="pointer-events-none absolute left-1/2 top-[3.5rem] z-0 h-[58svh] w-[150vw] -translate-x-1/2 md:left-auto md:right-[-12vw] md:top-[-7%] md:h-[96%] md:w-[72vw] md:translate-x-0"
      />

      <div className="wrap-wide relative flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-6">
          <p className="hero-fade t-label text-muted max-w-[26ch] md:max-w-none">{h.eyebrow}</p>
          <p className="hero-fade t-label hidden items-center gap-3 md:flex">
            <span aria-hidden="true" className="pulse-dot inline-block h-2 w-2 rounded-full bg-nova" />
            {site.availability}
          </p>
        </div>

        <div className="mt-auto pt-[34svh] md:pt-10">
          <h1 id="hero-title" className="hero-title text-[clamp(2.75rem,min(0.9rem+9vw,15.5vh),10.5rem)] font-medium leading-[0.9] tracking-[-0.045em]">
            {h.lines.map((line, i) => (
              <span
                key={line}
                data-hero-line
                className={
                  i === h.italicLine
                    ? "split-line t-it pl-[8vw] leading-[0.95] mix-blend-difference md:pl-[16vw]"
                    : "split-line"
                }
              >
                <span className="hero-reveal">{line}</span>
              </span>
            ))}
          </h1>

          <div data-hero-sub className="mt-10 grid gap-8 pb-10 md:mt-12 md:grid-cols-12 md:items-end md:pb-12">
            <p className="hero-fade t-lead measure text-[color-mix(in_srgb,var(--fg)_82%,transparent)] md:order-2 md:col-span-5 md:col-start-8">
              {h.lead}
            </p>
            <div className="hero-fade flex flex-wrap items-center gap-x-4 gap-y-3 md:order-1 md:col-span-6">
              <ButtonLink href={nav.cta.href} variant="accent">
                {h.primary}
              </ButtonLink>
              <ButtonLink href="/realisations" variant="ghost">
                {h.secondary}
              </ButtonLink>
            </div>
          </div>
        </div>

        <div className="hero-fade flex items-end justify-between border-t border-line py-5 md:py-6">
          <Scrollfinger href="#manifeste" label={h.scroll} />
          <p className="t-label text-muted text-right">
            {site.city}
            <span className="hidden sm:inline"> — {site.region}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
