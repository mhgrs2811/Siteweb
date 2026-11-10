"use client";

import type { gsap as Gsap } from "gsap";
import { heroCopy } from "@/content/hero";
import { stepFromProgress } from "@/lib/tokens";

const pad = (n: number) => String(n).padStart(2, "0");

export interface StepperRefs {
  name: HTMLElement | null;
  caption: HTMLElement | null;
  counter: HTMLElement | null;
  fill: HTMLElement | null;
  list: HTMLElement | null;
}

/**
 * Fait suivre les repères d'étape (nom, légende, compteur, barre) à une progression 0 → 1.
 * Partagé par le hero en boucle et par la section de construction.
 */
export function makeStepper(refs: StepperRefs, gsap: typeof Gsap, reduce: boolean) {
  const steps = heroCopy.steps;
  let current = -1;
  let swapping: ReturnType<typeof gsap.timeline> | null = null;

  const setStep = (i: number, instant = false) => {
    if (i === current) return;
    const dir = i > current ? 1 : -1;
    current = i;
    if (refs.counter) refs.counter.textContent = pad(i + 1);
    refs.list?.querySelectorAll("li").forEach((li, k) => li.classList.toggle("is-on", k === i));
    const targets = [refs.name, refs.caption].filter(Boolean) as HTMLElement[];
    if (!targets.length) return;
    swapping?.kill();
    if (instant || reduce) {
      if (refs.name) refs.name.textContent = steps[i].word;
      if (refs.caption) refs.caption.textContent = steps[i].text;
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }
    swapping = gsap.timeline();
    swapping.to(targets, { opacity: 0, y: -6 * dir, duration: 0.22, ease: "power2.in", stagger: 0.03 }, 0);
    swapping.add(() => {
      if (refs.name) refs.name.textContent = steps[i].word;
      if (refs.caption) refs.caption.textContent = steps[i].text;
    });
    swapping.fromTo(targets, { opacity: 0, y: 8 * dir }, { opacity: 1, y: 0, duration: 0.5, ease: "studio", stagger: 0.05 });
  };

  const apply = (p: number, instant = false) => {
    setStep(stepFromProgress(p), instant);
    if (refs.fill) refs.fill.style.transform = `scaleX(${p.toFixed(4)})`;
  };

  return { apply, kill: () => swapping?.kill() };
}
