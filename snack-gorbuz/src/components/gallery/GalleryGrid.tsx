"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { copy } from "@/data/copy";
import {
  galleryCategories,
  galleryItems,
  shouldShowGalleryFilters,
  type GalleryCategory,
  type GalleryItem,
} from "@/data/galleryData";
import { ArrowRight, Close, familyGlyphs } from "@/components/ui/Icons";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import styles from "./GalleryGrid.module.css";

const glyphFor = (item: GalleryItem) => {
  if (item.file.startsWith("durum")) return familyGlyphs.durums;
  if (item.file.startsWith("kumpir")) return familyGlyphs.kumpirs;
  if (item.file.startsWith("mitraillette")) return familyGlyphs.mitraillettes;
  return null;
};

const variants = ["solid", "stripes", "beige", "dots", "red"] as const;

/**
 * Galerie éditoriale : trois chapitres H2 (produits / lieu / équipe), grille
 * irrégulière, filtres affichés uniquement si ≥ 2 catégories ont des médias
 * réels, lightbox accessible (dialog natif) uniquement pour les vraies images.
 */
export function GalleryGrid() {
  const g = copy.gallery;
  const [filter, setFilter] = useState<GalleryCategory | "all">("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const filterId = useId();
  const showFilters = shouldShowGalleryFilters();

  const realItems = galleryItems.filter((i) => i.src !== null);

  const open = useCallback((item: GalleryItem) => {
    const idx = realItems.findIndex((r) => r.id === item.id);
    if (idx >= 0) setOpenIndex(idx);
  }, [realItems]);

  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (dir: 1 | -1) => {
      setOpenIndex((cur) => (cur === null ? cur : (cur + dir + realItems.length) % realItems.length));
    },
    [realItems.length],
  );

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (openIndex !== null && !d.open) d.showModal();
    if (openIndex === null && d.open) d.close();
  }, [openIndex]);

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openIndex, step]);

  const current = openIndex !== null ? realItems[openIndex] : null;

  return (
    <>
      {showFilters && (
        <div className={styles.filters} role="group" aria-labelledby={filterId}>
          <span id={filterId} className="label muted">
            {g.filtersLabel}
          </span>
          <button type="button" className={styles.filter} aria-pressed={filter === "all"} onClick={() => setFilter("all")}>
            {g.all}
          </button>
          {galleryCategories.map((c) => (
            <button key={c.id} type="button" className={styles.filter} aria-pressed={filter === c.id} onClick={() => setFilter(c.id)}>
              {c.label}
            </button>
          ))}
        </div>
      )}

      {galleryCategories
        .filter((c) => filter === "all" || filter === c.id)
        .map((cat, ci) => {
          const items = galleryItems.filter((i) => i.category === cat.id);
          return (
            <section key={cat.id} className={styles.chapter} aria-labelledby={`gal-${cat.id}`}>
              <div className={styles.chapterHead} data-reveal>
                <p className="label label--index muted" data-index={String(ci + 1).padStart(2, "0")}>
                  {cat.label}
                </p>
                <h2 id={`gal-${cat.id}`} className="display h2">
                  {cat.heading}
                </h2>
              </div>
              <ul className={styles.grid}>
                {items.map((item, i) => {
                  const Glyph = glyphFor(item);
                  const media = item.src
                    ? { src: item.src, alt: item.alt, width: item.width ?? 1200, height: item.height ?? 900 }
                    : null;
                  const tile = (
                    <PlaceholderMedia
                      ratio={item.ratio}
                      media={media}
                      file={item.file}
                      title={item.title}
                      variant={variants[(i + ci) % variants.length]}
                      glyph={Glyph ? <Glyph width={56} height={56} /> : undefined}
                      className={styles.media}
                    />
                  );
                  return (
                    <li key={item.id} className={`${styles.cell} ${styles[item.span]}`} data-reveal="scale" style={{ ["--reveal-delay" as string]: `${i * 60}ms` }}>
                      {media ? (
                        <button type="button" className={styles.openBtn} onClick={() => open(item)} aria-label={`${item.title} — agrandir`}>
                          {tile}
                        </button>
                      ) : (
                        tile
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}

      {/* Lightbox (uniquement pour les médias réels) ----------------------- */}
      <dialog ref={dialogRef} className={styles.dialog} onClose={close} aria-label={current?.title}>
        {current && (
          <div className={styles.dialogInner}>
            <button type="button" className={styles.dialogClose} onClick={close} aria-label={g.lightboxClose}>
              <Close width={28} height={28} />
            </button>
            <figure className={styles.figure}>
              <Image
                src={current.src ?? ""}
                alt={current.alt}
                width={current.width ?? 1600}
                height={current.height ?? 1200}
                sizes="100vw"
                className={styles.figureImg}
              />
              <figcaption className={styles.figcaption}>{current.title}</figcaption>
            </figure>
            {realItems.length > 1 && (
              <div className={styles.dialogNav}>
                <button type="button" className={styles.navBtn} onClick={() => step(-1)} aria-label={g.lightboxPrev}>
                  <ArrowRight style={{ transform: "rotate(180deg)" }} />
                </button>
                <span className={styles.counter}>
                  {openIndex! + 1} / {realItems.length}
                </span>
                <button type="button" className={styles.navBtn} onClick={() => step(1)} aria-label={g.lightboxNext}>
                  <ArrowRight />
                </button>
              </div>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}
