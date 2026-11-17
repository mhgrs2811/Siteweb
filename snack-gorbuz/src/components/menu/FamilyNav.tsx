"use client";

import { useEffect, useState } from "react";
import { copy } from "@/data/copy";
import { families } from "@/data/menuData";
import styles from "./FamilyNav.module.css";

/**
 * Navigation par ancres des familles : collante sous le header, défilement
 * horizontal sur mobile, état actif piloté par IntersectionObserver,
 * utilisable au clavier (liens natifs).
 */
export function FamilyNav() {
  const [active, setActive] = useState<string>(families[0]?.id ?? "");

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const sections = families
      .map((f) => document.getElementById(f.id))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <nav className={styles.nav} aria-label={copy.menu.navLabel}>
      <div className={`container ${styles.inner}`}>
        <ul className={styles.list}>
          {families.map((f) => (
            <li key={f.id}>
              <a
                href={`#${f.id}`}
                className={styles.link}
                aria-current={active === f.id ? "true" : undefined}
                onClick={() => setActive(f.id)}
              >
                <span className={styles.index} aria-hidden="true">
                  {f.index}
                </span>
                {f.name}
                <span className={styles.count} aria-label={`${f.products.length} produits`}>
                  {f.products.length > 0 ? f.products.length : "—"}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
