"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { useInView, useReducedMotion } from "@/lib/hooks";
import { HeroPoster } from "./HeroPoster";
import s from "./HeroVisual.module.css";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false, loading: () => null });

/** Isole la scène WebGL : la moindre erreur ramène au poster, sans casser la page. */
class SceneBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

const detectWebGL = (): boolean => {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    return Boolean(gl);
  } catch {
    return false;
  }
};

type Mode = "pending" | "scene" | "poster";

/**
 * Visuel du hero : poster SVG rendu côté serveur (visible immédiatement),
 * puis scène 3D chargée en différé sur tablette/desktop avec WebGL.
 * Sur mobile (< 768 px) ou sans WebGL : le poster reste.
 */
export function HeroVisual({ label }: { label: string }) {
  const [mode, setMode] = useState<Mode>("pending");
  const [ready, setReady] = useState(false);
  const [maxDpr, setMaxDpr] = useState(1.5);
  const reduced = useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>({ once: false, rootMargin: "0px", threshold: 0.05 });
  const idle = useRef<number | null>(null);

  useEffect(() => {
    const decide = () => {
      const wide = window.matchMedia("(min-width: 768px)").matches;
      const large = window.matchMedia("(min-width: 1024px)").matches;
      setMaxDpr(large ? 1.6 : 1.25);
      // Mouvement réduit : poster statique, aucun contexte WebGL créé.
      setMode(wide && !reduced && detectWebGL() ? "scene" : "poster");
    };
    // Charge la 3D après le contenu prioritaire.
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (typeof w.requestIdleCallback === "function") {
      idle.current = w.requestIdleCallback(decide, { timeout: 1200 });
    } else {
      idle.current = window.setTimeout(decide, 250);
    }
    return () => {
      if (idle.current !== null) {
        if (typeof w.requestIdleCallback === "function") {
          (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback?.(idle.current);
        } else {
          window.clearTimeout(idle.current);
        }
      }
    };
  }, [reduced]);

  // Si l’écran repasse sous 768 px, on revient au poster (la scène est démontée).
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (!mq.matches) {
        setMode("poster");
        setReady(false);
      } else if (!reduced && detectWebGL()) {
        setMode("scene");
      }
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [reduced]);

  return (
    <div ref={ref} className={s.visual} role="img" aria-label={label}>
      <HeroPoster className={[s.poster, ready ? s.posterHidden : ""].join(" ")} />
      {mode === "scene" && (
        <div className={[s.canvas, ready ? s.canvasReady : ""].join(" ")} aria-hidden="true">
          <SceneBoundary
            onError={() => {
              setMode("poster");
              setReady(false);
            }}
          >
            <HeroScene animate={!reduced} active={inView} maxDpr={maxDpr} onReady={() => setReady(true)} />
          </SceneBoundary>
        </div>
      )}
    </div>
  );
}
