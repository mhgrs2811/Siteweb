import Link from "next/link";
import { Stamp } from "@/components/brand/Stamp";
import { Chapter } from "@/components/ui/Chapter";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { Reveal } from "@/components/ui/Reveal";
import { copy } from "@/data/copy";
import { featured } from "@/data/featured";
import { products } from "@/data/menu";
import { formatPrice } from "@/lib/format";
import s from "./Featured.module.css";

/**
 * Section 04 — La vedette du moment.
 * Composant réutilisable de mise en avant : tant qu’aucun produit réel n’est désigné,
 * affiche un état éditorial de lancement (ticket), jamais un faux best-seller.
 */
export function Featured() {
  const featuredId = featured?.productId;
  const product = featuredId ? products.find((p) => p.id === featuredId) : undefined;

  return (
    <section className={`tone-light ${s.section}`} aria-labelledby="vedette-title">
      <div className="container">
        <Reveal className={s.head}>
          <Chapter number="04" label="À l’honneur" />
          <h2 id="vedette-title" className="display display-xl">
            {featured?.headline ?? copy.featured.title}
          </h2>
        </Reveal>

        {product ? (
          <Reveal className={s.product} as="article">
            <div className={s.productMedia}>
              {product.media && <MediaSlot media={product.media} sizes="(max-width: 768px) 100vw, 50vw" zoomable />}
            </div>
            <div className={s.productBody}>
              {product.badge && <span className={s.badge}>{copy.menuPage.badges[product.badge]}</span>}
              <h3 className="display display-l">{product.name}</h3>
              {featured?.text && <p className="lead">{featured.text}</p>}
              {product.description && <p className="muted">{product.description}</p>}
              {product.price !== null && (
                <p className={s.price}>
                  <span className="sr-only">{copy.featured.priceLabel} : </span>
                  {formatPrice(product.price)}
                </p>
              )}
              <Link href={`/carte#${product.familySlug}`} className="btn btn-primary">
                {copy.common.seeMenu}
              </Link>
            </div>
          </Reveal>
        ) : (
          <Reveal className={`ticket ${s.ticket}`} delay={1}>
            <span className={s.tag}>{copy.featured.emptyStamp}</span>
            <Stamp className={s.stamp} />
            <div className={s.body}>
              <p className={s.lead}>{copy.featured.emptyLead}</p>
              <p className={s.text}>{copy.featured.emptyText}</p>
            </div>
            <div className={s.action}>
              <Link href="/carte" className="btn btn-solid">
                {copy.common.seeMenu}
              </Link>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
