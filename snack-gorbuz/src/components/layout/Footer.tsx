import Link from "next/link";
import { copy } from "@/data/copy";
import {
  formatAddress,
  hasAddress,
  hasAnyContact,
  hasEmail,
  hasHours,
  hasPhone,
  hasSocials,
  siteConfig,
  telHref,
} from "@/data/siteConfig";
import { mainNav, routes } from "@/lib/routes";
import { Facebook, Globe, Instagram, Pin, TikTok, ArrowUpRight } from "@/components/ui/Icons";
import { OpeningHours } from "@/components/practical/OpeningHours";
import { Stamp } from "@/components/ui/Stamp";
import { Wordmark } from "@/components/ui/Wordmark";
import styles from "./Footer.module.css";

const socialIcon = {
  instagram: Instagram,
  facebook: Facebook,
  tiktok: TikTok,
  google: Globe,
  other: Globe,
} as const;

/**
 * Footer global éditorial : wordmark XXL, colonnes conditionnelles
 * (nous trouver / horaires / contact / réseaux), navigation, légal.
 * Les blocs ne s'affichent que si leurs données sont configurées.
 */
export function Footer() {
  const year = new Date().getFullYear();
  const showPractical = hasAnyContact();

  return (
    <footer className={`${styles.footer} theme-dark`}>
      <div className={styles.giant} aria-hidden="true">
        <span>Gorbuz</span>
      </div>

      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <Wordmark size="lg" />
          <p className={styles.baseline}>{siteConfig.baseline}</p>
          <Stamp size={96} tone="cream" className={styles.stamp} />
        </div>

        <nav className={styles.col} aria-label="Navigation pied de page">
          <h2 className={`label ${styles.colTitle}`}>{copy.footer.navTitle}</h2>
          <ul className={styles.navList}>
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={styles.navLink}>
                  <span className={styles.navIndex} aria-hidden="true">
                    {item.index}
                  </span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {showPractical ? (
          <>
            {hasAddress(siteConfig) && (
              <div className={styles.col}>
                <h2 className={`label ${styles.colTitle}`}>{copy.footer.findTitle}</h2>
                <address className={styles.address}>
                  <Pin width={18} height={18} />
                  <span>{formatAddress(siteConfig.address)}</span>
                </address>
                {siteConfig.address.mapsUrl && (
                  <a href={siteConfig.address.mapsUrl} className="link" target="_blank" rel="noopener noreferrer">
                    {copy.footer.routeCta}
                    <ArrowUpRight />
                  </a>
                )}
              </div>
            )}
            {hasHours() && (
              <div className={styles.col}>
                <h2 className={`label ${styles.colTitle}`}>{copy.footer.hoursTitle}</h2>
                <OpeningHours compact />
              </div>
            )}
            {(hasPhone() || hasEmail()) && (
              <div className={styles.col}>
                <h2 className={`label ${styles.colTitle}`}>{copy.footer.contactTitle}</h2>
                <ul className={styles.contactList}>
                  {siteConfig.phone && (
                    <li>
                      <a href={telHref(siteConfig.phone)} className={styles.contactLink}>
                        {siteConfig.phone}
                      </a>
                    </li>
                  )}
                  {siteConfig.email && (
                    <li>
                      <a href={`mailto:${siteConfig.email}`} className={styles.contactLink}>
                        {siteConfig.email}
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </>
        ) : (
          <div className={`${styles.col} ${styles.pending}`}>
            <h2 className={`label ${styles.colTitle}`}>{copy.footer.findTitle}</h2>
            <p className={styles.pendingText}>{copy.footer.pending}</p>
            <Link href={routes.contact} className="link">
              {copy.nav.contact}
              <ArrowUpRight />
            </Link>
          </div>
        )}

        {hasSocials() && (
          <div className={styles.col}>
            <h2 className={`label ${styles.colTitle}`}>{copy.footer.socialTitle}</h2>
            <ul className={styles.socialList}>
              {siteConfig.socials.map((s) => {
                const Icon = socialIcon[s.network];
                return (
                  <li key={s.url}>
                    <a href={s.url} className={styles.socialLink} target="_blank" rel="noopener noreferrer">
                      <Icon width={20} height={20} />
                      <span>{s.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      <div className={`container ${styles.bottom}`}>
        <p className={styles.copyright}>
          © {year} {siteConfig.name}. {copy.footer.rights}
        </p>
        <ul className={styles.legalList}>
          <li>
            <Link href={routes.legal} className={styles.legalLink}>
              {copy.footer.legal}
            </Link>
          </li>
          <li>
            <Link href={routes.privacy} className={styles.legalLink}>
              {copy.footer.privacy}
            </Link>
          </li>
        </ul>
        <p className={styles.version}>{copy.footer.madeNote}</p>
      </div>
    </footer>
  );
}
