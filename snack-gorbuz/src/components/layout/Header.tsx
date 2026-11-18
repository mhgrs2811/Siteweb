"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Wordmark } from "@/components/brand/Wordmark";
import { copy } from "@/data/copy";
import { headerToneByPath } from "@/data/seo";
import { hasAddress, hasEmail, hasPhone, siteConfig } from "@/data/site";
import { telHref } from "@/lib/format";
import { useBodyLock, useScrolled } from "@/lib/hooks";
import s from "./Header.module.css";

const links = [
  { href: "/", label: copy.nav.home },
  { href: "/carte", label: copy.nav.menu },
  { href: "/concept", label: copy.nav.concept },
  { href: "/galerie", label: copy.nav.gallery },
  { href: "/contact", label: copy.nav.contact },
];

export function Header() {
  const pathname = usePathname();
  const scrolled = useScrolled(32);
  // Le menu mémorise le chemin où il a été ouvert : un changement de route le ferme sans effet.
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const panelId = useId();
  const burgerRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const tone = headerToneByPath[pathname] ?? "dark";

  useBodyLock(open);

  const close = useCallback(() => setOpenPath(null), []);

  // Échap + gestion du focus.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        burgerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => firstLinkRef.current?.focus(), 120);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [open, close]);

  // Fermeture si l’on repasse en desktop.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setOpenPath(null);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const isCurrent = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={[s.header, scrolled ? s.scrolled : "", open ? s.open : ""].filter(Boolean).join(" ")}
      data-tone={tone}
    >
      <div className={`container ${s.inner}`}>
        <Wordmark size="1.9rem" className={s.brand} />

        <nav className={s.nav} aria-label="Navigation principale">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={s.navLink}
              aria-current={isCurrent(l.href) ? "page" : undefined}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className={s.actions}>
          {hasAddress() && siteConfig.address?.mapsUrl && (
            <a
              className={`btn btn-ghost ${s.ctaDesktop}`}
              href={siteConfig.address.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {copy.nav.ctaFind}
            </a>
          )}
          <Link href="/carte" className={`btn btn-primary ${s.ctaDesktop}`}>
            {copy.nav.ctaMenu}
          </Link>
          <button
            ref={burgerRef}
            type="button"
            className={s.burger}
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={open ? copy.nav.closeMenu : copy.nav.openMenu}
            onClick={() => setOpenPath(open ? null : pathname)}
          >
            <span aria-hidden="true">Menu</span>
            <span className={s.burgerIcon} aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      <div id={panelId} className={s.panel} aria-hidden={!open}>
        <nav className={s.panelNav} aria-label="Navigation mobile">
          {links.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              ref={i === 0 ? firstLinkRef : undefined}
              className={s.panelLink}
              style={{ ["--i" as string]: i } as React.CSSProperties}
              aria-current={isCurrent(l.href) ? "page" : undefined}
              onClick={close}
              tabIndex={open ? 0 : -1}
            >
              {l.label}
              <small aria-hidden="true">0{i + 1}</small>
            </Link>
          ))}
        </nav>
        <div className={s.panelFoot}>
          <Link href="/carte" className="btn btn-primary btn-lg" onClick={close} tabIndex={open ? 0 : -1}>
            {copy.nav.ctaMenu}
          </Link>
          {(hasPhone() || hasEmail() || siteConfig.city) && (
            <p className={s.panelMeta}>
              {siteConfig.city && <span>{siteConfig.city}</span>}
              {hasPhone() && siteConfig.phone && (
                <a href={telHref(siteConfig.phone)} tabIndex={open ? 0 : -1}>
                  {siteConfig.phone}
                </a>
              )}
              {hasEmail() && siteConfig.email && (
                <a href={`mailto:${siteConfig.email}`} tabIndex={open ? 0 : -1}>
                  {siteConfig.email}
                </a>
              )}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
