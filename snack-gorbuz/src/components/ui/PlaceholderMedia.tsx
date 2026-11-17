import Image from "next/image";
import type { ReactNode } from "react";
import { copy } from "@/data/copy";
import type { MediaRatio } from "@/data/galleryData";
import { Image as ImageIcon } from "./Icons";
import styles from "./PlaceholderMedia.module.css";

export interface MediaSource {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface PlaceholderMediaProps {
  /** Média réel ; null = bloc graphique provisoire. */
  media?: MediaSource | null;
  ratio?: MediaRatio;
  /** Nom de fichier attendu, affiché discrètement pour guider l'intégration. */
  file?: string;
  /** Légende courte du bloc (ex. « Durum signature »). */
  title?: string;
  /** Variante graphique du placeholder, pour varier les blocs vides. */
  variant?: "stripes" | "dots" | "solid" | "beige" | "red";
  /** Glyphe ou contenu décoratif centré. */
  glyph?: ReactNode;
  priority?: boolean;
  sizes?: string;
  className?: string;
  rounded?: boolean;
}

const ratioMap: Record<MediaRatio, string> = {
  "1:1": "1 / 1",
  "4:5": "4 / 5",
  "3:4": "3 / 4",
  "4:3": "4 / 3",
  "3:2": "3 / 2",
  "16:9": "16 / 9",
  "21:9": "21 / 9",
};

/**
 * Zone média remplaçable. Avec un `media` fourni, rend une <Image> Next
 * optimisée (lazy par défaut). Sans média, rend une composition graphique
 * provisoire volontairement sobre, étiquetée « Visuel à venir » et portant
 * le nom du fichier attendu — jamais une image cassée ni une photo stock.
 */
export function PlaceholderMedia({
  media = null,
  ratio = "4:3",
  file,
  title,
  variant = "stripes",
  glyph,
  priority,
  sizes = "(max-width: 768px) 100vw, 50vw",
  className,
  rounded = true,
}: PlaceholderMediaProps) {
  const style = { aspectRatio: ratioMap[ratio] };

  if (media) {
    return (
      <figure className={[styles.media, rounded ? styles.rounded : "", className].filter(Boolean).join(" ")} style={style}>
        <Image
          src={media.src}
          alt={media.alt}
          width={media.width}
          height={media.height}
          sizes={sizes}
          priority={priority}
          className={styles.img}
        />
        {title && <figcaption className={styles.caption}>{title}</figcaption>}
      </figure>
    );
  }

  return (
    <div
      className={[styles.media, styles.placeholder, styles[variant], rounded ? styles.rounded : "", className]
        .filter(Boolean)
        .join(" ")}
      style={style}
      role="img"
      aria-label={title ? `${title} — ${copy.provisional.mediaPending}` : copy.provisional.mediaPending}
    >
      <span className={styles.corner} aria-hidden="true" />
      <span className={`${styles.corner} ${styles.cornerBr}`} aria-hidden="true" />
      <div className={styles.glyph} aria-hidden="true">
        {glyph ?? <ImageIcon width={32} height={32} strokeWidth={1.25} />}
      </div>
      <div className={styles.meta} aria-hidden="true">
        <span className="ticket ticket--dashed">{copy.provisional.mediaPending}</span>
        {file && <span className={styles.file}>{file}</span>}
      </div>
      {title && (
        <span className={styles.title} aria-hidden="true">
          {title}
        </span>
      )}
    </div>
  );
}
