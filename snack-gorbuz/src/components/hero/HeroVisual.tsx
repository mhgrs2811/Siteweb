"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { HeroPoster } from "./HeroPoster";
import styles from "./Hero.module.css";

const HeroScene = dynamic(() => import("./HeroScene").then((m) => m.HeroScene), {
  ssr: false,
  loading: () => null,
});

type Mode = "pending" | "poster" | "scene";

function supportsWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

function isLowEndDevice() {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  if (nav.connection?.saveData) return true;
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 2) return true;
  if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 2) return true;
  return false;
}

/**
 * Décide du rendu du visuel hero après hydratation :
 * - WebGL absent ou appareil faible → poster SVG ;
 * - sinon scène 3D chargée en différé, par-dessus le poster qui sert de
 *   placeholder jusqu'au premier rendu ;
 * - reduced-motion → scène statique (rendu à la demande) ;
 * - mobile → scène allégée (dpr 1, sans ombres portées).
 * Le H1, les CTA et la navigation ne dépendent jamais de ce composant.
 */
export function HeroVisual() {
  const [mode, setMode] = useState<Mode>("pending");
  const [reduced, setReduced] = useState(false);
  const [lite, setLite] = useState(false);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(true);
  const wrap = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const scroll = useRef(0);

  useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(rm.matches);
    rm.addEventListener("change", update);

    // Détection différée : laisse le texte et les CTA se peindre avant toute
    // décision, puis charge three.js seulement si l'appareil le permet.
    const id = window.setTimeout(() => {
      update();
      setLite(window.matchMedia("(max-width: 47.99rem)").matches);
      setMode(!supportsWebGL() || isLowEndDevice() ? "poster" : "scene");
    }, 120);

    return () => {
      window.clearTimeout(id);
      rm.removeEventListener("change", update);
    };
  }, []);

  // Pointeur (desktop uniquement) + scroll + visibilité.
  useEffect(() => {
    if (mode !== "scene") return;
    const fine = window.matchMedia("(pointer: fine)").matches;

    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onScroll = () => {
      scroll.current = Math.min(1, Math.max(0, window.scrollY / Math.max(window.innerHeight, 1)));
    };
    onScroll();
    if (fine) window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    let io: IntersectionObserver | undefined;
    if (wrap.current && "IntersectionObserver" in window) {
      io = new IntersectionObserver(([entry]) => setActive(!!entry?.isIntersecting), { threshold: 0.02 });
      io.observe(wrap.current);
    }
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  }, [mode]);

  return (
    <div ref={wrap} className={styles.visual} data-mode={mode} data-ready={ready || undefined}>
      <div className={styles.poster}>
        <HeroPoster />
      </div>
      {mode === "scene" && (
        <div className={styles.canvas}>
          <HeroScene
            pointer={pointer}
            scroll={scroll}
            reduced={reduced}
            lite={lite}
            active={active}
            onReady={() => setReady(true)}
          />
        </div>
      )}
    </div>
  );
}
