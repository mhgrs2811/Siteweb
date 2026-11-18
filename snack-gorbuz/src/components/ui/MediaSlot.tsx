import Image from "next/image";
import type { CSSProperties } from "react";
import type { MediaRatio, MediaSlotData } from "@/data/types";
import { copy } from "@/data/copy";
import { StampMark } from "@/components/brand/Stamp";
import s from "./MediaSlot.module.css";

const ratioValue: Record<MediaRatio, string> = {
  "1:1": "1 / 1",
  "4:5": "4 / 5",
  "3:4": "3 / 4",
  "4:3": "4 / 3",
  "3:2": "3 / 2",
  "16:9": "16 / 9",
  "21:9": "21 / 9",
};

interface MediaSlotProps {
  media: MediaSlotData;
  className?: string;
  /** Tailles responsive passées à next/image quand un média réel existe. */
  sizes?: string;
  priority?: boolean;
  /** Force un ratio différent de celui des données (mise en page). */
  ratio?: MediaRatio;
  zoomable?: boolean;
  /** Masque l’étiquette de l’état provisoire (quand le parent affiche déjà une légende). */
  hideTag?: boolean;
}

/**
 * Emplacement média remplaçable.
 * - média réel (`src`) : image optimisée, alt descriptif ;
 * - média absent : bloc graphique provisoire, étiquette « Photo à venir » + légende.
 */
export function MediaSlot({
  media,
  className,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority,
  ratio,
  zoomable,
  hideTag,
}: MediaSlotProps) {
  const style = { aspectRatio: ratioValue[ratio ?? media.ratio] } as CSSProperties;
  const classes = [s.slot, zoomable && media.src ? s.zoomable : "", className].filter(Boolean).join(" ");

  if (media.src) {
    return (
      <div className={classes} style={style}>
        <Image src={media.src} alt={media.alt} fill sizes={sizes} priority={priority} />
      </div>
    );
  }

  return (
    <div className={classes} style={style} role="img" aria-label={`${copy.common.photoSoon} : ${media.caption}`}>
      <div className={s.placeholder}>
        <StampMark className={s.mark} />
        {!hideTag && (
          <p className={s.tag}>
            <strong>{copy.common.photoSoon}</strong>
            <span>{media.caption}</span>
          </p>
        )}
      </div>
    </div>
  );
}
