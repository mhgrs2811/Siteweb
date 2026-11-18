"use client";

import { useEffect, useRef, useState } from "react";
import { home, processSteps } from "@/content";
import { SectionLabel } from "@/components/ui/Label";
import { Reveal } from "@/components/ui/Reveal";
import { Line } from "@/components/ui/Split";
import { cn } from "@/lib/cn";

/**
 * Méthode : un grand numéro reste épinglé à gauche et change à mesure que
 * les six étapes défilent à droite. Une ligne verticale mesure l’avancement.
 */
export function Method({ index = "04", compact = false }: { index?: string; compact?: boolean }) {
  const [active, setActive] = useState(0);
  const stepsRef = useRef<HTMLOListElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const list = stepsRef.current;
    if (!list) return;
    const items = Array.from(list.querySelectorAll<HTMLElement>("[data-step]"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    items.forEach((i) => io.observe(i));

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = list.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (window.innerHeight * 0.5 - r.top) / r.height));
        if (fillRef.current) fillRef.current.style.transform = `scaleY(${p})`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const current = processSteps[active];

  return (
    <section data-surface="light" aria-labelledby="methode-title" id="methode" className="surface-paper relative section-y">
      <div className="wrap-wide grid-12 gap-y-14">
        <div className="col-span-4 md:col-span-5">
          <div className="md:sticky md:top-28">
            <SectionLabel index={index}>{home.process.label}</SectionLabel>
            <Reveal as="h2" mode="lines" id="methode-title" className="t-h2 mt-8 max-w-[12ch]">
              <Line>Six étapes,</Line>
              <Line>
                <span className="t-it">aucune zone</span>
              </Line>
              <Line>d’ombre.</Line>
            </Reveal>
            <p className="mt-6 max-w-[38ch] text-muted">{home.process.intro}</p>

            {!compact ? (
              <div aria-hidden="true" className="mt-14 hidden items-end gap-6 md:flex">
                <span className="relative block h-[clamp(7rem,13vw,13rem)] overflow-hidden">
                  {processSteps.map((s, i) => (
                    <span
                      key={s.number}
                      className={cn(
                        "t-serif absolute left-0 top-0 block text-[clamp(7rem,13vw,13rem)] leading-none tabular-nums transition-[transform,opacity] duration-700 ease-[var(--ease-out-expo)]",
                        i === active ? "translate-y-0 opacity-100" : i < active ? "-translate-y-full opacity-0" : "translate-y-full opacity-0",
                      )}
                    >
                      {s.number}
                    </span>
                  ))}
                  <span className="invisible t-serif block text-[clamp(7rem,13vw,13rem)] leading-none">00</span>
                </span>
                <span className="pb-4">
                  <span className="t-label block text-muted">{current.duration}</span>
                  <span className="t-it mt-1 block text-2xl">{current.deliverable}</span>
                </span>
              </div>
            ) : null}
          </div>
        </div>

        <ol ref={stepsRef} className="relative col-span-4 md:col-span-6 md:col-start-7">
          <span aria-hidden="true" className="absolute bottom-0 left-0 top-0 w-px bg-[var(--line)]" />
          <span ref={fillRef} aria-hidden="true" className="absolute bottom-0 left-0 top-0 w-px origin-top scale-y-0 bg-nova" />
          {processSteps.map((s, i) => (
            <li
              key={s.number}
              data-step={i}
              className={cn(
                "relative pb-16 pl-8 transition-opacity duration-500 last:pb-0 md:pb-28 md:pl-12",
                i === active ? "opacity-100" : "md:opacity-40",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "absolute -left-[5px] top-2 h-[11px] w-[11px] rounded-full border transition-colors duration-500",
                  i <= active ? "border-nova bg-nova" : "border-[var(--muted)] bg-[var(--bg)]",
                )}
              />
              <p className="t-label text-muted">
                <span className="text-accent">{s.number}</span> — {s.duration}
              </p>
              <h3 className="t-h3 mt-4">{s.title}</h3>
              <p className="mt-4 max-w-[52ch] text-[color-mix(in_srgb,var(--fg)_78%,transparent)]">{s.text}</p>
              <p className="mt-5 inline-flex items-center gap-3 text-sm">
                <span className="t-label text-muted">Livrable</span>
                <span className="t-it text-xl">{s.deliverable}</span>
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
