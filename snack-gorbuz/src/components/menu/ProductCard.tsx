import { copy } from "@/data/copy";
import { allergenLabels, badgeLabels, formatPrice, type Product } from "@/data/menuData";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: Product;
  /** Première carte d'une famille : format plus large. */
  featured?: boolean;
}

/**
 * Fiche produit complète : photo, nom (h4 sous le h3 de famille), description,
 * prix / variantes, suppléments, allergènes confirmés, badge, disponibilité.
 * Prêt pour les données réelles ; jamais rendu avec des valeurs inventées.
 */
export function ProductCard({ product, featured }: ProductCardProps) {
  const m = copy.menu;
  const unavailable = product.available === false;

  return (
    <article
      className={[styles.card, featured ? styles.featured : "", unavailable ? styles.unavailable : ""].filter(Boolean).join(" ")}
      aria-labelledby={`p-${product.id}`}
      data-reveal
    >
      <div className={styles.media}>
        <PlaceholderMedia
          ratio={featured ? "4:3" : "1:1"}
          media={product.image ?? null}
          file={`${product.id}.jpg`}
          variant="stripes"
          sizes={featured ? "(max-width: 768px) 100vw, 60vw" : "(max-width: 768px) 100vw, 33vw"}
        />
        {product.badge && <span className={`ticket ticket--accent ${styles.badge}`}>{badgeLabels[product.badge]}</span>}
      </div>

      <div className={styles.body}>
        <div className={styles.titleRow}>
          <h4 id={`p-${product.id}`} className={`display ${styles.name}`}>
            {product.name}
          </h4>
          {product.price !== undefined && <p className={styles.price}>{formatPrice(product.price)}</p>}
        </div>

        {product.description && <p className={styles.desc}>{product.description}</p>}

        {unavailable && <p className={styles.unavailableNote}>{m.unavailable}</p>}

        {product.variants && product.variants.length > 0 && (
          <dl className={styles.list}>
            <dt className={styles.listTitle}>{m.variantsLabel}</dt>
            {product.variants.map((v) => (
              <dd key={v.label} className={styles.listRow}>
                <span>{v.label}</span>
                <span className={styles.dots} aria-hidden="true" />
                <span className={styles.listPrice}>{formatPrice(v.price)}</span>
              </dd>
            ))}
          </dl>
        )}

        {product.options && product.options.length > 0 && (
          <dl className={styles.list}>
            <dt className={styles.listTitle}>{m.optionsLabel}</dt>
            {product.options.map((o) => (
              <dd key={o.label} className={styles.listRow}>
                <span>{o.label}</span>
                <span className={styles.dots} aria-hidden="true" />
                <span className={styles.listPrice}>{o.price === 0 ? "inclus" : `+ ${formatPrice(o.price)}`}</span>
              </dd>
            ))}
          </dl>
        )}

        {product.allergens && product.allergens.length > 0 && (
          <p className={styles.allergens}>
            <span className={styles.listTitle}>{m.allergensLabel} :</span> {product.allergens.map((a) => allergenLabels[a]).join(", ")}
          </p>
        )}
      </div>
    </article>
  );
}
