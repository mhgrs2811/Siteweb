import { copy } from "@/data/copy";
import { badgeLabels, formatPrice, type Family, type Product } from "@/data/menuData";
import { routes } from "@/lib/routes";
import { Button } from "@/components/ui/Button";
import { familyGlyphs } from "@/components/ui/Icons";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import styles from "./ProductSpotlight.module.css";

interface ProductSpotlightProps {
  /** null = état éditorial de lancement (aucun produit sélectionné). */
  selection: { family: Family; product: Product } | null;
}

/**
 * Mise en avant d'un produit : grande image, nom, description, prix, badge.
 * Composant réutilisable (accueil, future page carte). Tant qu'aucune sélection
 * réelle n'existe, affiche un état de lancement clair, sans faux best-seller.
 */
export function ProductSpotlight({ selection }: ProductSpotlightProps) {
  const s = copy.home.spotlight;

  if (!selection) {
    return (
      <div className={`${styles.panel} ${styles.launch} diecut`} data-reveal="scale">
        <div className={styles.launchMedia}>
          <PlaceholderMedia ratio="4:5" variant="stripes" file="vedette.jpg" title="Vedette" rounded={false} />
        </div>
        <div className={styles.launchCopy}>
          <span className="ticket ticket--accent">{copy.provisional.menuPending}</span>
          <p className={`display ${styles.launchTitle}`}>{s.launchTitle}</p>
          <p className={`prose ${styles.launchText}`}>{s.launchText}</p>
          <Button href={routes.menu} variant="ink">
            {s.launchCta}
          </Button>
        </div>
      </div>
    );
  }

  const { family, product } = selection;
  const Glyph = familyGlyphs[family.id];
  const price =
    product.price !== undefined
      ? formatPrice(product.price)
      : product.variants?.length
        ? `dès ${formatPrice(Math.min(...product.variants.map((v) => v.price)))}`
        : null;

  return (
    <article className={`${styles.panel} diecut`} data-reveal="scale" aria-labelledby="spotlight-name">
      <div className={styles.media}>
        <PlaceholderMedia
          ratio="4:5"
          media={product.image ?? null}
          file={`${product.id}.jpg`}
          variant="stripes"
          rounded={false}
          glyph={<Glyph width={64} height={64} />}
          sizes="(max-width: 768px) 100vw, 40vw"
        />
      </div>
      <div className={styles.copy}>
        <p className="label label--index" data-index={family.index}>
          {family.name}
        </p>
        <h3 id="spotlight-name" className={`display ${styles.name}`}>
          {product.name}
        </h3>
        {product.badge && <span className="ticket ticket--accent">{badgeLabels[product.badge]}</span>}
        {product.description && <p className={`prose ${styles.desc}`}>{product.description}</p>}
        {price && <p className={styles.price}>{price}</p>}
        <Button href={`${routes.menu}#${family.id}`} variant="ink">
          {copy.nav.menu}
        </Button>
      </div>
    </article>
  );
}
