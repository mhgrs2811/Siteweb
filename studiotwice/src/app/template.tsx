"use client";

import { useEffect, useRef } from "react";
import { setupGsap } from "@/lib/gsap";

/** Transition de page : le contenu arrive doucement, sans fondu identique sur chaque bloc. */
export default function Template({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const gsap = setupGsap();
    gsap.fromTo(el, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.9, ease: "studio", clearProps: "clipPath" });
  }, []);
  return <div ref={ref}>{children}</div>;
}
