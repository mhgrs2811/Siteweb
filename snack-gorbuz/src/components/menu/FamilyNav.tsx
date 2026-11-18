"use client";

import { useEffect, useState } from "react";
import type { Family } from "@/data/types";
import s from "./FamilyNav.module.css";

interface FamilyNavProps {
  families: Family[];
  counts: Record<string, number>;
  label: string;
}

/**
 * Navigation par ancres des familles : collante, défilable horizontalement sur mobile,
 * état actif suivi au scroll (IntersectionObserver), utilisable au clavier.
 */
export function FamilyNav({ families, counts, label }: FamilyNavProps) {
  const [active, setActive] = useState<string>(families[0]?.slug ?? "");

  useEffect(() => {
    const sections = families
      .map((f) => document.getElementById(f.slug))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length || !("IntersectionObserver" in window)) return;

    const compute = () => {
      const line = window.innerHeight * 0.4;
      let current = sections[0].id;
      for (const sec of sections) {
        if (sec.getBoundingClientRect().top <= line) current = sec.id;
      }
      setActive(current);
    };
    // La zone observée est réduite à une ligne à 40 % de la hauteur : le callback
    // se déclenche dès qu'une section la franchit, puis on recalcule la section courante.
    const observer = new IntersectionObserver(compute, { rootMargin: "-40% 0px -58% 0px", threshold: 0 });
    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, [families]);

  return (
    <nav className={s.bar} aria-label={label}>
      <div className={`container ${s.inner}`}>
        {families.map((f) => (
          <a
            key={f.slug}
            href={`#${f.slug}`}
            className={[s.link, active === f.slug ? s.active : ""].join(" ")}
            aria-current={active === f.slug ? "true" : undefined}
            onClick={() => setActive(f.slug)}
          >
            {f.name}
            {counts[f.slug] > 0 && <small>{counts[f.slug]}</small>}
          </a>
        ))}
      </div>
    </nav>
  );
}
