"use client";

import { useEffect } from "react";
import { getGsap, isFinePointer, prefersReducedMotion } from "@/lib/motion";

/**
 * Aperçu flottant de l’index des services (desktop) : suit le curseur et
 * affiche le visuel du service survolé. Le balisage est rendu côté serveur.
 */
export function ServicesPreviewController({ id }: { id: string }) {
  useEffect(() => {
    const el = document.getElementById(id);
    const preview = el?.querySelector<HTMLElement>("[data-preview]");
    const list = el?.querySelector<HTMLElement>("[data-list]");
    if (!el || !preview || !list || !isFinePointer() || prefersReducedMotion()) return;
    const items = Array.from(preview.querySelectorAll<HTMLElement>("[data-preview-item]"));
    const { gsap } = getGsap();
    const xTo = gsap.quickTo(preview, "x", { duration: 0.7, ease: "power3.out" });
    const yTo = gsap.quickTo(preview, "y", { duration: 0.7, ease: "power3.out" });
    const rTo = gsap.quickTo(preview, "rotate", { duration: 0.9, ease: "power3.out" });
    let lastX = 0;
    let active = -1;

    const show = (i: number) => {
      if (i === active) return;
      active = i;
      items.forEach((it, k) => {
        it.style.clipPath = k === i ? "inset(0% 0% 0% 0%)" : "inset(50% 50% 50% 50%)";
        it.style.opacity = k === i ? "1" : "0";
      });
    };
    const move = (e: PointerEvent) => {
      // L’aperçu se place à côté du curseur pour ne jamais masquer le titre survolé.
      xTo(e.clientX + (e.clientX < window.innerWidth * 0.55 ? 250 : -250));
      yTo(e.clientY - 20);
      rTo(Math.max(-8, Math.min(8, (e.clientX - lastX) * 0.4)));
      lastX = e.clientX;
      const li = (e.target as HTMLElement).closest<HTMLElement>("li[data-index]");
      show(li && list.contains(li) ? Number(li.dataset.index) : -1);
    };
    const leave = () => show(-1);
    el.addEventListener("pointermove", move);
    list.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      list.removeEventListener("pointerleave", leave);
    };
  }, [id]);
  return null;
}
