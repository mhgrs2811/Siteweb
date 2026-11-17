import { copy } from "@/data/copy";
import { siteConfig } from "@/data/siteConfig";
import { Marquee } from "@/components/ui/Marquee";
import styles from "./Manifesto.module.css";

/**
 * SECTION 02 — MARQUE / MANIFESTE
 * Fond crème, H2 display XXL à gauche, texte décalé en bas à droite,
 * signature éditoriale en exergue, puis bandeau typographique lent.
 */
export function Manifesto() {
  const m = copy.home.manifesto;
  return (
    <section id="manifeste" className={`${styles.section} theme-light`} aria-labelledby="manifeste-title">
      <div className={`container ${styles.inner}`}>
        <p className={`label label--index ${styles.label}`} data-index={m.chapter} data-reveal>
          {m.label}
        </p>
        <h2 id="manifeste-title" className={`display h2 ${styles.title}`} data-reveal>
          Du caractère, <br />à chaque <span className={styles.outline}>bouchée.</span>
        </h2>
        <div className={`prose ${styles.text}`} data-reveal style={{ ["--reveal-delay" as string]: "120ms" }}>
          {m.text.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <p className={`display ${styles.signature}`} data-reveal="left" style={{ ["--reveal-delay" as string]: "200ms" }}>
          {siteConfig.signature}
        </p>
      </div>
      <Marquee words={m.marquee} tone="dark" speed={56} />
    </section>
  );
}
