import styles from "./Marquee.module.css";

interface MarqueeProps {
  words: readonly string[];
  /** Durée d'un cycle complet en secondes (lent par défaut). */
  speed?: number;
  tone?: "dark" | "light" | "red";
  className?: string;
}

/**
 * Bandeau typographique lent. Le contenu est dupliqué pour la boucle ; la copie
 * est masquée aux lecteurs d'écran. L'animation est désactivée en reduced-motion
 * et mise en pause au survol.
 */
export function Marquee({ words, speed = 48, tone = "dark", className }: MarqueeProps) {
  const row = (hidden: boolean) => (
    <ul className={styles.row} aria-hidden={hidden || undefined}>
      {words.map((w, i) => (
        <li key={`${w}-${i}`} className={styles.item}>
          <span className={styles.word}>{w}</span>
          <span className={styles.sep} aria-hidden="true" />
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className={[styles.marquee, styles[tone], className].filter(Boolean).join(" ")}
      style={{ ["--marquee-speed" as string]: `${speed}s` }}
      role="presentation"
    >
      <div className={styles.track}>
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
