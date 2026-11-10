"use client";

import { useEffect, useRef } from "react";
import { heroCopy } from "@/content/hero";
import { lerp, smoothstep as ss } from "@/lib/tokens";
import { drawRibbon } from "./ribbon";
import Blueprint from "./Blueprint";

interface Props {
  /** Progression de la construction, 0 à 1, pilotée par le défilement. */
  progress: React.RefObject<number>;
  /** Arrivée : 0 au chargement, 1 quand les plaques sont en place. */
  intro: React.RefObject<number>;
}

const d = heroCopy.demo;

/** Page d'exemple : du vrai HTML, posé sur une plaque en 3D CSS. */
function Demo({ variant }: { variant: "desk" | "phone" }) {
  return (
    <div className={`demo demo--${variant}`}>
      <div className="demo__grid" />
      <header className="demo__nav wf">
        <span className="wf__in">
          <b>{d.name}</b>
          <span className="demo__links">
            {(variant === "phone" ? [d.links[1]] : d.links).map((l, i, arr) => (
              <span key={l} className={i === arr.length - 1 ? "demo__link demo__link--on" : "demo__link"}>
                {l}
              </span>
            ))}
          </span>
        </span>
      </header>
      <div className="demo__rule">
        <i />
      </div>
      <h3 className="demo__title wf">
        <span className="wf__in">{d.title}</span>
      </h3>
      <p className="demo__para wf">
        <span className="wf__in">{d.para}</span>
      </p>
      <div className="demo__photo wf">
        <div className="demo__photo-img">
          <span>{d.photo}</span>
        </div>
      </div>
      <div className="demo__cta wf">
        <span className="wf__in">
          <span className="demo__cta-ink">{d.cta}</span>
          <span className="demo__cta-fill">
            <span>{d.cta}</span>
          </span>
        </span>
      </div>
      <footer className="demo__foot">
        <span>{d.footer}</span>
        <span className="demo__online">
          <i />
          {d.url}
        </span>
      </footer>
    </div>
  );
}

function Slab({ variant }: { variant: "desk" | "phone" }) {
  return (
    <div className={`slab slab--${variant}`} data-slab={variant}>
      <div className="slab__depth" />
      <div className="slab__body">
        <Demo variant={variant} />
        <div className="slab__shade" />
      </div>
      <div className="slab__wire" />
      <div className="slab__sketch">
        <i className="slab__line slab__line--l" />
        <i className="slab__line slab__line--r" />
        <i className="slab__line slab__line--t" />
        <i className="slab__line slab__line--b" />
      </div>
      <Blueprint variant={variant} />
    </div>
  );
}

/**
 * Scène du hero : deux plaques (ordinateur, téléphone) qui se construisent au défilement,
 * une lumière douce et un ruban derrière. Les transformations sont écrites chaque image,
 * les variables CSS seulement quand la progression change.
 */
export default function Stage({ progress, intro }: Props) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    // Le canvas du ruban est posé par le hero, sur toute sa largeur.
    const rc = el.closest(".hero")?.querySelector<HTMLCanvasElement>(".hero__ribbon") ?? null;
    if (!rc) return;
    const desk = el.querySelector<HTMLElement>('[data-slab="desk"]');
    const phone = el.querySelector<HTMLElement>('[data-slab="phone"]');
    if (!desk || !phone) return;
    const rctx = rc.getContext("2d");
    const fine = window.matchMedia("(pointer: fine)").matches;
    const compact = window.matchMedia("(max-width: 1023px)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let alive = true;
    let visible = true;
    let raf = 0;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const t0 = performance.now();
    let lastP = -1;
    let frame = 0;

    const host = rc.parentElement ?? el;
    const resize = () => {
      if (!rctx) return;
      const w = host.clientWidth;
      const h = host.clientHeight;
      rc.width = Math.round(w);
      rc.height = Math.round(h);
      rctx.setTransform(1, 0, 0, 1, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const onMove = (e: PointerEvent) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    if (fine) window.addEventListener("pointermove", onMove, { passive: true });

    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      if (visible && !raf) loop();
    });
    io.observe(el);

    const set = (name: string, v: number) => el.style.setProperty(name, v.toFixed(4));
    const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

    const loop = () => {
      if (!alive) return;
      if (!visible) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(loop);
      const p = clamp01(progress.current ?? 0);
      const it = clamp01(intro.current ?? 1);
      const t = (performance.now() - t0) / 1000;
      const e = ss(0, 1, p);
      mouse.x = lerp(mouse.x, mouse.tx, 0.045);
      mouse.y = lerp(mouse.y, mouse.ty, 0.045);
      const idle = reduce ? 0 : Math.sin(t * 0.45) * 0.8;

      const pChanged = Math.abs(p - lastP) > 0.0005;
      if (pChanged) {
        lastP = p;
        set("--face-a", ss(0.08, 0.3, p));
        set("--grid-a", ss(0.12, 0.3, p) * (1 - 0.72 * ss(0.36, 0.52, p)) * (1 - ss(0.7, 0.86, p)));
        set("--wire-a", lerp(0.5, 0.18, ss(0.3, 0.62, p)));
        set("--sketch-a", 0.55 * (1 - ss(0.16, 0.36, p)));
        // La feuille de croquis s'efface à mesure que la vraie page arrive.
        set("--bp-dots", 1 - ss(0.1, 0.28, p));
        set("--bp-blocks", 1 - ss(0.28, 0.44, p));
        set("--bp-labels", 1 - ss(0.22, 0.34, p));
        set("--bp-dim", 1 - ss(0.46, 0.62, p));
        set("--bp-gone", ss(0.3, 0.46, p));
        set("--bp-filet", 1 - ss(0.5, 0.7, p));
        el.querySelectorAll(".bp").forEach((n) => n.classList.toggle("is-done", p > 0.66));
        set("--t-nav", ss(0.3, 0.4, p));
        set("--t-title", ss(0.34, 0.47, p));
        set("--t-para", ss(0.42, 0.54, p));
        set("--t-cta", ss(0.46, 0.56, p));
        set("--t-foot", ss(0.5, 0.6, p));
        set("--frame-a", ss(0.34, 0.46, p));
        set("--photo-t", ss(0.55, 0.72, p));
        set("--color-t", ss(0.76, 0.88, p));
        set("--online-t", ss(0.92, 1, p));
        set("--shade", 1 - e * 0.55);
      }

      // Trois poses : arrivée (loin, de biais), croquis (p = 0), page finie (p = 1).
      // Les plaques flottent de part et d'autre de la carte : l'ordinateur à gauche, un peu
      // derrière le verre, le téléphone à droite, devant.
      const tilt = compact ? 0.4 : 1;
      const rxD = lerp(18, lerp(9, 5, e), it) + mouse.y * 2.5 * tilt + idle * 0.6;
      const ryD = lerp(48, lerp(26, 16, e), it) + mouse.x * 4 * tilt;
      const tzD = lerp(-360, lerp(-140, -60, e), it);
      const txD = lerp(-14, lerp(-4, -6, e), it);
      const tyD = lerp(10, lerp(4, 0, e), it) + idle * 0.5;
      const rxP = lerp(compact ? 18 : 10, lerp(6, 3, e), it) + mouse.y * 2 * tilt - idle * 0.5;
      const ryP = lerp(compact ? -22 : -44, lerp(compact ? -12 : -24, compact ? -4 : -14, e), it) + mouse.x * 3.5 * tilt;
      const tzP = lerp(compact ? -160 : -200, lerp(40, compact ? 40 : 120, e), it);
      const txP = lerp(compact ? 0 : 22, lerp(compact ? 0 : 8, 0, e), it);
      const tyP = lerp(compact ? 10 : 16, lerp(compact ? 4 : 6, 0, e), it) - idle * 0.6;
      desk.style.transform = `translate3d(${txD}%, ${tyD}%, ${tzD}px) rotateX(${rxD}deg) rotateY(${ryD}deg)`;
      phone.style.transform = `translate3d(${txP}%, ${tyP}%, ${tzP}px) rotateX(${rxP}deg) rotateY(${ryP}deg)`;

      // Le ruban ondule lentement : une image sur deux suffit quand la progression ne bouge pas.
      frame++;
      if (rctx && (pChanged || frame % 2 === 0)) drawRibbon(rctx, rc.width, rc.height, p, t, compact);
    };
    loop();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      if (fine) window.removeEventListener("pointermove", onMove);
    };
  }, [progress, intro]);

  return (
    <div className="stage" ref={root} aria-hidden="true">
      <div className="stage__glow" />
      <div className="stage__space">
        <Slab variant="desk" />
        <Slab variant="phone" />
      </div>
    </div>
  );
}
