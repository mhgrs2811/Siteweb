import Link from "next/link";
import { Wordmark } from "@/components/brand/Wordmark";
import { ArrowUpRight, Mail, Phone, Pin } from "@/components/ui/Icons";
import { copy } from "@/data/copy";
import {
  hasAddress,
  hasAnyPractical,
  hasEmail,
  hasHours,
  hasPhone,
  hasSocials,
  siteConfig,
} from "@/data/site";
import { formatAddressLines, hoursRows, telHref } from "@/lib/format";
import s from "./Footer.module.css";

const navLinks = [
  { href: "/", label: copy.nav.home },
  { href: "/carte", label: copy.nav.menu },
  { href: "/concept", label: copy.nav.concept },
  { href: "/galerie", label: copy.nav.gallery },
  { href: "/contact", label: copy.nav.contact },
];

/**
 * Footer global : composition éditoriale (lettrage fantôme, colonnes),
 * n’affiche que les données réellement configurées dans siteConfig.
 */
export function Footer() {
  const year = new Date().getFullYear();
  const { address, phone, email, socials, openingHours } = siteConfig;

  return (
    <footer className={`tone-dark ${s.footer}`}>
      <div className={`ghost ${s.ghostline}`} aria-hidden="true">
        Gorbuz
      </div>

      <div className="container">
        <div className={s.top}>
          <div className={s.brandCol}>
            <Wordmark size="3.2rem" asLink={false} />
            <p className={s.baseline}>{siteConfig.brand.baseline}</p>
            <p className={s.country}>{siteConfig.city ? `${siteConfig.city}, ${siteConfig.country}` : siteConfig.country}</p>
          </div>

          <nav className={s.col} aria-label="Navigation secondaire">
            <p className={s.colTitle}>{copy.footer.navTitle}</p>
            <ul className={s.list}>
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {(hasAddress() || hasPhone() || hasEmail()) && (
            <div className={`${s.col} ${s.colWide}`}>
              <p className={s.colTitle}>{copy.footer.findTitle}</p>
              <ul className={s.list}>
                {address && (
                  <li>
                    {address.mapsUrl ? (
                      <a href={address.mapsUrl} target="_blank" rel="noopener noreferrer">
                        <Pin />
                        <span>{formatAddressLines(address).join(", ")}</span>
                        <ArrowUpRight />
                      </a>
                    ) : (
                      <span>{formatAddressLines(address).join(", ")}</span>
                    )}
                  </li>
                )}
                {phone && (
                  <li>
                    <a href={telHref(phone)}>
                      <Phone />
                      {phone}
                    </a>
                  </li>
                )}
                {email && (
                  <li>
                    <a href={`mailto:${email}`}>
                      <Mail />
                      {email}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}

          {hasHours() && (
            <div className={`${s.col} ${s.colWide}`}>
              <p className={s.colTitle}>{copy.footer.hoursTitle}</p>
              <dl className={s.hours}>
                {hoursRows(openingHours, copy.practical.closed).map((row) => (
                  <div key={row.day} style={{ display: "contents" }}>
                    <dt>{row.day}</dt>
                    <dd className={row.closed ? s.closed : undefined}>{row.value}</dd>
                  </div>
                ))}
              </dl>
              {siteConfig.hoursNote && <p className="small muted">{siteConfig.hoursNote}</p>}
            </div>
          )}

          {hasSocials() && (
            <div className={s.col}>
              <p className={s.colTitle}>{copy.footer.socialTitle}</p>
              <ul className={s.list}>
                {socials.map((so) => (
                  <li key={so.url}>
                    <a href={so.url} target="_blank" rel="noopener noreferrer">
                      {so.label}
                      <ArrowUpRight />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!hasAnyPractical() && <p className={s.soon}>{copy.footer.findSoon}</p>}
        </div>

        <div className={s.bottom}>
          <p>
            © {year} {siteConfig.brand.name}. {copy.footer.rights}
          </p>
          <ul className={s.legalLinks}>
            <li>
              <Link href="/mentions-legales">{copy.footer.legalNotice}</Link>
            </li>
            <li>
              <Link href="/confidentialite">{copy.footer.privacy}</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
