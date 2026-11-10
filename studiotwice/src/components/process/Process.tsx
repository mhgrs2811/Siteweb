"use client";

import { useEffect, useRef } from "react";
import SectionHead from "@/components/SectionHead";
import { process as c } from "@/content/sections";
import { setupGsap } from "@/lib/gsap";
import { sheetFor } from "./Sheets";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Section 05, épinglée : quatre feuilles arrivent du fond l'une après l'autre et se posent
 * sur la table ; leur contenu se remplit au défilement, le grand mot nomme l'étape.
 * Sur mobile : une liste verticale, chaque feuille se remplit à son entrée dans l'écran.
 */
export default function Process() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const gsap = setupGsap();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    const n = c.steps.length;

    if (reduce) {
      el.querySelectorAll(".ps, .proc__step").forEach((x) => x.classList.add("is-in"));
      return;
    }
    if (!desktop) {
      const io = new IntersectionObserver(
        (entries) => {
          for (const en of entries) {
            if (en.isIntersecting) {
              en.target.classList.add("is-in");
              io.unobserve(en.target);
            }
          }
        },
        { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
      );
      el.querySelectorAll(".proc__step, .proc__sheet-m .ps").forEach((t) => io.observe(t));
      return () => io.disconnect();
    }

    const stage = el.querySelector<HTMLElement>(".proc__stage");
    const space = el.querySelector<HTMLElement>(".proc__space");
    if (!stage || !space) return;
    const steps = Array.from(el.querySelectorAll<HTMLElement>(".proc__step"));
    const sheets = Array.from(el.querySelectorAll<HTMLElement>(".proc__sheet"));
    const glow = el.querySelector<HTMLElement>(".proc__glow");
    const idx = el.querySelector<HTMLElement>(".proc__idx b");
    const fill = el.querySelector<HTMLElement>(".proc__seq .seq__fill");
    const labels = Array.from(el.querySelectorAll<HTMLElement>(".proc__seq .seq__list li"));
    let current = 0;
    let removeMove: (() => void) | null = null;

    // Le contenu d'une feuille se remplit de lui-même, dès que son étape est en place.
    const reveal = (i: number) => {
      sheets.forEach((sh, k) => {
        gsap.killTweensOf(sh, "--s");
        if (k < i) gsap.set(sh, { "--s": 1 });
        if (k > i) gsap.set(sh, { "--s": 0 });
      });
      gsap.fromTo(sheets[i], { "--s": 0 }, { "--s": 1, duration: 2.2, ease: "power1.inOut", delay: 0.45, overwrite: "auto" });
    };

    // Trois poses : à venir (loin, à droite), active (face à nous), faite (repoussée sur la table).
    const poseNext = { x: "58%", y: "16%", z: -340, rotationY: -32, rotationX: 10, rotationZ: 4, autoAlpha: 0, scale: 0.96 };
    const poseActive = { x: "0%", y: "0%", z: 0, rotationY: -7, rotationX: 3, rotationZ: 0, autoAlpha: 1, scale: 1 };
    const poseDone = (k: number) => ({
      x: `${-14 - 9 * k}%`,
      y: `${7 + 5 * k}%`,
      z: -110 - 80 * k,
      rotationY: -16,
      rotationX: 5,
      rotationZ: -2.5 - 2 * k,
      autoAlpha: Math.max(0.14, 0.5 - 0.16 * k),
      scale: 1 - 0.04 * k,
    });

    const ctx = gsap.context(() => {
      gsap.set(steps, { autoAlpha: 0, y: 24 });
      gsap.set(steps[0], { autoAlpha: 1, y: 0 });
      sheets.forEach((s, i) => gsap.set(s, i === 0 ? poseActive : poseNext));
      labels[0]?.classList.add("is-on");

      const tl = gsap.timeline({
        defaults: { ease: "studio", duration: 0.7 },
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: `+=${n * 100}%`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          onEnter: () => reveal(current),
          onEnterBack: () => reveal(current),
          onLeaveBack: () => sheets.forEach((sh) => gsap.set(sh, { "--s": 0 })),
          onUpdate: (st) => {
            const i = Math.min(n - 1, Math.floor(st.progress * n));
            if (idx) idx.textContent = pad(i + 1);
            if (i !== current) {
              current = i;
              labels.forEach((l, k) => l.classList.toggle("is-on", k === i));
              reveal(i);
            }
          },
        },
      });
      if (fill) tl.fromTo(fill, { scaleX: 0 }, { scaleX: 1, ease: "none", duration: n }, 0);
      for (let i = 1; i < n; i++) {
        const at = i;
        for (let k = 0; k < i; k++) tl.to(sheets[k], poseDone(i - 1 - k), at);
        tl.to(sheets[i], poseActive, at);
        tl.to(steps[i - 1], { autoAlpha: 0, y: -18, duration: 0.3 }, at);
        tl.to(steps[i], { autoAlpha: 1, y: 0, duration: 0.5 }, at + 0.25);
        if (glow) tl.to(glow, { xPercent: -8 * i, yPercent: 6 * i, duration: 0.7 }, at);
      }
      // La fin de la dernière étape garde un temps de lecture : la frise va jusqu'au bout.
      tl.to({}, { duration: 0.001 }, n);

      // La table s'incline légèrement vers le pointeur.
      if (window.matchMedia("(pointer: fine)").matches) {
        const rx = gsap.quickTo(space, "rotationX", { duration: 0.9, ease: "power3.out" });
        const ry = gsap.quickTo(space, "rotationY", { duration: 0.9, ease: "power3.out" });
        const onMove = (e: PointerEvent) => {
          const nx = (e.clientX / window.innerWidth) * 2 - 1;
          const ny = (e.clientY / window.innerHeight) * 2 - 1;
          ry(nx * 4);
          rx(-ny * 3);
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        removeMove = () => window.removeEventListener("pointermove", onMove);
      }
    }, el);

    return () => {
      ctx.revert();
      removeMove?.();
    };
  }, []);

  return (
    <section id="comment" ref={root} className="proc" aria-labelledby="comment-title">
      <div className="section proc__head">
        <SectionHead id="comment" num={c.num} title={c.title} lead={c.lead} />
      </div>

      <div className="proc__stage">
        <div className="proc__glow" aria-hidden="true" />
        <div className="proc__inner">
          <div className="proc__left">
            <p className="proc__idx t-caption" aria-hidden="true">
              <b>01</b>
              <span className="proc__idx-sep" />
              <span>{pad(c.steps.length)}</span>
            </p>
            <ol className="proc__steps">
              {c.steps.map((s, i) => (
                <li key={s.sheet} className="proc__step">
                  <span className="proc__step-num t-caption">Étape {i + 1}</span>
                  <h3 className="proc__title t-display">{s.title}</h3>
                  <p className="proc__text">{s.text}</p>
                  {/* Sur mobile, la feuille suit son étape ; sur ordinateur, elle vit sur la table à droite. */}
                  <div className="proc__sheet-m">{sheetFor(s.sheet)}</div>
                </li>
              ))}
            </ol>
            <div className="seq proc__seq" aria-hidden="true">
              <span className="seq__track">
                <span className="seq__fill" />
              </span>
              <ol className="seq__list">
                {c.steps.map((s) => (
                  <li key={s.sheet}>{s.word}</li>
                ))}
              </ol>
            </div>
          </div>
          <div className="proc__table" aria-hidden="true">
            <div className="proc__space">
              {c.steps.map((s) => (
                <div key={s.sheet} className="proc__sheet">
                  {sheetFor(s.sheet)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
