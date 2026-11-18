"use client";

import { useState } from "react";
import { Expand } from "@/components/ui/Icons";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { copy } from "@/data/copy";
import type { GalleryItem } from "@/data/types";
import { Lightbox } from "./Lightbox";
import s from "./GalleryGrid.module.css";

/**
 * Grille éditoriale irrégulière. Les médias réels s’ouvrent dans une lightbox
 * accessible ; les emplacements provisoires restent de simples blocs graphiques.
 */
export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const real = items.filter((i) => i.src !== null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <ul className={s.grid}>
        {items.map((item) => {
          const realIndex = real.findIndex((r) => r.id === item.id);
          return (
            <li key={item.id} className={s.item}>
              {item.src ? (
                <figure>
                  <button
                    type="button"
                    className={s.button}
                    onClick={() => setOpenIndex(realIndex)}
                    aria-label={`${copy.galleryPage.openImage} : ${item.alt}`}
                  >
                    <MediaSlot media={item} sizes="(max-width: 768px) 100vw, 50vw" zoomable />
                    <span className={s.hint} aria-hidden="true">
                      <Expand />
                      {copy.galleryPage.openImage}
                    </span>
                  </button>
                  <figcaption className={s.caption}>{item.caption}</figcaption>
                </figure>
              ) : (
                <MediaSlot media={item} />
              )}
            </li>
          );
        })}
      </ul>
      {real.length > 0 && (
        <Lightbox items={real} index={openIndex} onClose={() => setOpenIndex(null)} onChange={setOpenIndex} />
      )}
    </>
  );
}
