import Link from "next/link";
import { copy } from "@/data/copy";
import { families } from "@/data/menuData";
import { routes } from "@/lib/routes";
import { Button } from "@/components/ui/Button";
import { ArrowUpRight, familyGlyphs } from "@/components/ui/Icons";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { SectionHead } from "@/components/ui/SectionHead";
import styles from "./Families.module.css";

/**
 * SECTION 03 — LES ENVIES GORBUZ
 * Trois compositions distinctes pour les trois familles confirmées :
 * 01 large bandeau média + texte, 02 inversé et décalé, 03 pleine largeur beige.
 * Aucune déclinaison, ingrédient ou prix : ce sont des familles, pas des fiches.
 */
export function Families() {
  const f = copy.home.families;
  const [durums, kumpirs, mitraillettes] = families;
  if (!durums || !kumpirs || !mitraillettes) return null;

  const GlyphD = familyGlyphs[durums.id];
  const GlyphK = familyGlyphs[kumpirs.id];
  const GlyphM = familyGlyphs[mitraillettes.id];

  return (
    <section className={`${styles.section} theme-dark`} aria-labelledby="envies-title">
      <div className="container">
        <SectionHead chapter={f.chapter} label={f.label} title={f.h2} id="envies-title" />
      </div>

      {/* 01 — Durums : média large à gauche, texte à droite */}
      <article className={`container ${styles.row} ${styles.rowA}`} aria-labelledby="fam-durums">
        <Link href={`${routes.menu}#${durums.id}`} className={styles.mediaLink} data-reveal="left" aria-label={`${durums.name} — ${copy.nav.menu}`}>
          <PlaceholderMedia
            ratio="3:2"
            variant="solid"
            file={durums.signatureImageFile}
            title={durums.name}
            media={durums.image}
            glyph={<GlyphD width={72} height={72} />}
          />
        </Link>
        <div className={styles.copy} data-reveal="right">
          <p className={styles.num} aria-hidden="true">
            {durums.index}
          </p>
          <h3 id="fam-durums" className="display h3">
            {durums.name}
          </h3>
          <p className={`${styles.tag} muted`}>{durums.tagline}</p>
          <Link href={`${routes.menu}#${durums.id}`} className="link">
            {copy.nav.menu}
            <ArrowUpRight />
          </Link>
        </div>
      </article>

      {/* 02 — Kumpirs : texte à gauche, média portrait à droite, décalé vers le bas */}
      <article className={`container ${styles.row} ${styles.rowB}`} aria-labelledby="fam-kumpirs">
        <div className={styles.copy} data-reveal="left">
          <p className={styles.num} aria-hidden="true">
            {kumpirs.index}
          </p>
          <h3 id="fam-kumpirs" className="display h3">
            {kumpirs.name}
          </h3>
          <p className={`${styles.tag} muted`}>{kumpirs.tagline}</p>
          <Link href={`${routes.menu}#${kumpirs.id}`} className="link">
            {copy.nav.menu}
            <ArrowUpRight />
          </Link>
        </div>
        <Link href={`${routes.menu}#${kumpirs.id}`} className={styles.mediaLink} data-reveal="right" aria-label={`${kumpirs.name} — ${copy.nav.menu}`}>
          <PlaceholderMedia
            ratio="4:5"
            variant="beige"
            file={kumpirs.signatureImageFile}
            title={kumpirs.name}
            media={kumpirs.image}
            glyph={<GlyphK width={72} height={72} />}
          />
        </Link>
      </article>

      {/* 03 — Mitraillettes : bande pleine largeur beige, titre géant */}
      <article className={`${styles.band} theme-beige`} aria-labelledby="fam-mitraillettes">
        <div className={`container ${styles.bandInner}`}>
          <div className={styles.bandMedia} data-reveal="scale">
            <PlaceholderMedia
              ratio="1:1"
              variant="solid"
              file={mitraillettes.signatureImageFile}
              title={mitraillettes.name}
              media={mitraillettes.image}
              glyph={<GlyphM width={72} height={72} />}
            />
          </div>
          <div className={styles.bandCopy} data-reveal>
            <p className={styles.num} aria-hidden="true">
              {mitraillettes.index}
            </p>
            <h3 id="fam-mitraillettes" className={`display ${styles.bandTitle}`}>
              {mitraillettes.name}
            </h3>
            <p className={styles.tag}>{mitraillettes.tagline}</p>
            <Button href={`${routes.menu}#${mitraillettes.id}`} variant="ink">
              {copy.nav.menu}
            </Button>
          </div>
        </div>
      </article>

      <div className={`container ${styles.cta}`} data-reveal>
        <Button href={routes.menu} size="lg">
          {f.cta}
        </Button>
      </div>
    </section>
  );
}
