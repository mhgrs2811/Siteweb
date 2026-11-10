"use client";

import { useEffect, useRef, type ElementType } from "react";
import { setupGsap } from "@/lib/gsap";

interface Props {
  as?: ElementType;
  className?: string;
  children: string;
  /** Délai entre les mots, en secondes. */
  stagger?: number;
  id?: string;
}

/**
 * Texte qui monte derrière un masque, mot par mot, à l'entrée dans l'écran.
 * Le texte est rendu côté serveur ; sans JavaScript il reste visible.
 */
export default function Reveal({ as: Tag = "p", className = "", children, stagger = 0.03, id }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const inner = el.querySelectorAll<HTMLElement>(".reveal__in");
    if (reduce) {
      el.classList.add("is-in");
      return;
    }
    const gsap = setupGsap();
    const ctx = gsap.context(() => {
      gsap.to(inner, {
        y: 0,
        duration: 1.05,
        stagger,
        ease: "studio",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
        onComplete: () => el.classList.add("is-in"),
      });
    }, el);
    return () => ctx.revert();
  }, [stagger]);

  const words = children.split(" ");
  return (
    <Tag ref={ref} id={id} className={`reveal ${className}`.trim()}>
      {words.map((w, i) => (
        <span key={i}>
          <span className="reveal__w">
            <span className="reveal__in">{w}</span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}
