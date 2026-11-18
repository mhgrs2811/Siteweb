import { MediaSlot } from "@/components/ui/MediaSlot";
import { copy } from "@/data/copy";
import type { Product } from "@/data/types";
import { formatPrice } from "@/lib/format";
import s from "./ProductCard.module.css";

/**
 * Fiche produit : prête pour nom, description, photo, prix, variantes, options,
 * allergènes confirmés, badge et disponibilité. Chaque champ est conditionnel.
 */
export function ProductCard({ product }: { product: Product }) {
  const { name, description, price, variants, options, allergens, badge, available, media } = product;
  return (
    <article className={s.card} aria-labelledby={`produit-${product.id}`}>
      {media && (
        <div className={s.media}>
          {badge && <span className={s.badge}>{copy.menuPage.badges[badge]}</span>}
          <MediaSlot media={media} ratio="4:3" sizes="(max-width: 768px) 100vw, 33vw" zoomable />
        </div>
      )}
      <div className={s.row}>
        <h4 id={`produit-${product.id}`} className={s.name}>
          {name}
        </h4>
        {price !== null ? (
          <span className={s.price}>{formatPrice(price)}</span>
        ) : variants.length === 0 ? (
          <span className={s.priceSoon}>{copy.menuPage.priceSoon}</span>
        ) : null}
      </div>
      {!media && badge && <span className={s.badge} style={{ position: "static", alignSelf: "flex-start" }}>{copy.menuPage.badges[badge]}</span>}
      {description && <p className={s.desc}>{description}</p>}
      {variants.length > 0 && (
        <p className={s.variants}>
          {variants.map((v) => (
            <span key={v.label}>
              {v.label}
              <b>{formatPrice(v.price)}</b>
            </span>
          ))}
        </p>
      )}
      {(options.length > 0 || allergens.length > 0) && (
        <dl className={s.meta}>
          {options.length > 0 && (
            <div>
              <dt>{copy.menuPage.optionsLabel}</dt>
              <dd>
                {options
                  .map((o) => (o.priceDelta > 0 ? `${o.label} (+${formatPrice(o.priceDelta)})` : o.label))
                  .join(", ")}
              </dd>
            </div>
          )}
          {allergens.length > 0 && (
            <div>
              <dt>{copy.menuPage.allergensLabel}</dt>
              <dd>{allergens.join(", ")}</dd>
            </div>
          )}
        </dl>
      )}
      {available === false && <p className={s.unavailable}>{copy.menuPage.unavailable}</p>}
    </article>
  );
}
