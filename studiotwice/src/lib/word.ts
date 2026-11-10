import type { gsap as Gsap } from "gsap";

/**
 * Remplace le grand mot d'une bande : l'ancien sort par le haut ou le bas,
 * le nouveau entre par l'autre côté, derrière le masque de la bande.
 */
export function swapWord(
  box: HTMLElement,
  textClass: string,
  text: string,
  dir: 1 | -1,
  gsap: typeof Gsap,
  instant = false,
) {
  const all = box.querySelectorAll<HTMLElement>(`.${textClass}`);
  all.forEach((n, k) => {
    if (k < all.length - 1) n.remove();
  });
  const old = all[all.length - 1] ?? null;
  const next = document.createElement("span");
  next.className = textClass;
  next.textContent = text;
  box.appendChild(next);
  const d = instant ? 0 : 0.85;
  gsap.fromTo(next, { yPercent: 108 * dir }, { yPercent: 0, duration: d, ease: "studio" });
  if (old) gsap.to(old, { yPercent: -108 * dir, duration: d, ease: "studio", onComplete: () => old.remove() });
}
