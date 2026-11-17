import { copy } from "@/data/copy";
import { galleryItems, homeGalleryIds } from "@/data/galleryData";
import { routes } from "@/lib/routes";
import { Button } from "@/components/ui/Button";
import { familyGlyphs } from "@/components/ui/Icons";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { SectionHead } from "@/components/ui/SectionHead";
import styles from "./Backstage.module.css";

const glyphFor = (id: string) => {
  if (id.includes("durum") || id === "g-01") return familyGlyphs.durums;
  if (id === "g-02") return familyGlyphs.kumpirs;
  if (id === "g-03") return familyGlyphs.mitraillettes;
  return null;
};

/**
 * SECTION 06 — DANS LES COULISSES
 * Fond crème, grille éditoriale irrégulière de cinq emplacements médias
 * remplaçables. Aucun faux visuel : blocs graphiques signalés « à venir ».
 */
export function Backstage() {
  const b = copy.home.backstage;
  const items = homeGalleryIds
    .map((id) => galleryItems.find((g) => g.id === id))
    .filter((g): g is NonNullable<typeof g> => !!g);
  const variants = ["solid", "stripes", "beige", "dots", "red"] as const;

  return (
    <section className={`${styles.section} theme-light`} aria-labelledby="coulisses-title">
      <div className="container">
        <div className={styles.head}>
          <SectionHead chapter={b.chapter} label={b.label} title={b.h2} id="coulisses-title" />
          <p className={`${styles.text} muted`} data-reveal>
            {b.text}
          </p>
        </div>

        <ul className={styles.grid}>
          {items.map((item, i) => {
            const Glyph = glyphFor(item.id);
            return (
              <li
                key={item.id}
                className={`${styles.cell} ${styles[item.span]}`}
                data-reveal="scale"
                style={{ ["--reveal-delay" as string]: `${i * 70}ms` }}
              >
                <PlaceholderMedia
                  ratio={item.ratio}
                  variant={variants[i % variants.length]}
                  file={item.file}
                  title={item.title}
                  media={item.src ? { src: item.src, alt: item.alt, width: item.width ?? 1200, height: item.height ?? 900 } : null}
                  glyph={Glyph ? <Glyph width={56} height={56} /> : undefined}
                  className={styles.media}
                />
              </li>
            );
          })}
        </ul>

        <div className={styles.cta} data-reveal>
          <Button href={routes.gallery} variant="ink">
            {b.cta}
          </Button>
        </div>
      </div>
    </section>
  );
}
