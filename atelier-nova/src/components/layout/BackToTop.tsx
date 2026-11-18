"use client";

import { ArrowUp } from "lucide-react";

export function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => {
        window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
        document.querySelector<HTMLElement>("#contenu")?.focus({ preventScroll: true });
      }}
      className="group inline-flex min-h-11 items-center gap-2 text-[var(--fg)]"
    >
      Haut de page
      <ArrowUp size={16} strokeWidth={1.5} aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-1" />
    </button>
  );
}
