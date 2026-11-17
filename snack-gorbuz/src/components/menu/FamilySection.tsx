import { copy } from "@/data/copy";
import type { Family } from "@/data/menuData";
import { familyGlyphs } from "@/components/ui/Icons";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { ProductCard } from "./ProductCard";
import styles from "./FamilySection.module.css";

interface FamilySectionProps {
  family: Family;
  position: number;
}

/**
 * Chapitre de famille sur la page carte : ancre, H3, intro, média signature,
 * puis grille de fiches — ou état provisoire éditorial si aucune fiche n'existe.
 * L'alternance gauche/droite varie selon la position.
 */
export function FamilySection({ family, position }: FamilySectionProps) {
  const m = copy.menu;
  const Glyph = familyGlyphs[family.id];
  const flipped = position % 2 === 1;
  const hasProducts = family.products.length > 0;

  return (
    <section id={family.id} className={[styles.section, flipped ? styles.flipped : ""].filter(Boolean).join(" ")} aria-labelledby={`h-${family.id}`}>
      <header className={styles.head}>
        <div className={styles.headMedia} data-reveal="scale">
          <PlaceholderMedia
            ratio={flipped ? "4:5" : "4:3"}
            media={family.image}
            file={family.signatureImageFile}
            title={family.name}
            variant={flipped ? "beige" : "solid"}
            glyph={<Glyph width={72} height={72} />}
          />
        </div>
        <div className={styles.headCopy} data-reveal>
          <p className={styles.num} aria-hidden="true">
            {family.index}
          </p>
          <h3 id={`h-${family.id}`} className={`display ${styles.title}`}>
            {family.name}
          </h3>
          <p className={styles.tagline}>{family.tagline}</p>
          <p className={`prose ${styles.intro} muted`}>{family.intro}</p>
        </div>
      </header>

      {hasProducts ? (
        <div className={styles.grid}>
          {family.products.map((p, i) => (
            <ProductCard key={p.id} product={p} featured={i === 0 && family.products.length > 2} />
          ))}
        </div>
      ) : (
        <div className={`${styles.empty} diecut`} data-reveal>
          <div className={styles.emptyCopy}>
            <span className="ticket ticket--accent">{copy.provisional.menuPending}</span>
            <p className={`display ${styles.emptyTitle}`}>{m.emptyFamilyTitle}</p>
            <p className={styles.emptyText}>{m.emptyFamilyText}</p>
          </div>
          <ul className={styles.fields} aria-label="Contenu de chaque fiche produit">
            {m.emptyFamilyFields.map((f, i) => (
              <li key={f} className={styles.field}>
                <span className={styles.fieldIndex}>{String(i + 1).padStart(2, "0")}</span>
                <span>{f}</span>
                <span className={styles.fieldDots} aria-hidden="true" />
                <span className={styles.fieldValue} aria-hidden="true">
                  —
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
