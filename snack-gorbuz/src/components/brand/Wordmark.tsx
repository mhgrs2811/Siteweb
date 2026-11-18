import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { siteConfig } from "@/data/site";
import s from "./Wordmark.module.css";

interface WordmarkProps {
  /** Taille de référence du mot GORBUZ (font-size). */
  size?: string;
  className?: string;
  /** Rend un lien vers l’accueil (header) ou un simple bloc (footer, décor). */
  asLink?: boolean;
  /** Masque la ligne « Snack » (grands formats décoratifs). */
  hideSnack?: boolean;
}

/**
 * Wordmark provisoire Snack Gorbuz, 100 % typographique.
 * Remplacé automatiquement par le logo officiel dès que `siteConfig.brand.logo` est renseigné.
 */
export function Wordmark({ size = "2rem", className, asLink = true, hideSnack }: WordmarkProps) {
  const { brand } = siteConfig;
  const style = { fontSize: size } as CSSProperties;
  const classes = [s.mark, className].filter(Boolean).join(" ");

  const content = brand.logo ? (
    <Image
      src={brand.logo.src}
      alt={brand.logo.alt}
      width={brand.logo.width}
      height={brand.logo.height}
      className={s.logo}
      priority
    />
  ) : (
    <>
      {!hideSnack && (
        <span className={s.snack} aria-hidden="true">
          Snack
        </span>
      )}
      <span className={s.gorbuz} aria-hidden="true">
        Gorbuz
        <span className={s.dot} />
      </span>
      <span className="sr-only">{brand.name}</span>
    </>
  );

  if (asLink) {
    return (
      <Link href="/" className={classes} style={style}>
        {content}
      </Link>
    );
  }
  return (
    <span className={classes} style={style}>
      {content}
    </span>
  );
}
