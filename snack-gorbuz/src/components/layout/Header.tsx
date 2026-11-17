"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { copy } from "@/data/copy";
import { hasAddress, siteConfig } from "@/data/siteConfig";
import { mainNav, routes } from "@/lib/routes";
import { Button } from "@/components/ui/Button";
import { Close, Pin } from "@/components/ui/Icons";
import { Wordmark } from "@/components/ui/Wordmark";
import styles from "./Header.module.css";

/**
 * Header global : transparent sur le hero, compact et plein au scroll.
 * Menu mobile plein écran, accessible (aria-expanded, Échap, retour de focus,
 * verrouillage du scroll). Le CTA « Nous trouver » n'apparaît que si une
 * adresse est configurée.
 */
export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > 24));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  // Verrouillage du scroll + Échap + focus initial.
  useEffect(() => {
    if (!open) {
      document.body.classList.remove("menu-open");
      return;
    }
    document.body.classList.add("menu-open");
    const first = panelRef.current?.querySelector<HTMLElement>("a, button");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab" && panelRef.current) {
        const focusables = Array.from(
          panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
        );
        if (focusables.length === 0) return;
        const firstEl = focusables[0]!;
        const lastEl = focusables[focusables.length - 1]!;
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("menu-open");
    };
  }, [open, close]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const showFind = hasAddress();

  return (
    <header className={[styles.header, scrolled ? styles.scrolled : "", open ? styles.open : ""].filter(Boolean).join(" ")}>
      <a href="#contenu" className="skip-link">
        {copy.nav.skipToContent}
      </a>
      <div className={`container ${styles.bar}`}>
        <Link href={routes.home} className={styles.brand} aria-label={`${siteConfig.name} — ${copy.nav.home}`}>
          <Wordmark size="sm" />
        </Link>

        <nav className={styles.nav} aria-label="Navigation principale">
          <ul className={styles.list}>
            {mainNav
              .filter((item) => item.href !== routes.home)
              .map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={styles.navLink}
                    aria-current={isActive(item.href) ? "page" : undefined}
                  >
                    <span className={styles.navIndex} aria-hidden="true">
                      {item.index}
                    </span>
                    {item.label}
                  </Link>
                </li>
              ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          {showFind && siteConfig.address?.mapsUrl && (
            <a href={siteConfig.address.mapsUrl} className={`${styles.find} link`} target="_blank" rel="noopener noreferrer">
              <Pin width={16} height={16} />
              {copy.nav.ctaFind}
            </a>
          )}
          <Button href={routes.menu} className={styles.cta} icon={false}>
            {copy.nav.ctaMenu}
          </Button>
          <button
            ref={toggleRef}
            type="button"
            className={styles.toggle}
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? copy.nav.closeMenu : copy.nav.openMenu}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={styles.burger} aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      {/* Menu mobile ------------------------------------------------------ */}
      <div
        id={menuId}
        ref={panelRef}
        className={styles.panel}
        aria-hidden={!open}
        inert={!open}
      >
        <div className={`container ${styles.panelInner}`}>
          <div className={styles.panelTop}>
            <Wordmark size="md" />
            <button type="button" className={styles.closeBtn} onClick={close} aria-label={copy.nav.closeMenu}>
              <Close width={28} height={28} />
            </button>
          </div>
          <nav aria-label="Navigation mobile">
            <ul className={styles.panelList}>
              {mainNav.map((item, i) => (
                <li key={item.href} style={{ ["--i" as string]: i }}>
                  <Link
                    href={item.href}
                    className={styles.panelLink}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    onClick={() => setOpen(false)}
                  >
                    <span className={styles.panelIndex} aria-hidden="true">
                      {item.index}
                    </span>
                    <span className="display">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className={styles.panelFoot}>
            <Button href={routes.menu} size="lg" onClick={() => setOpen(false)}>
              {copy.nav.ctaMenu}
            </Button>
            <p className={`${styles.panelNote} muted`}>{siteConfig.baseline}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
