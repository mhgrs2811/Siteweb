import Link from "next/link";
import { nav, services } from "@/content";
import { site } from "@/config/site";
import { FooterSignature } from "./FooterSignature";
import { BackToTop } from "./BackToTop";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="surface-dark relative overflow-hidden" data-surface="dark">
      <div className="wrap-wide pt-24 md:pt-32">
        <div className="grid-12 gap-y-12">
          <div className="col-span-4 md:col-span-12 lg:col-span-5">
            <p className="t-h3 max-w-[16ch]">
              Un projet, une question, une <span className="t-it">intuition</span> ?
            </p>
            <a
              href={`mailto:${site.contact.email}`}
              className="link-u mt-8 inline-block text-[clamp(1.25rem,2.4vw,2rem)] tracking-[-0.02em]"
            >
              {site.contact.email}
            </a>
            {site.contact.phone ? (
              <a href={`tel:${site.contact.phone}`} className="link-u mt-3 block w-fit text-lg">
                {site.contact.phoneDisplay}
              </a>
            ) : null}
          </div>

          <nav aria-label="Pied de page" className="col-span-2 md:col-span-4 lg:col-span-2 lg:col-start-7">
            <p className="t-label text-muted mb-5">Navigation</p>
            <ul>
              {[{ label: nav.home, href: "/" }, ...nav.main, { label: "Contact", href: "/contact" }].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="link-u inline-flex min-h-11 items-center">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            <p className="t-label text-muted mb-5">Services</p>
            <ul>
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services#${s.slug}`} className="link-u inline-flex min-h-11 items-center">
                    {s.short}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-4 md:col-span-4 lg:col-span-2">
            <p className="t-label text-muted mb-5">Studio</p>
            <p className="text-muted">
              {site.city}, {site.region}
              <br />
              {site.area}
            </p>
            <p className="t-label text-muted mb-4 mt-8">Réseaux</p>
            <ul className="flex flex-wrap gap-x-5 gap-y-1">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} className="link-u inline-flex min-h-11 items-center" target="_blank" rel="noopener noreferrer">
                    {s.label}
                    <span className="sr-only"> (nouvel onglet)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <FooterSignature />

      <div className="wrap-wide border-t border-line">
        <div className="flex flex-col gap-4 py-6 text-sm text-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.legalName}. Conçu et développé à {site.city}.
          </p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {nav.legal.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="link-u inline-flex min-h-11 items-center">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <BackToTop />
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
