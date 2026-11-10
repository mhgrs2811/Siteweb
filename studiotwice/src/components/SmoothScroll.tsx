"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { setupGsap, ScrollTrigger } from "@/lib/gsap";
import { setLenis } from "@/lib/lenis";

/** Défilement fluide (Lenis) synchronisé avec GSAP. Désactivé si l'utilisateur réduit le mouvement. */
export default function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const gsap = setupGsap();
    const lenis = new Lenis({ lerp: 0.11, smoothWheel: true, anchors: { offset: 0 } });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, []);
  return null;
}
