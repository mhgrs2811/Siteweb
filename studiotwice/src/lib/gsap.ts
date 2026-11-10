import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";

let registered = false;

/** Enregistre les plugins et la courbe maison une seule fois. */
export function setupGsap() {
  if (registered) return gsap;
  gsap.registerPlugin(ScrollTrigger, CustomEase);
  // Courbe du studio : départ franc, atterrissage très long, jamais de rebond.
  CustomEase.create("studio", "M0,0 C0.62,0 0.18,1 1,1");
  registered = true;
  return gsap;
}

export { gsap, ScrollTrigger };
