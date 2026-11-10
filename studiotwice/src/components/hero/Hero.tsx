"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { heroCopy } from "@/content/hero";
import { setupGsap, ScrollTrigger } from "@/lib/gsap";
import { HERO_MODE } from "@/lib/heroMode";
import Stage from "./Stage";
import { makeStepper } from "./useStepper";
import Magnetic from "@/components/Magnetic";
import Arrow from "@/components/Arrow";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Hero en plein jour : une carte en verre porte la phrase et le bouton, deux plaques
 * flottent de part et d'autre. Rien d'épinglé.
 *   calm : les plaques montrent le site fini, elles respirent, la construction vit plus bas.
 *   loop : les plaques passent du croquis au site fini en boucle lente, d'elles-mêmes.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const stepName = useRef<HTMLParagraphElement>(null);
  const caption = useRef<HTMLParagraphElement>(null);
  const counter = useRef<HTMLElement>(null);
  const seqFill = useRef<HTMLSpanElement>(null);
  const seqList = useRef<HTMLOListElement>(null);
  const progress = useRef(HERO_MODE === "calm" ? 1 : 0);
  const intro = useRef(0);
  const loop = HERO_MODE === "loop";

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const gsap = setupGsap();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stepper = makeStepper(
      { name: stepName.current, caption: caption.current, counter: counter.current, fill: seqFill.current, list: seqList.current },
      gsap,
      reduce,
    );
    const proxy = { p: progress.current };
    const apply = (p: number, instant = false) => {
      progress.current = p;
      if (loop) stepper.apply(p, instant);
    };

    const ctx = gsap.context(() => {
      if (!reduce) {
        // Arrivée en une seconde : la scène et la carte se posent, puis les textes.
        const introObj = { v: 0 };
        const tl = gsap.timeline({ defaults: { ease: "studio" }, delay: 0.05 });
        tl.to(introObj, { v: 1, duration: 1.4, onUpdate: () => void (intro.current = introObj.v) }, 0)
          .to(".hero__stage", { opacity: 1, duration: 0.9 }, 0)
          .to(".hero__volumes", { opacity: 1, duration: 1.2 }, 0.1)
          .fromTo(".hero__card", { opacity: 0, y: 26, scale: 0.985 }, { opacity: 1, y: 0, scale: 1, duration: 1.0 }, 0.15)
          .to(".hero__top", { opacity: 1, duration: 0.8 }, 0.25)
          .to(".hero__h1 .w__in", { y: 0, duration: 0.95, stagger: 0.03 }, 0.3)
          .to(".hero__sub", { opacity: 1, duration: 0.8 }, 0.7)
          .to(".hero__cta", { opacity: 1, duration: 0.8 }, 0.85);
        if (loop) tl.to([".hero__seq", ".hero__step-name", ".hero__caption"], { opacity: 1, duration: 0.8 }, 0.95);
      } else {
        intro.current = 1;
        gsap.set([".hero__top", ".hero__card", ".hero__volumes", ".hero__sub", ".hero__cta", ".hero__stage"], { opacity: 1 });
        if (loop) gsap.set([".hero__caption", ".hero__step-name", ".hero__seq"], { opacity: 1 });
        gsap.set(".hero__h1 .w__in", { y: 0 });
      }
      el.classList.remove("hero--boot");

      if (!loop) {
        apply(1, true);
        return;
      }
      if (reduce) {
        apply(1, true);
        return;
      }
      apply(0, true);
      // La boucle : construction lente, temps de lecture, retour au croquis, et on recommence.
      gsap
        .timeline({ repeat: -1, delay: 1.6 })
        .to(proxy, { p: 1, duration: 15, ease: "none", onUpdate: () => apply(proxy.p) })
        .to({}, { duration: 4 })
        .to(proxy, { p: 0, duration: 2.6, ease: "power2.inOut", onUpdate: () => apply(proxy.p) })
        .to({}, { duration: 1.2 });
    }, el);

    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh).catch(() => undefined);

    return () => {
      ctx.revert();
      stepper.kill();
    };
  }, [loop]);

  const words = heroCopy.statement.split(" ");

  return (
    <section ref={root} className={`hero hero--boot hero--${HERO_MODE}`} aria-labelledby="hero-title">
      <noscript>
        <style>{`.hero--boot *{opacity:1!important;transform:none!important}`}</style>
      </noscript>
      <header className="hero__top">
        <Link className="wordmark" href="/" aria-label="StudioTwice, accueil">
          StudioTwice
        </Link>
        {loop && (
          <div className="hero__counter t-caption" aria-hidden="true">
            <b ref={counter}>01</b>
            <span className="hero__counter-sep" />
            <span>{pad(heroCopy.steps.length)}</span>
          </div>
        )}
      </header>

      {/* Volumes doux posés au sol, derrière la scène. */}
      <div className="hero__volumes" aria-hidden="true">
        <i className="hero__floor" />
        <i className="hero__orb hero__orb--l" />
        <i className="hero__ring" />
        <i className="hero__stone" />
        <i className="hero__orb hero__orb--r" />
      </div>

      {/* Le filet traverse tout le hero, derrière la carte. */}
      <canvas className="scene-ribbon hero__ribbon" aria-hidden="true" />

      <div className="hero__stage">
        <Stage progress={progress} intro={intro} sketch={loop} />
      </div>

      <div className="hero__card">
        <h1 id="hero-title" className="hero__h1 t-display">
          {words.map((w, i) => (
            <span key={i}>
              <span className="w">
                <span className="w__in">{w}</span>
              </span>
              {i < words.length - 1 ? " " : ""}
            </span>
          ))}
        </h1>
        <p className="hero__sub">{heroCopy.sub}</p>
        <div className="hero__cta">
          <Magnetic>
            <a className="btn btn--accent" href={heroCopy.cta.href} data-cursor>
              {heroCopy.cta.label}
              <Arrow />
            </a>
          </Magnetic>
        </div>
      </div>

      {loop && (
        <>
          <div className="seq hero__seq" aria-hidden="true">
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
          <div className="hero__step" aria-live="polite" aria-atomic="true">
            <p ref={stepName} className="hero__step-name t-display">
              {heroCopy.steps[0].word}
            </p>
            <p ref={caption} className="hero__caption">
              {heroCopy.steps[0].text}
            </p>
          </div>
        </>
      )}
    </section>
  );
}
