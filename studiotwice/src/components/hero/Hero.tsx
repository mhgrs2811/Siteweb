"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { heroCopy } from "@/content/hero";
import { dayFromProgress, stepFromProgress } from "@/lib/tokens";
import { setupGsap, ScrollTrigger } from "@/lib/gsap";
import Stage from "./Stage";
import Magnetic from "@/components/Magnetic";
import Arrow from "@/components/Arrow";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Hero épinglé : la page d'exemple se construit au défilement, la nuit devient jour,
 * le grand mot en bas nomme l'étape en cours. À l'arrivée, une pointe lumineuse trace
 * les plaques et le croquis se dessine.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const wordBox = useRef<HTMLDivElement>(null);
  const caption = useRef<HTMLParagraphElement>(null);
  const counter = useRef<HTMLElement>(null);
  const stageEl = useRef<HTMLDivElement>(null);
  const seqFill = useRef<HTMLSpanElement>(null);
  const seqList = useRef<HTMLOListElement>(null);
  const hint = useRef<HTMLParagraphElement>(null);
  const progress = useRef(0);
  const intro = useRef(0);

  useEffect(() => {
    const el = root.current;
    const wb = wordBox.current;
    const cap = caption.current;
    const cnt = counter.current;
    if (!el || !wb || !cap || !cnt) return;
    const gsap = setupGsap();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches;
    const docEl = document.documentElement;
    const layer = document.getElementById("daylayer");
    const steps = heroCopy.steps;
    let current = 0;
    let swapping: gsap.core.Timeline | null = null;
    let isDay = false;

    // Le fond glisse par l'opacité d'une couche fixe ; les textes basculent une fois, au milieu.
    const applyColors = (p: number) => {
      const d = dayFromProgress(p);
      if (layer) layer.style.opacity = d.toFixed(3);
      const day = d >= 0.5;
      if (day !== isDay) {
        isDay = day;
        docEl.classList.toggle("is-day", day);
      }
    };

    const setStep = (i: number) => {
      if (i === current) return;
      const dir = i > current ? 1 : -1;
      current = i;
      cnt.textContent = pad(i + 1);
      seqList.current?.querySelectorAll("li").forEach((li, k) => li.classList.toggle("is-on", k === i));
      const all = wb.querySelectorAll<HTMLElement>(".hero__word-text");
      all.forEach((n, k) => {
        if (k < all.length - 1) n.remove();
      });
      const old = all[all.length - 1] ?? null;
      const next = document.createElement("span");
      next.className = "hero__word-text";
      next.textContent = steps[i].word;
      wb.appendChild(next);
      swapping?.kill();
      swapping = gsap.timeline();
      swapping.fromTo(next, { yPercent: 108 * dir }, { yPercent: 0, duration: reduce ? 0 : 0.85, ease: "studio" }, 0);
      if (old) {
        swapping.to(old, { yPercent: -108 * dir, duration: reduce ? 0 : 0.85, ease: "studio", onComplete: () => old.remove() }, 0);
      }
      swapping.to(cap, { opacity: 0, y: -6, duration: reduce ? 0 : 0.22, ease: "power2.in" }, 0);
      swapping.add(() => {
        cap.textContent = steps[i].text;
      });
      swapping.fromTo(cap, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: reduce ? 0 : 0.5, ease: "studio" });
    };

    const apply = (p: number) => {
      progress.current = p;
      applyColors(p);
      setStep(stepFromProgress(p));
      if (seqFill.current) seqFill.current.style.transform = `scaleX(${p.toFixed(4)})`;
      hint.current?.classList.toggle("is-hidden", p > 0.04);
    };

    const proxy = { p: 0 };
    const ctx = gsap.context(() => {
      if (!reduce) {
        // Arrivée, moins de deux secondes : la pointe trace les plaques, le croquis se dessine,
        // puis la phrase, le bouton, la séquence et le grand mot.
        const introObj = { v: 0 };
        const visiblePens = Array.from(el.querySelectorAll<SVGGElement>(".bp__pen")).filter((g) => g.getClientRects().length > 0);
        const tl = gsap.timeline({ defaults: { ease: "studio" }, delay: 0.05 });
        tl.to(introObj, {
          v: 1,
          duration: 1.7,
          onUpdate: () => {
            intro.current = introObj.v;
          },
        }, 0)
          .to(".hero__stage", { opacity: 1, duration: 0.5 }, 0)
          .fromTo(".bp__outline", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.05, ease: "power1.inOut" }, 0.05)
          .fromTo(".bp__line", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.7, stagger: 0.03 }, 0.35)
          .fromTo(".bp__labels text", { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.04 }, 0.95)
          .to(".hero__top", { opacity: 1, duration: 0.8 }, 0.25)
          .to(".hero__h1 .w__in", { y: 0, duration: 1.0, stagger: 0.03 }, 0.4)
          .to(".hero__sub", { opacity: 1, duration: 0.8 }, 0.85)
          .to(".hero__cta", { opacity: 1, duration: 0.8 }, 1.0)
          .to(".hero__seq", { opacity: 1, duration: 0.8 }, 1.1)
          .to(".hero__word-text", { y: 0, duration: 1.1 }, 0.75)
          .to(".hero__caption", { opacity: 1, duration: 0.8 }, 1.15)
          .to(".hero__hint", { opacity: 1, duration: 0.8 }, 1.6);
        tl.add(() => el.querySelectorAll(".bp").forEach((n) => n.classList.add("is-drawn")), 1.75);
        for (const pen of visiblePens) {
          const variant = pen.classList.contains("bp__pen--desk") ? "desk" : "phone";
          const path = el.querySelector<SVGPathElement>(`.bp__outline--${variant}`);
          if (!path) continue;
          tl.set(pen, { opacity: 1 }, 0.05)
            .to(pen, { motionPath: { path, align: path, alignOrigin: [0.5, 0.5] }, duration: 1.05, ease: "power1.inOut" }, 0.05)
            .to(pen, { opacity: 0, duration: 0.35 }, 1.05);
        }
      } else {
        intro.current = 1;
        gsap.set([".hero__top", ".hero__sub", ".hero__cta", ".hero__stage", ".hero__caption", ".hero__seq"], { opacity: 1 });
        gsap.set([".hero__h1 .w__in", ".hero__word-text"], { y: 0 });
        gsap.set(".bp__pen", { opacity: 0 });
        el.querySelectorAll(".bp").forEach((n) => n.classList.add("is-drawn"));
      }
      el.classList.remove("hero--boot");

      if (reduce) {
        // Pas de séquence : état final immédiat.
        apply(1);
        return;
      }

      if (desktop) {
        gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "+=420%",
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        }).to(proxy, { p: 1, ease: "none", duration: 1, onUpdate: () => apply(proxy.p) });
      } else {
        // Mobile : séquence courte jouée une fois quand la scène est visible, rien d'épinglé.
        const play = gsap.to(proxy, { p: 1, duration: 7.5, ease: "power1.inOut", paused: true, onUpdate: () => apply(proxy.p) });
        const io = new IntersectionObserver(
          ([en]) => {
            if (en.isIntersecting) {
              gsap.delayedCall(2.0, () => play.play());
              io.disconnect();
            }
          },
          { threshold: 0.4 },
        );
        io.observe(stageEl.current ?? el);
        // Si le hero est déjà passé (lien direct vers une ancre, défilement rapide), on termine tout de suite.
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

    applyColors(0);
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh).catch(() => undefined);

    return () => {
      ctx.revert();
      swapping?.kill();
      docEl.classList.remove("is-day");
    };
  }, []);

  const words = heroCopy.statement.split(" ");

  return (
    <section ref={root} className="hero hero--boot" aria-labelledby="hero-title">
      <noscript>
        <style>{`.hero--boot *{opacity:1!important;transform:none!important}.bp__pen{display:none}`}</style>
      </noscript>
      <header className="hero__top">
        <Link className="wordmark" href="/" aria-label="StudioTwice, accueil">
          StudioTwice
        </Link>
        <div className="hero__counter t-caption" aria-hidden="true">
          <b ref={counter}>01</b>
          <span className="hero__counter-sep" />
          <span>{pad(heroCopy.steps.length)}</span>
        </div>
      </header>

      <div className="hero__statement">
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
            <a className="btn" href={heroCopy.cta.href} data-cursor>
              {heroCopy.cta.label}
              <Arrow />
            </a>
          </Magnetic>
        </div>
        {/* La séquence de construction : six mots, un trait qui avance avec le défilement. */}
        <div className="hero__seq" aria-hidden="true">
          <span className="hero__seq-track">
            <span ref={seqFill} className="hero__seq-fill" />
          </span>
          <ol ref={seqList} className="hero__seq-list">
            {heroCopy.steps.map((s, i) => (
              <li key={s.word} className={i === 0 ? "is-on" : undefined}>
                {s.word}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="hero__stage" ref={stageEl}>
        <Stage progress={progress} intro={intro} />
      </div>

      <div className="hero__step">
        <p ref={caption} className="hero__caption">
          {heroCopy.steps[0].text}
        </p>
        <div ref={wordBox} className="hero__word t-display" aria-live="polite" aria-atomic="true">
          <span className="hero__word-text">{heroCopy.steps[0].word}</span>
        </div>
      </div>

      <p ref={hint} className="hero__hint t-caption" aria-hidden="true">
        <span>{heroCopy.hint}</span>
        <i className="hero__hint-line" />
      </p>
    </section>
  );
}
