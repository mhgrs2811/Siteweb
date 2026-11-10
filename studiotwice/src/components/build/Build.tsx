"use client";

import { useEffect, useRef } from "react";
import { heroCopy } from "@/content/hero";
import { setupGsap, ScrollTrigger } from "@/lib/gsap";
import Stage from "@/components/hero/Stage";
import { makeStepper } from "@/components/hero/useStepper";
import Reveal from "@/components/Reveal";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Section 01, épinglée : la page d'un commerce se construit au défilement, du croquis
 * à la mise en ligne. Texte à gauche, scène à droite. Sur mobile, la séquence se joue
 * d'elle-même quand la scène entre dans l'écran.
 */
export default function Build() {
  const root = useRef<HTMLElement>(null);
  const stageEl = useRef<HTMLDivElement>(null);
  const stepName = useRef<HTMLParagraphElement>(null);
  const caption = useRef<HTMLParagraphElement>(null);
  const counter = useRef<HTMLElement>(null);
  const seqFill = useRef<HTMLSpanElement>(null);
  const seqList = useRef<HTMLOListElement>(null);
  const progress = useRef(0);
  const intro = useRef(1);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const gsap = setupGsap();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches;
    const stepper = makeStepper(
      { name: stepName.current, caption: caption.current, counter: counter.current, fill: seqFill.current, list: seqList.current },
      gsap,
      reduce,
    );
    const proxy = { p: 0 };
    const apply = (p: number, instant = false) => {
      progress.current = p;
      stepper.apply(p, instant);
    };
    apply(0, true);

    const ctx = gsap.context(() => {
      if (reduce) {
        apply(1, true);
        return;
      }
      if (desktop) {
        gsap.timeline({
          scrollTrigger: {
            trigger: el.querySelector(".build__stage"),
            start: "top top",
            end: "+=380%",
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
          },
        }).to(proxy, { p: 1, ease: "none", duration: 1, onUpdate: () => apply(proxy.p) });
      } else {
        const play = gsap.to(proxy, { p: 1, duration: 7.5, ease: "power1.inOut", paused: true, onUpdate: () => apply(proxy.p) });
        const io = new IntersectionObserver(
          ([en]) => {
            if (en.isIntersecting) {
              gsap.delayedCall(0.6, () => play.play());
              io.disconnect();
            }
          },
          { threshold: 0.35 },
        );
        io.observe(stageEl.current ?? el);
        const done = new IntersectionObserver(
          ([en]) => {
            if (!en.isIntersecting && en.boundingClientRect.bottom < 0) {
              play.progress(1);
              io.disconnect();
              done.disconnect();
            }
          },
          { threshold: 0 },
        );
        done.observe(el);
      }
    }, el);

    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh).catch(() => undefined);
    return () => {
      ctx.revert();
      stepper.kill();
    };
  }, []);

  return (
    <section id="construction" ref={root} className="build" aria-labelledby="build-title">
      <div className="section build__head">
        <div className="section__head">
          <span className="section__num t-caption">01</span>
          <Reveal as="h2" id="build-title" className="t-display section__title">
            Du croquis à la mise en ligne.
          </Reveal>
        </div>
        <Reveal className="section__lead">
          Voici comment le site d’un commerce prend forme chez nous, étape par étape. Défilez, il se construit sous vos yeux.
        </Reveal>
      </div>

      <div className="build__stage">
        <canvas className="scene-ribbon build__ribbon" aria-hidden="true" />
        <div className="build__inner">
          <div className="build__left">
            <p className="build__idx t-caption" aria-hidden="true">
              <b ref={counter}>01</b>
              <span className="build__idx-sep" />
              <span>{pad(heroCopy.steps.length)}</span>
            </p>
            <div className="build__step" aria-live="polite" aria-atomic="true">
              <p ref={stepName} className="build__name t-display">
                {heroCopy.steps[0].word}
              </p>
              <p ref={caption} className="build__text">
                {heroCopy.steps[0].text}
              </p>
            </div>
            <div className="seq build__seq" aria-hidden="true">
              <span className="seq__track">
                <span ref={seqFill} className="seq__fill" />
              </span>
              <ol ref={seqList} className="seq__list">
                {heroCopy.steps.map((s, i) => (
                  <li key={s.word} className={i === 0 ? "is-on" : undefined}>
                    {s.word}
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <div className="build__scene" ref={stageEl}>
            <Stage progress={progress} intro={intro} sketch />
          </div>
        </div>
      </div>
    </section>
  );
}
