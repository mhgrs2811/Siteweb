import { copy } from "@/data/copy";
import { hasAddress, hasAnyContact, siteConfig } from "@/data/siteConfig";
import { routes } from "@/lib/routes";
import { Button } from "@/components/ui/Button";
import { Stamp } from "@/components/ui/Stamp";
import styles from "./FinalCta.module.css";

/**
 * SECTION 08 — CTA FINAL
 * Bande rouge piment compacte : le seul grand aplat rouge du site, utilisé
 * comme signal d'action. CTA secondaire conditionnel (contact / itinéraire).
 */
export function FinalCta() {
  const f = copy.home.finalCta;
  const route = hasAddress(siteConfig) ? siteConfig.address.mapsUrl : null;

  return (
    <section className={`${styles.section} theme-red`} aria-labelledby="final-title">
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy} data-reveal>
          <p className="label label--index" data-index={f.chapter} style={{ ["--c-red" as string]: "var(--c-cream)" }}>
            Gorbuz
          </p>
          <h2 id="final-title" className={`display ${styles.title}`}>
            {f.h2}
          </h2>
          <p className={styles.text}>{f.text}</p>
        </div>
        <div className={styles.actions} data-reveal="right">
          <Button href={routes.menu} variant="cream" size="lg">
            {f.ctaPrimary}
          </Button>
          {route ? (
            <Button href={route} variant="ghost" size="lg">
              {f.ctaRoute}
            </Button>
          ) : hasAnyContact() ? (
            <Button href={routes.contact} variant="ghost" size="lg">
              {f.ctaSecondary}
            </Button>
          ) : null}
        </div>
        <Stamp size={140} tone="cream" className={styles.stamp} />
      </div>
    </section>
  );
}
