"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Indique au header la couleur de la section située sous lui
 * (html[data-surface="light|dark"]) pour qu’il reste lisible partout.
 */
export function SurfaceObserver() {
  const pathname = usePathname();
  useEffect(() => {
    const root = document.documentElement;
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-surface]"));
    if (!sections.length) return;
    const visible = new Map<Element, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => visible.set(e.target, e.isIntersecting));
        const current = sections.find((s) => visible.get(s));
        root.dataset.surface = current?.dataset.surface ?? "dark";
      },
      { rootMargin: "-36px 0px -96% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [pathname]);
  return null;
}
