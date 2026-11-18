"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Close } from "@/components/ui/Icons";
import { copy } from "@/data/copy";
import type { GalleryItem } from "@/data/types";
import s from "./Lightbox.module.css";

interface LightboxProps {
  items: GalleryItem[];
  index: number | null;
  onClose: () => void;
  onChange: (index: number) => void;
}

/** Visionneuse plein écran basée sur <dialog> : Échap, flèches, focus restitué. */
export function Lightbox({ items, index, onClose, onChange }: LightboxProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const open = index !== null;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") onChange(((index ?? 0) + 1) % items.length);
      if (e.key === "ArrowLeft") onChange(((index ?? 0) - 1 + items.length) % items.length);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, index, items.length, onChange]);

  const item = index !== null ? items[index] : null;

  return (
    <dialog ref={ref} className={s.dialog} onClose={onClose} aria-label={item?.alt ?? "Galerie"}>
      {item && item.src && (
        <div className={s.inner}>
          <div className={s.bar}>
            <span className={s.count}>
              {(index ?? 0) + 1} / {items.length}
            </span>
            <button type="button" className={s.iconBtn} onClick={onClose} aria-label={copy.galleryPage.lightboxClose}>
              <Close />
            </button>
          </div>
          <div className={s.stage}>
            <Image src={item.src} alt={item.alt} fill sizes="100vw" />
          </div>
          <div className={s.foot}>
            <p className={s.caption}>{item.caption}</p>
            {items.length > 1 && (
              <div className={s.navBtns}>
                <button
                  type="button"
                  className={s.iconBtn}
                  onClick={() => onChange(((index ?? 0) - 1 + items.length) % items.length)}
                  aria-label={copy.galleryPage.lightboxPrev}
                >
                  <ChevronLeft />
                </button>
                <button
                  type="button"
                  className={s.iconBtn}
                  onClick={() => onChange(((index ?? 0) + 1) % items.length)}
                  aria-label={copy.galleryPage.lightboxNext}
                >
                  <ChevronRight />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}
