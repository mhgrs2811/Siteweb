"use client";

import { useEffect, useRef } from "react";
import { site } from "@/config/site";
import { fireIntro } from "@/lib/intro";
import { getGsap } from "@/lib/motion";

/**
 * Préchargeur : affiché une seule fois par session (le script inline du
 * layout pose html[data-preload="1"]). Animation typographique du logo,
 * compteur relié au chargement réel des polices, puis levée de rideau.
 * Durée plafonnée à ~2,2 s.
 */
export function Preloader() {
  const ref = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const el = ref.current;
    if (root.dataset.preload !== "1" || !el) {
      fireIntro();
      return;
    }
    const { gsap } = getGsap();
    const counter = { v: 0 };
    const letters = el.querySelectorAll("[data-pl]");
    const bar = el.querySelector("[data-bar]");
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      try {
        sessionStorage.setItem("nova-intro", "1");
      } catch {}
      const tl = gsap.timeline({
        onComplete: () => {
          delete root.dataset.preload;
          el.style.display = "none";
        },
      });
      tl.to(letters, { yPercent: -110, duration: 0.7, stagger: 0.025, ease: "expo.in" })
        .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.1, ease: "expo.inOut" }, "-=0.25")
        .add(() => fireIntro(), "-=0.75");
    };

    const intro = gsap.timeline();
    intro
      .from(letters, { yPercent: 110, duration: 1, stagger: 0.045, ease: "expo.out" })
      .to(counter, {
        v: 82,
        duration: 1,
        ease: "power2.out",
        onUpdate: () => {
          if (countRef.current) countRef.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
          if (bar) (bar as HTMLElement).style.transform = `scaleX(${counter.v / 100})`;
        },
      }, 0.15);

    const ready = Promise.race([
      Promise.all([document.fonts.ready, new Promise((r) => setTimeout(r, 850))]),
      new Promise((r) => setTimeout(r, 2000)),
    ]);
    ready.then(() => {
      gsap.to(counter, {
        v: 100,
        duration: 0.45,
        ease: "power2.inOut",
        onUpdate: () => {
          if (countRef.current) countRef.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
          if (bar) (bar as HTMLElement).style.transform = `scaleX(${counter.v / 100})`;
        },
        onComplete: finish,
      });
    });

    // Échap ou clic : passer l’intro.
    const skip = () => finish();
    el.addEventListener("click", skip);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && finish();
    window.addEventListener("keydown", onKey);
    return () => {
      el.removeEventListener("click", skip);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const letters = site.name.split("");
  const splitAt = site.name.lastIndexOf(" ");

  return (
    <div
      ref={ref}
      className="preloader surface-dark grain fixed inset-0 z-[100] flex-col justify-between p-[var(--gutter)]"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      aria-hidden="true"
    >
      <div className="flex items-center justify-between t-label text-muted">
        <span>{site.tagline}</span>
        <span>{site.city}</span>
      </div>
      <div>
        <p className="flex overflow-hidden leading-[0.85]">
          {letters.map((c, i) => (
            <span
              key={i}
              data-pl
              className={
                i > splitAt
                  ? "t-it inline-block text-[clamp(4rem,16vw,15rem)]"
                  : "inline-block text-[clamp(3.4rem,13.5vw,12.5rem)] font-[450] uppercase tracking-[-0.05em]"
              }
            >
              {c === " " ? " " : c}
            </span>
          ))}
        </p>
        <div className="mt-8 flex items-end justify-between gap-6">
          <div className="relative h-px flex-1 bg-[var(--line)]">
            <span data-bar className="absolute inset-0 origin-left scale-x-0 bg-chrome" />
          </div>
          <span ref={countRef} className="t-serif text-5xl tabular-nums md:text-7xl">
            000
          </span>
        </div>
      </div>
    </div>
  );
}
