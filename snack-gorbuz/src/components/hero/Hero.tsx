import { copy } from "@/data/copy";
import { siteConfig } from "@/data/siteConfig";
import { routes } from "@/lib/routes";
import { Button } from "@/components/ui/Button";
import { ArrowDown } from "@/components/ui/Icons";
import { Stamp } from "@/components/ui/Stamp";
import { HeroVisual } from "./HeroVisual";
import styles from "./Hero.module.css";

/**
 * SECTION 01 — HERO
 * H1 unique, accroche, deux CTA, scène 3D en vis-à-vis, repères de marque et
 * indication de scroll. Le texte est rendu côté serveur : il s'affiche avant
 * toute 3D.
 */
export function Hero() {
  const h = copy.home.hero;
  return (
    <section className={`${styles.hero} theme-dark`} aria-labelledby="hero-title">
      <div className={styles.bgStripes} aria-hidden="true" />
      <p className={`${styles.side} label`} aria-hidden="true">
        <span className="vertical">
          {siteConfig.name} — {siteConfig.country} — Chapitre {h.chapter}
        </span>
      </p>

      <div className={`container ${styles.inner}`}>
        <div className={styles.text}>
          <p className={`label label--index ${styles.kicker}`} data-index={h.chapter} data-reveal>
            {h.kicker}
          </p>
          <h1 id="hero-title" className={`display h1 ${styles.title}`} data-reveal style={{ ["--reveal-delay" as string]: "80ms" }}>
            La street-food <br className={styles.br} />
            qui a du <span className="accent">caractère.</span>
          </h1>
          <p className={`lead ${styles.lead}`} data-reveal style={{ ["--reveal-delay" as string]: "160ms" }}>
            {h.lead}
          </p>
          <div className={styles.ctas} data-reveal style={{ ["--reveal-delay" as string]: "240ms" }}>
            <Button href={routes.menu} size="lg">
              {h.ctaPrimary}
            </Button>
            <Button href={routes.concept} variant="ghost" size="lg">
              {h.ctaSecondary}
            </Button>
          </div>
        </div>

        <div className={styles.stage} data-reveal="scale" style={{ ["--reveal-delay" as string]: "120ms" }}>
          <HeroVisual />
          <Stamp size={104} className={styles.stamp} />
          <p className={`${styles.caption} muted`}>{h.sceneCaption}</p>
        </div>
      </div>

      <a href="#manifeste" className={styles.scroll}>
        <span className="label">{h.scroll}</span>
        <ArrowDown width={18} height={18} />
      </a>
    </section>
  );
}
