import styles from "./Stamp.module.css";

interface StampProps {
  /** Texte en boucle autour du tampon. */
  text?: string;
  /** Texte central court. */
  center?: string;
  size?: number;
  tone?: "red" | "cream" | "ink";
  className?: string;
  /** Rotation lente (désactivée en reduced-motion). */
  spin?: boolean;
}

/**
 * Tampon circulaire GORBUZ : élément de langage graphique réutilisable
 * (hero, section univers, footer, futurs emballages).
 */
export function Stamp({
  text = "Snack Gorbuz · Street-food · Belgique · ",
  center = "GZ",
  size = 120,
  tone = "red",
  className,
  spin = true,
}: StampProps) {
  const id = `stamp-${tone}-${size}`;
  const r = 38;
  return (
    <span
      className={[styles.stamp, styles[tone], spin ? styles.spin : "", className].filter(Boolean).join(" ")}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 100 100" className={styles.svg}>
        <defs>
          <path id={id} d={`M50,50 m-${r},0 a${r},${r} 0 1,1 ${r * 2},0 a${r},${r} 0 1,1 -${r * 2},0`} />
        </defs>
        <circle cx="50" cy="50" r="48" className={styles.ring} />
        <circle cx="50" cy="50" r="28" className={styles.ringInner} />
        <text className={styles.text}>
          <textPath href={`#${id}`} startOffset="0">
            {text.repeat(2)}
          </textPath>
        </text>
      </svg>
      <span className={styles.center}>{center}</span>
    </span>
  );
}
