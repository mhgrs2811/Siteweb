"use client";

import { useEffect, useRef, useState } from "react";
import { home, projects, reasons } from "@/content";
import { SectionLabel } from "@/components/ui/Label";
import { Reveal } from "@/components/ui/Reveal";
import { Line } from "@/components/ui/Split";
import { cn } from "@/lib/cn";

/**
 * « Pourquoi Atelier Nova » : six arguments, six démonstrations différentes
 * dans une composition éditoriale asymétrique (pas de grille de cartes identiques).
 */
export function Why() {
  const r = Object.fromEntries(reasons.map((x) => [x.id, x]));
  return (
    <section data-surface="dark" aria-labelledby="why-title" className="surface-dark relative section-y">
      <div className="wrap-wide">
        <div className="grid-12 gap-y-8">
          <div className="col-span-4 md:col-span-8">
            <SectionLabel index="05">{home.why.label}</SectionLabel>
            <Reveal as="h2" mode="lines" id="why-title" className="t-h2 mt-8">
              <Line>Ce qui change quand</Line>
              <Line>
                vous travaillez <span className="t-it">avec nous.</span>
              </Line>
            </Reveal>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 border-l border-t border-line md:mt-24 md:grid-cols-12">
          <Cell className="md:col-span-5 md:row-span-2" title={r.personnalisation.title} text={r.personnalisation.text} n="01">
            <PaletteDemo />
          </Cell>
          <Cell className="md:col-span-7" title={r.direction.title} text={r.direction.text} n="02">
            <TypeDemo />
          </Cell>
          <Cell className="md:col-span-4" title={r.rapidite.title} text={r.rapidite.text} n="03">
            <TimelineDemo />
          </Cell>
          <Cell className="md:col-span-3" title={r.performance.title} text={r.performance.text} n="04">
            <GaugeDemo />
          </Cell>
          <Cell className="md:col-span-7" title={r.expertise.title} text={r.expertise.text} n="05">
            <StackDemo />
          </Cell>
          <Cell className="md:col-span-5" title={r.humain.title} text={r.humain.text} n="06">
            <p className="t-it text-[clamp(1.8rem,1.2rem+1.8vw,3rem)] leading-[1.05]">
              « Vous parlez toujours à la même personne. »
            </p>
          </Cell>
        </div>
      </div>
    </section>
  );
}

function Cell({ className, title, text, n, children }: { className?: string; title: string; text: string; n: string; children: React.ReactNode }) {
  return (
    <Reveal className={cn("flex flex-col justify-between gap-10 border-b border-r border-line p-6 md:p-10", className)}>
      <div className="min-h-[7rem]">{children}</div>
      <div>
        <p className="t-label text-accent tabular-nums">{n}</p>
        <h3 className="t-h4 mt-3">{title}</h3>
        <p className="mt-3 max-w-[44ch] text-muted">{text}</p>
      </div>
    </Reveal>
  );
}

/** Les palettes des cinq concepts défilent : chaque client a la sienne. */
function PaletteDemo() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((v) => (v + 1) % projects.length), 2200);
    return () => clearInterval(id);
  }, []);
  const p = projects[i];
  return (
    <div>
      <div className="flex h-56 md:h-80" aria-hidden="true">
        {p.palette.map((c, k) => (
          <span
            key={k}
            className="h-full flex-1 transition-[background-color] duration-700 ease-[var(--ease-out-expo)]"
            style={{ backgroundColor: c.hex, transitionDelay: `${k * 70}ms` }}
          />
        ))}
      </div>
      <p className="mt-4 flex items-baseline justify-between gap-4" aria-live="polite">
        <span className="t-it text-2xl">{p.name}</span>
        <span className="t-label text-muted">
          {p.fonts.display} / {p.fonts.text}
        </span>
      </p>
    </div>
  );
}

function TypeDemo() {
  return (
    <div aria-hidden="true" className="relative flex items-end gap-6 overflow-hidden">
      <span className="t-it text-[clamp(6rem,4rem+8vw,13rem)] leading-[0.75]">Aa</span>
      <span className="text-[clamp(6rem,4rem+8vw,13rem)] font-semibold leading-[0.75] tracking-[-0.06em]">Aa</span>
      <span className="mb-2 hidden flex-col gap-2 lg:flex">
        <span className="t-label text-muted">Instrument Serif — italique</span>
        <span className="t-label text-muted">Geist — 300 à 800</span>
        <span className="mt-2 flex gap-1.5">
          {["#0e0e0d", "#eeeae2", "#8e8b84", "#c8cbcf", "#ff4f17"].map((c) => (
            <span key={c} className="h-5 w-5 rounded-full ring-1 ring-white/15" style={{ backgroundColor: c }} />
          ))}
        </span>
      </span>
    </div>
  );
}

function TimelineDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setOn(true), { threshold: 0.6 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  const rows = [
    { label: "Essential", from: 0, to: 4 },
    { label: "Signature", from: 0, to: 8 },
    { label: "E-commerce", from: 0, to: 10 },
  ];
  return (
    <div ref={ref} className="space-y-4">
      {rows.map((row, i) => (
        <div key={row.label}>
          <div className="flex justify-between text-sm">
            <span>{row.label}</span>
            <span className="text-muted tabular-nums">≤ {row.to} sem.</span>
          </div>
          <div className="mt-2 h-[3px] bg-[var(--line)]">
            <div
              className="h-full origin-left bg-ivory transition-transform duration-[1400ms] ease-[var(--ease-out-expo)]"
              style={{ transform: `scaleX(${on ? row.to / 10 : 0})`, transitionDelay: `${i * 120}ms` }}
            />
          </div>
        </div>
      ))}
      <p className="t-label text-muted">Délais indicatifs, contenus fournis</p>
    </div>
  );
}

function GaugeDemo() {
  const ref = useRef<SVGSVGElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setOn(true), { threshold: 0.6 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  const c = 2 * Math.PI * 52;
  return (
    <div className="flex items-center gap-5">
      <svg ref={ref} viewBox="0 0 120 120" className="h-28 w-28 -rotate-90" aria-hidden="true">
        <circle cx="60" cy="60" r="52" fill="none" stroke="var(--line)" strokeWidth="3" />
        <circle
          cx="60"
          cy="60"
          r="52"
          fill="none"
          stroke="var(--color-nova)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={on ? c * 0.1 : c}
          style={{ transition: "stroke-dashoffset 1.6s cubic-bezier(0.16,1,0.3,1)" }}
        />
      </svg>
      <p>
        <span className="t-serif block text-5xl leading-none">≥ 90</span>
        <span className="t-label mt-2 block text-muted">Objectif mobile</span>
      </p>
    </div>
  );
}

function StackDemo() {
  const items = ["Next.js", "React", "TypeScript", "Three.js", "GSAP", "Shopify", "Headless CMS", "API d’IA", "Automatisations"];
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Technologies utilisées">
      {items.map((t) => (
        <li key={t} className="chip !min-h-10 !cursor-default">
          {t}
        </li>
      ))}
    </ul>
  );
}
