"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { categories, projects, ui } from "@/content";
import type { ProjectCategory } from "@/content/fr/projects";
import { FictionalBadge } from "@/components/ui/Label";
import { getMedia } from "@/lib/media";
import { cn } from "@/lib/cn";

/** Rythme éditorial : largeurs et décalages qui varient d’une carte à l’autre. */
const pattern = [
  "md:col-span-7",
  "md:col-span-5 md:mt-40",
  "md:col-span-5 md:col-start-2",
  "md:col-span-6 md:col-start-7 md:-mt-24",
  "md:col-span-10 md:col-start-2",
];

export function ProjectGrid() {
  const [filter, setFilter] = useState<ProjectCategory | "all">("all");
  const reduce = useReducedMotion();
  const list = useMemo(() => projects.filter((p) => filter === "all" || p.category === filter), [filter]);

  return (
    <div>
      <div role="group" aria-label="Filtrer les réalisations" className="flex flex-wrap gap-2">
        {categories.map((c) => {
          const count = c.id === "all" ? projects.length : projects.filter((p) => p.category === c.id).length;
          return (
            <button key={c.id} type="button" aria-pressed={filter === c.id} onClick={() => setFilter(c.id)} className="chip gap-2">
              {c.label}
              <span className="text-xs tabular-nums opacity-60">{count}</span>
            </button>
          );
        })}
      </div>
      <p className="sr-only" aria-live="polite">
        {list.length} réalisation{list.length > 1 ? "s" : ""} affichée{list.length > 1 ? "s" : ""}
      </p>

      <motion.ul layout={!reduce} className="mt-14 grid grid-cols-1 gap-x-6 gap-y-20 md:mt-20 md:grid-cols-12 md:gap-y-28">
        <AnimatePresence mode="popLayout" initial={false}>
          {list.map((p, i) => {
            const m = getMedia(p.images.cover);
            const span = filter === "all" ? pattern[i % pattern.length] : i % 2 === 0 ? "md:col-span-7" : "md:col-span-5 md:mt-32";
            return (
              <motion.li
                key={p.slug}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className={cn("col-span-1", span)}
              >
                <Link href={`/realisations/${p.slug}`} data-cursor={ui.viewProject} className="group block">
                  <div className="relative overflow-hidden" style={{ backgroundColor: p.theme.bg }}>
                    <div className="aspect-[16/10] overflow-hidden">
                      <Image
                        src={m.src}
                        alt={p.alt.cover}
                        width={m.width}
                        height={m.height}
                        sizes="(min-width: 768px) 60vw, 92vw"
                        placeholder={m.blurDataURL ? "blur" : "empty"}
                        blurDataURL={m.blurDataURL || undefined}
                        className="h-full w-full object-cover transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-[1.05]"
                      />
                    </div>
                    {/* La capture du site glisse au survol */}
                    <div className="pointer-events-none absolute inset-x-[8%] bottom-0 translate-y-[101%] overflow-hidden rounded-t-[8px] shadow-2xl transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-y-[38%] group-focus-visible:translate-y-[38%]">
                      <Image src={p.images.desktopHero} alt="" width={1440} height={900} sizes="50vw" className="h-auto w-full" />
                    </div>
                    <FictionalBadge className="absolute left-4 top-4 text-ivory mix-blend-difference" />
                  </div>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                    <div>
                      <p className="t-label text-muted">
                        {p.number} — {p.categoryLabel}
                      </p>
                      <h2 className="t-h3 mt-3 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-2">
                        {p.name}
                      </h2>
                      <p className="t-it mt-2 text-xl text-muted">{p.tagline}</p>
                    </div>
                    <p className="t-label pt-1 text-muted sm:shrink-0 sm:text-right">
                      {p.place}
                      <br />
                      {p.year}
                    </p>
                  </div>
                </Link>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}
