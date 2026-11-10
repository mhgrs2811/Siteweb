"use client";

import { useEffect, useRef } from "react";
import SectionHead from "@/components/SectionHead";
import { process as c } from "@/content/sections";
import { setupGsap } from "@/lib/gsap";
import { sheetFor } from "./Sheets";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Section 05, épinglée : quatre feuilles se posent sur la table l'une après l'autre,
 * le titre et le texte de l'étape changent à gauche. Sur mobile, une liste verticale.
 */
export default function Process() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!desktop || reduce) return;
    const gsap = setupGsap();
    const steps = el.querySelectorAll<HTMLElement>(".proc__step");
    const sheets = el.querySelectorAll<HTMLElement>(".proc__sheet");
    const ticks = el.querySelectorAll<HTMLElement>(".proc__tick");
    const idx = el.querySelector<HTMLElement>(".proc__idx b");
    const n = steps.length;

    const ctx = gsap.context(() => {
      // État de départ : première étape visible, les autres feuilles à droite, hors champ.
      gsap.set(steps, { autoAlpha: 0, y: 24 });
      gsap.set(steps[0], { autoAlpha: 1, y: 0 });
      sheets.forEach((s, i) => gsap.set(s, { xPercent: i === 0 ? 0 : 120, rotate: i === 0 ? 0 : 6, scale: 1, autoAlpha: 1 }));
      gsap.set(ticks[0], { scaleX: 1 });

      const tl = gsap.timeline({
        defaults: { ease: "studio", duration: 1 },
        scrollTrigger: {
          trigger: el.querySelector(".proc__stage"),
          start: "top top",
          end: `+=${(n - 1) * 100}%`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (st) => {
            if (idx) idx.textContent = pad(Math.min(n, Math.round(st.progress * (n - 1)) + 1));
          },
        },
      });
      for (let i = 1; i < n; i++) {
        const at = i - 1;
        // la feuille précédente glisse à gauche sur la table et s'éteint un peu
        tl.to(sheets[i - 1], { xPercent: -14 * i, rotate: -4 - i, scale: 0.94, autoAlpha: 0.55 }, at);
        for (let k = 0; k < i - 1; k++) tl.to(sheets[k], { xPercent: -14 * (i - k) - 6, autoAlpha: 0.3 }, at);
        // la nouvelle feuille arrive de la droite et se pose
        tl.to(sheets[i], { xPercent: 0, rotate: 0 }, at);
        // le texte change
        tl.to(steps[i - 1], { autoAlpha: 0, y: -18, duration: 0.4 }, at);
        tl.to(steps[i], { autoAlpha: 1, y: 0, duration: 0.6 }, at + 0.35);
        tl.to(ticks[i], { scaleX: 1, duration: 0.5 }, at + 0.2);
      }
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section id="comment" ref={root} className="proc" aria-labelledby="comment-title">
      <div className="section proc__head">
        <SectionHead id="comment" num={c.num} title={c.title} lead={c.lead} />
      </div>

      <div className="proc__stage">
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
            <div className="proc__ticks" aria-hidden="true">
              {c.steps.map((s) => (
                <i key={s.sheet} className="proc__tick" />
              ))}
            </div>
          </div>
          <div className="proc__table">
            {c.steps.map((s) => (
              <div key={s.sheet} className="proc__sheet">
                {sheetFor(s.sheet)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
