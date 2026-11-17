import { copy } from "@/data/copy";
import {
  formatAddress,
  hasAddress,
  hasEmail,
  hasHours,
  hasPhone,
  siteConfig,
  telHref,
} from "@/data/siteConfig";
import { Button } from "@/components/ui/Button";
import { Clock, Mail, Phone, Pin } from "@/components/ui/Icons";
import { OpeningHours } from "./OpeningHours";
import styles from "./PracticalBlocks.module.css";

interface PracticalBlocksProps {
  /** Titres H3 personnalisés (accueil vs page contact). */
  headings: { address: string; hours: string; contact: string };
  /** Affiche la carte interactive (page contact) si l'adresse et l'embed existent. */
  withMap?: boolean;
}

/**
 * Trois blocs conditionnels : adresse / horaires / contact.
 * Chaque bloc n'affiche que des valeurs réellement configurées ; sinon un état
 * provisoire sobre, intentionnel, sans lien vide ni donnée inventée.
 */
export function PracticalBlocks({ headings, withMap }: PracticalBlocksProps) {
  const c = copy.contact;
  const address = hasAddress(siteConfig) ? siteConfig.address : null;
  const showMap = withMap && address?.mapEmbedUrl;

  return (
    <div className={styles.wrap}>
      <div className={styles.grid}>
        {/* Adresse ------------------------------------------------------ */}
        <div className={`${styles.block} ${styles.blockAddress}`} data-reveal>
          <div className={styles.blockHead}>
            <Pin width={22} height={22} />
            <h3 className={`display h3 ${styles.h3}`}>{headings.address}</h3>
          </div>
          {address ? (
            <>
              <address className={styles.value}>{formatAddress(address)}</address>
              {address.mapsUrl && (
                <Button href={address.mapsUrl} variant="ghost">
                  {c.routeCta}
                </Button>
              )}
            </>
          ) : (
            <Pending text={c.pendingAddress} />
          )}
        </div>

        {/* Horaires ----------------------------------------------------- */}
        <div className={`${styles.block} ${styles.blockHours}`} data-reveal style={{ ["--reveal-delay" as string]: "80ms" }}>
          <div className={styles.blockHead}>
            <Clock width={22} height={22} />
            <h3 className={`display h3 ${styles.h3}`}>{headings.hours}</h3>
          </div>
          {hasHours() ? <OpeningHours /> : <Pending text={c.pendingHours} />}
        </div>

        {/* Contact ------------------------------------------------------ */}
        <div className={`${styles.block} ${styles.blockContact}`} data-reveal style={{ ["--reveal-delay" as string]: "160ms" }}>
          <div className={styles.blockHead}>
            <Phone width={22} height={22} />
            <h3 className={`display h3 ${styles.h3}`}>{headings.contact}</h3>
          </div>
          {hasPhone() || hasEmail() ? (
            <ul className={styles.contactList}>
              {siteConfig.phone && (
                <li>
                  <a href={telHref(siteConfig.phone)} className={styles.contactLink}>
                    <Phone width={18} height={18} />
                    <span>{siteConfig.phone}</span>
                  </a>
                </li>
              )}
              {siteConfig.email && (
                <li>
                  <a href={`mailto:${siteConfig.email}`} className={styles.contactLink}>
                    <Mail width={18} height={18} />
                    <span>{siteConfig.email}</span>
                  </a>
                </li>
              )}
            </ul>
          ) : (
            <Pending text={c.pendingContact} />
          )}
        </div>
      </div>

      {withMap && (
        <div className={styles.map} data-reveal="scale">
          {showMap ? (
            <iframe
              src={address.mapEmbedUrl ?? undefined}
              title={`Carte — ${siteConfig.name}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className={styles.iframe}
            />
          ) : (
            <div className={`${styles.mapPending} stripes`} role="img" aria-label={c.mapPending}>
              <Pin width={40} height={40} strokeWidth={1.25} />
              <span className="ticket ticket--dashed">{c.mapPending}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Pending({ text }: { text: string }) {
  return (
    <div className={styles.pending}>
      <span className="ticket ticket--dashed">{copy.provisional.infoPending}</span>
      <p className={styles.pendingText}>{text}</p>
    </div>
  );
}
