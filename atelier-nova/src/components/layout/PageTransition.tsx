"use client";

import { useEffect, useState } from "react";
import { site } from "@/config/site";

let firstLoad = true;

/**
 * Transition de navigation : un rideau graphite se retire vers le haut à
 * l’arrivée sur une nouvelle page. Jamais au premier chargement (pour ne pas
 * retarder l’affichage), jamais en mouvement réduit.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const [curtain] = useState(() => {
    if (typeof window === "undefined") return false;
    const show = !firstLoad && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return show;
  });
  const [done, setDone] = useState(false);

  useEffect(() => {
    firstLoad = false;
  }, []);

  return (
    <>
      {curtain && !done ? (
        <div
          aria-hidden="true"
          onAnimationEnd={() => setDone(true)}
          className="page-curtain fixed inset-0 z-[90] flex items-end bg-graphite p-[var(--gutter)] text-ivory"
        >
          <span className="t-label opacity-60">{site.name}</span>
        </div>
      ) : null}
      {children}
    </>
  );
}
