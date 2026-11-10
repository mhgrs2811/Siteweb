"use client";

import { useEffect, useRef } from "react";
import { heroCopy } from "@/content/hero";
import { dayFromProgress, lerp, smoothstep as ss } from "@/lib/tokens";
import { drawRibbon } from "./ribbon";

interface Props {
  progress: React.RefObject<number>;
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
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <line x1="0" y1="0" x2="100" y2="100" vectorEffect="non-scaling-stroke" />
          <line x1="100" y1="0" x2="0" y2="100" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
    </div>
  );
}

/**
 * Scène du hero : deux plaques (ordinateur, téléphone) qui se construisent au défilement,
 * un ruban de lumière derrière. Tout est piloté par des variables CSS mises à jour chaque image.
 */
export default function Stage({ progress }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const ribbon = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = root.current;
    const rc = ribbon.current;
    if (!el || !rc) return;
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

    const resize = () => {
      if (!rctx) return;
      const w = el.clientWidth;
      const h = el.clientHeight;
      const dpr = Math.min(window.devicePixelRatio, 1.25);
      rc.width = Math.round(w * dpr);
      rc.height = Math.round(h * dpr);
      rctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

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

    const loop = () => {
      if (!alive) return;
      if (!visible) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(loop);
      const p = Math.min(1, Math.max(0, progress.current ?? 0));
      const t = (performance.now() - t0) / 1000;
      const e = ss(0, 1, p);
      const day = dayFromProgress(p);
      mouse.x = lerp(mouse.x, mouse.tx, 0.045);
      mouse.y = lerp(mouse.y, mouse.ty, 0.045);
      const idle = reduce ? 0 : Math.sin(t * 0.45) * 0.8;

      if (Math.abs(p - lastP) > 0.0005) {
        lastP = p;
      set("--face-a", ss(0.08, 0.3, p));
      set("--grid-a", ss(0.12, 0.3, p) * (1 - 0.72 * ss(0.36, 0.52, p)) * (1 - ss(0.7, 0.86, p)));
      set("--dash-a", ss(0.16, 0.3, p) * (1 - ss(0.34, 0.48, p)));
      set("--wire-a", lerp(0.95, 0.22, ss(0.3, 0.62, p)) * (1 - day * 0.5));
      set("--sketch-a", 0.55 * (1 - ss(0.16, 0.36, p)));
      set("--t-nav", ss(0.3, 0.4, p));
      set("--t-title", ss(0.34, 0.47, p));
      set("--t-para", ss(0.42, 0.54, p));
      set("--t-cta", ss(0.46, 0.56, p));
      set("--t-foot", ss(0.5, 0.6, p));
      set("--frame-a", ss(0.34, 0.46, p));
      set("--photo-t", ss(0.55, 0.72, p));
      set("--color-t", ss(0.76, 0.88, p));
      set("--online-t", ss(0.92, 1, p));
      set("--day", day);
      set("--shade", 1 - e * 0.55);
      }

      const tilt = compact ? 0.4 : 1;
      const rxD = lerp(15, 2.5, e) + mouse.y * 2.5 * tilt + idle * 0.6;
      const ryD = lerp(-34, -9, e) + mouse.x * 4 * tilt;
      const rxP = lerp(7, 0, e) + mouse.y * 2 * tilt - idle * 0.5;
      const ryP = lerp(compact ? -18 : 30, compact ? -5 : 11, e) + mouse.x * 3.5 * tilt;
      desk.style.transform = `translate3d(${lerp(2, 0, e)}%, ${lerp(2, 0, e) + idle * 0.4}%, ${lerp(-120, 0, e)}px) rotateX(${rxD}deg) rotateY(${ryD}deg)`;
      phone.style.transform = `translate3d(${lerp(14, 0, e)}%, ${lerp(10, 0, e) - idle * 0.5}%, ${lerp(20, 140, e)}px) rotateX(${rxP}deg) rotateY(${ryP}deg)`;

      if (rctx) drawRibbon(rctx, el.clientWidth, el.clientHeight, p, t, day, compact);
    };
    loop();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      if (fine) window.removeEventListener("pointermove", onMove);
    };
  }, [progress]);

  return (
    <div className="stage" ref={root} aria-hidden="true">
      <canvas className="stage__ribbon" ref={ribbon} />
      <div className="stage__space">
        <Slab variant="desk" />
        <Slab variant="phone" />
      </div>
    </div>
  );
}
