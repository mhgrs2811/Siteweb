import type { ReactNode } from "react";
import styles from "./PageIntro.module.css";

interface PageIntroProps {
  chapter: string;
  label: string;
  title: ReactNode;
  lead?: string;
  /** Contenu additionnel aligné à droite (ex. CTA, note). */
  aside?: ReactNode;
  compact?: boolean;
}

/**
 * En-tête de page intérieure : bande charbon, H1 display, chapeau.
 * Permet au header transparent de fonctionner sur toutes les pages.
 */
export function PageIntro({ chapter, label, title, lead, aside, compact }: PageIntroProps) {
  return (
    <section className={[styles.intro, compact ? styles.compact : "", "theme-dark"].filter(Boolean).join(" ")}>
      <div className={styles.stripes} aria-hidden="true" />
      <div className={`container ${styles.inner}`}>
        <p className="label label--index muted" data-index={chapter} data-reveal>
          {label}
        </p>
        <h1 className={`display ${styles.title}`} data-reveal style={{ ["--reveal-delay" as string]: "80ms" }}>
          {title}
        </h1>
        {lead && (
          <p className={`lead ${styles.lead}`} data-reveal style={{ ["--reveal-delay" as string]: "160ms" }}>
            {lead}
          </p>
        )}
        {aside && (
          <div className={styles.aside} data-reveal="right" style={{ ["--reveal-delay" as string]: "200ms" }}>
            {aside}
          </div>
        )}
      </div>
    </section>
  );
}
