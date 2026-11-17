import { copy } from "@/data/copy";
import { getFeaturedProduct } from "@/data/menuData";
import { ProductSpotlight } from "@/components/menu/ProductSpotlight";
import { SectionHead } from "@/components/ui/SectionHead";
import styles from "./Spotlight.module.css";

/**
 * SECTION 04 — LA VEDETTE DU MOMENT
 * Fond beige toasté, en-tête aligné à droite, panneau découpe d'emballage.
 */
export function Spotlight() {
  const s = copy.home.spotlight;
  return (
    <section className={`${styles.section} theme-beige`} aria-labelledby="vedette-title">
      <div className="container">
        <SectionHead chapter={s.chapter} label={s.label} title={s.h2} id="vedette-title" align="right" />
        <ProductSpotlight selection={getFeaturedProduct()} />
      </div>
    </section>
  );
}
