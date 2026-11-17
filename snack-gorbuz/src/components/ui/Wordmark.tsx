import Image from "next/image";
import { siteConfig } from "@/data/siteConfig";
import styles from "./Wordmark.module.css";

interface WordmarkProps {
  size?: "sm" | "md" | "lg" | "xl";
  /** Variante monochrome pour fonds clairs. */
  tone?: "cream" | "ink";
  className?: string;
}

/**
 * Wordmark typographique provisoire « SNACK / GORBUZ ».
 * Dès qu'un logo officiel est renseigné dans siteConfig.logo, il remplace
 * automatiquement ce rendu, sans toucher aux composants qui l'utilisent.
 */
export function Wordmark({ size = "md", tone = "cream", className }: WordmarkProps) {
  if (siteConfig.logo) {
    const { src, width, height, alt } = siteConfig.logo;
    return (
      <Image
        src={src}
        width={width}
        height={height}
        alt={alt}
        className={[styles.logo, styles[size], className].filter(Boolean).join(" ")}
        priority
      />
    );
  }

  return (
    <span
      className={[styles.mark, styles[size], styles[tone], className].filter(Boolean).join(" ")}
      aria-label={siteConfig.name}
      role="img"
    >
      <span className={styles.top} aria-hidden="true">
        <span className={styles.snack}>Snack</span>
        <span className={styles.dot} />
      </span>
      <span className={styles.main} aria-hidden="true">
        Gorbuz
      </span>
    </span>
  );
}
