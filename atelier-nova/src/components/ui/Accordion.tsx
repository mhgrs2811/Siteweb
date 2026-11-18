"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/cn";

/** Accordéon accessible (bouton + région), ouverture animée en CSS. */
export function Accordion({ items, defaultOpen = 0 }: { items: { q: string; a: string }[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const base = useId();
  return (
    <div className="border-b border-line">
      {items.map((it, i) => {
        const isOpen = open === i;
        const btnId = `${base}-b${i}`;
        const panelId = `${base}-p${i}`;
        return (
          <div key={it.q} className="border-t border-line">
            <h3>
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-start justify-between gap-6 py-6 text-left md:py-7"
              >
                <span className="text-[clamp(1.15rem,1rem+0.6vw,1.6rem)] font-medium leading-snug tracking-[-0.015em] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1.5">
                  {it.q}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line transition-[transform,background-color,color] duration-500 ease-[var(--ease-out-expo)]",
                    isOpen && "rotate-45 bg-[var(--fg)] text-[var(--bg)]",
                  )}
                >
                  <Plus size={16} strokeWidth={1.5} />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease-out-expo)]",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden" inert={!isOpen}>
                <p className="max-w-[62ch] pb-8 pr-12 text-[color-mix(in_srgb,var(--fg)_78%,transparent)]">{it.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
