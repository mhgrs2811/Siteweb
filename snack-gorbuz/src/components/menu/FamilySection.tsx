import { FamilyVisual } from "@/components/home/Families";
import { ProductCard } from "@/components/menu/ProductCard";
import { copy } from "@/data/copy";
import type { Family, Product } from "@/data/types";
import s from "./FamilySection.module.css";

interface FamilySectionProps {
  family: Family;
  products: Product[];
  index: number;
}

/**
 * Famille de la carte (H3) : visuel + définition, puis fiches produits réelles
 * ou état provisoire explicite. Jamais de fausses fiches.
 */
export function FamilySection({ family, products, index }: FamilySectionProps) {
  const alt = index % 2 === 1;
  return (
    <section
      id={family.slug}
      className={[s.section, alt ? s.alt : ""].join(" ")}
      aria-labelledby={`famille-${family.slug}`}
    >
      <div className={`container ${s.grid}`}>
        <div className={s.intro}>
          <span className={s.index} aria-hidden="true">
            0{index + 1}
          </span>
          <h3 id={`famille-${family.slug}`} className="display display-l">
            {family.name}
          </h3>
          <p className={s.definition}>{family.definition}</p>
          <p className={s.tagline}>{family.tagline}</p>
        </div>

        <div className={s.visual}>
          <FamilyVisual family={family} uid={`carte-${family.slug}`} />
        </div>

        {products.length > 0 ? (
          <ul className={s.list}>
            {products.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        ) : (
          <div className={`ticket ${s.empty}`}>
            <span className={s.emptyLabel}>{copy.common.comingWithMenu}</span>
            <p className={s.emptyText}>{copy.menuPage.emptyFamily}</p>
          </div>
        )}
      </div>
    </section>
  );
}
