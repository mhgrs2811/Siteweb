import { copy } from "@/data/copy";
import { formatAddress, hasAddress, siteConfig } from "@/data/siteConfig";
import { routes } from "@/lib/routes";
import { Button } from "@/components/ui/Button";
import { Pin } from "@/components/ui/Icons";
import { Stamp } from "@/components/ui/Stamp";
import { SectionHead } from "@/components/ui/SectionHead";
import styles from "./Universe.module.css";

/**
 * SECTION 05 — L'UNIVERS GORBUZ
 * Fond charbon. À gauche le propos, à droite une composition graphique de
 * marque (palette, wordmark contour, tampon, rayures) explicitement décorative,
 * qui sera remplacée par les photos réelles du lieu.
 */
export function Universe() {
  const u = copy.home.universe;
  const address = hasAddress(siteConfig) ? siteConfig.address : null;

  return (
    <section className={`${styles.section} theme-dark`} aria-labelledby="univers-title">
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <SectionHead chapter={u.chapter} label={u.label} title={u.h2} id="univers-title" />

          {address && (
            <div className={styles.block} data-reveal>
              <h3 className={`display h3 ${styles.h3}`}>{u.h3Address}</h3>
              <address className={styles.address}>
                <Pin width={18} height={18} />
                <span>{formatAddress(address)}</span>
              </address>
            </div>
          )}

          <div className={styles.block} data-reveal>
            <h3 className={`display h3 ${styles.h3}`}>{u.h3Identity}</h3>
            <div className={`prose ${styles.text}`}>
              {u.text.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <Button href={routes.concept} variant="ghost">
              {u.cta}
            </Button>
          </div>
        </div>

        <div className={styles.board} aria-hidden="true">
          <div className={`${styles.tile} ${styles.tileWord}`} data-reveal="scale">
            <span className={styles.word}>Gorbuz</span>
          </div>
          <div className={`${styles.tile} ${styles.tileRed}`} data-reveal="scale" style={{ ["--reveal-delay" as string]: "80ms" }}>
            <span className={styles.swatchLabel}>Piment</span>
            <span className={styles.swatchHex}>#D94B32</span>
          </div>
          <div className={`${styles.tile} ${styles.tileStripes}`} data-reveal="scale" style={{ ["--reveal-delay" as string]: "140ms" }}>
            <Stamp size={120} tone="ink" />
          </div>
          <div className={`${styles.tile} ${styles.tileBeige}`} data-reveal="scale" style={{ ["--reveal-delay" as string]: "200ms" }}>
            <span className={styles.swatchLabel}>Beige toasté</span>
            <span className={styles.swatchHex}>#D7B58B</span>
          </div>
          <div className={`${styles.tile} ${styles.tileAmber}`} data-reveal="scale" style={{ ["--reveal-delay" as string]: "260ms" }}>
            <span className={styles.swatchLabel}>Ambre</span>
            <span className={styles.swatchHex}>#D49A43</span>
          </div>
          <div className={`${styles.tile} ${styles.tileTicket}`} data-reveal="scale" style={{ ["--reveal-delay" as string]: "320ms" }}>
            <span className={styles.ticketLine} />
            <span className={styles.ticketLine} />
            <span className={styles.ticketLine} />
            <span className={`ticket ticket--dashed ${styles.ticketTag}`}>{copy.provisional.mediaPending}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
