"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import { nav } from "@/content";
import { site } from "@/config/site";
import { cn } from "@/lib/cn";
import { ButtonLink } from "@/components/ui/Button";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Masque l’en-tête quand on descend, le réaffiche quand on remonte.
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 24);
        setHidden(y > 160 && y > lastY.current + 4);
        if (y < lastY.current - 4 || y < 160) setHidden(false);
        lastY.current = y;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  // Ferme le menu à chaque navigation (ajustement d’état pendant le rendu).
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(false);
  }

  // Échap pour fermer, verrouillage du défilement, focus piégé.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.classList.add("menu-open");
    const first = menuRef.current?.querySelector<HTMLElement>("a, button");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab" && menuRef.current) {
        const items = Array.from(menuRef.current.querySelectorAll<HTMLElement>("a, button"));
        const all = [toggleRef.current!, ...items];
        const i = all.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && i <= 0) {
          e.preventDefault();
          all[all.length - 1].focus();
        } else if (!e.shiftKey && i === all.length - 1) {
          e.preventDefault();
          all[0].focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      root.classList.remove("menu-open");
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header
        className={cn(
          "site-header fixed inset-x-0 top-0 z-50 transition-[transform,background-color] duration-500 ease-[var(--ease-out-expo)]",
          hidden && !open ? "-translate-y-full" : "translate-y-0",
          scrolled && !open && "is-scrolled",
          open && "is-open",
        )}
      >
        <div className="wrap-wide flex h-[4.5rem] items-center justify-between gap-3 sm:gap-6 md:h-20">
          <Link href="/" className="relative z-10 -my-2 py-2">
            <Logo />
            <span className="sr-only"> — {nav.home}</span>
          </Link>

          <nav aria-label="Navigation principale" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.main.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="roll-host group relative inline-flex h-11 items-center px-4 text-[0.95rem]"
                  >
                    <span className="btn-roll">
                      <span>{item.label}</span>
                      <span aria-hidden="true">{item.label}</span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-nova transition-transform duration-300",
                        isActive(item.href) ? "scale-100" : "scale-0",
                      )}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="relative z-10 flex items-center gap-2">
            <div className="hidden sm:block">
              <ButtonLink href={nav.cta.href} variant="accent" className="header-cta !min-h-11 !text-[0.9rem]">
                {nav.cta.label}
              </ButtonLink>
            </div>
            <Link
              href={nav.cta.href}
              className={cn("btn btn-accent !min-h-11 !px-4 !text-[0.9rem] sm:hidden", open && "invisible")}
            >
              <span className="btn-roll">
                <span>{nav.cta.short}</span>
                <span aria-hidden="true">{nav.cta.short}</span>
              </span>
            </Link>
            <button
              ref={toggleRef}
              type="button"
              className="menu-toggle grid h-11 w-11 place-items-center rounded-full lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? nav.menuClose : nav.menuOpen}
              onClick={() => setOpen((v) => !v)}
            >
              <span aria-hidden="true" className="relative block h-3 w-6">
                <span
                  className={cn(
                    "absolute left-0 top-0 h-[1.5px] w-full bg-current transition-transform duration-500 ease-[var(--ease-out-expo)]",
                    open && "translate-y-[5.25px] rotate-45",
                  )}
                />
                <span
                  className={cn(
                    "absolute bottom-0 left-0 h-[1.5px] w-full bg-current transition-transform duration-500 ease-[var(--ease-out-expo)]",
                    open && "-translate-y-[5.25px] -rotate-45",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!open}
        className="mobile-menu surface-dark fixed inset-0 z-40 flex flex-col overflow-y-auto pt-24 lg:hidden"
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a")) setOpen(false);
        }}
      >
        <nav aria-label="Navigation mobile" className="wrap flex-1">
          <ul className="flex flex-col">
            {[{ label: nav.home, href: "/" }, ...nav.main, { label: "Contact", href: "/contact" }].map((item, i) => (
              <li key={item.href} className="mm-item border-b border-line" style={{ "--i": i } as React.CSSProperties}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="flex min-h-16 items-baseline justify-between py-3 text-[clamp(2.25rem,9vw,3.5rem)] leading-none tracking-[-0.03em]"
                >
                  <span className={i % 2 === 1 ? "t-it" : "font-medium"}>{item.label}</span>
                  <span className="t-label text-muted tabular-nums">0{i + 1}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="wrap mm-item flex flex-col gap-5 pb-10 pt-10" style={{ "--i": 7 } as React.CSSProperties}>
          <a href={`mailto:${site.contact.email}`} className="text-lg link-u self-start">
            {site.contact.email}
          </a>
          {site.contact.phone ? (
            <a href={`tel:${site.contact.phone}`} className="text-lg link-u self-start">
              {site.contact.phoneDisplay}
            </a>
          ) : null}
          <ButtonLink href={nav.cta.href} variant="accent" magnetic={false} className="self-start">
            {nav.cta.label}
          </ButtonLink>
        </div>
      </div>
    </>
  );
}
