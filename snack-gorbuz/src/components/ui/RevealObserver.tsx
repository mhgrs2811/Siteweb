"use client";

import { useEffect } from "react";

/**
 * Observe tous les éléments [data-reveal] du document (y compris ceux ajoutés
 * après une navigation client) et ajoute `.is-in` à l'entrée dans le viewport.
 * Les composants serveur n'ont donc qu'à poser l'attribut, sans JS propre.
 * En reduced-motion ou sans IntersectionObserver, tout est affiché immédiatement.
 */
export function RevealObserver() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const all = () => Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    if (reduced || !("IntersectionObserver" in window)) {
      all().forEach((el) => el.classList.add("is-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    const observe = (el: HTMLElement) => {
      if (el.classList.contains("is-in")) return;
      // Éléments déjà dans le viewport au montage : affichage immédiat, sans attendre.
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        el.classList.add("is-in");
        return;
      }
      io.observe(el);
    };

    all().forEach(observe);

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((n) => {
          if (!(n instanceof HTMLElement)) return;
          if (n.hasAttribute("data-reveal")) observe(n);
          n.querySelectorAll<HTMLElement>("[data-reveal]").forEach(observe);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
