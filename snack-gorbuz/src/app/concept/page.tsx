import type { Metadata } from "next";
import Link from "next/link";
import { copy } from "@/data/copy";
import { families } from "@/data/menuData";
import { buildMetadata, seoPages } from "@/data/seoData";
import { formatAddress, hasAddress, siteConfig } from "@/data/siteConfig";
import { routes } from "@/lib/routes";
import { PageIntro } from "@/components/layout/PageIntro";
import { Button } from "@/components/ui/Button";
import { ArrowUpRight, familyGlyphs } from "@/components/ui/Icons";
import { Marquee } from "@/components/ui/Marquee";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { SectionHead } from "@/components/ui/SectionHead";
import { Stamp } from "@/components/ui/Stamp";
import styles from "./page.module.css";

export const metadata: Metadata = { ...buildMetadata(seoPages.concept), title: { absolute: seoPages.concept.title } };

/**
 * /concept — H1 « L'esprit Gorbuz » puis quatre H2 : positionnement, envies,
 * univers, retrouvez-nous. Aucune histoire, date ou promesse inventée.
 */
export default function ConceptPage() {
  const c = copy.concept;
  const variants = ["solid", "beige", "red", "stripes"] as const;

  return (
    <>
      <PageIntro chapter="02" label={copy.nav.concept} title={c.h1} lead={c.lead} />

      {/* Positionnement ------------------------------------------------------ */}
      <section className={`${styles.positioning} theme-light`} aria-labelledby="positionnement-title">
        <div className={`container ${styles.posInner}`}>
          <div className={styles.posHead}>
            <SectionHead chapter="01" label="Positionnement" title={c.h2Positioning} id="positionnement-title" />
          </div>
          <div className={`prose ${styles.posText}`} data-reveal>
            {c.positioning.map((p, i) => (
              <p key={p} className={i === 0 ? styles.first : undefined}>
                {p}
              </p>
            ))}
          </div>
          <div className={styles.posStamp} aria-hidden="true" data-reveal="scale">
            <Stamp size={160} tone="ink" />
          </div>
        </div>
        <Marquee words={copy.home.manifesto.marquee} tone="light" speed={60} />
      </section>

      {/* Envies -------------------------------------------------------------- */}
      <section className={`${styles.families} theme-dark`} aria-labelledby="envies-concept-title">
        <div className="container">
          <SectionHead chapter="02" label="Les envies" title={c.h2Families} id="envies-concept-title" align="right" />
          <ol className={styles.famList}>
            {families.map((f, i) => {
              const Glyph = familyGlyphs[f.id];
              return (
                <li key={f.id} className={styles.famItem} data-reveal style={{ ["--reveal-delay" as string]: `${i * 90}ms` }}>
                  <span className={styles.famIndex} aria-hidden="true">
                    {f.index}
                  </span>
                  <Glyph width={48} height={48} className={styles.famGlyph} aria-hidden="true" />
                  <div className={styles.famCopy}>
                    <h3 className={`display ${styles.famTitle}`}>{f.name}</h3>
                    <p className="muted">{f.tagline}</p>
                  </div>
                  <Link href={`${routes.menu}#${f.id}`} className={`link ${styles.famLink}`}>
                    {copy.nav.menu}
                    <ArrowUpRight />
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Univers ------------------------------------------------------------- */}
      <section className={`${styles.universe} theme-beige`} aria-labelledby="univers-concept-title">
        <div className="container">
          <div className={styles.uniHead}>
            <SectionHead chapter="03" label="Univers" title={c.h2Universe} id="univers-concept-title" />
            <p className={`prose ${styles.uniText}`} data-reveal>
              {c.universeText}
            </p>
          </div>
          <ul className={styles.tiles}>
            {c.universeTiles.map((t, i) => (
              <li key={t.label} className={styles.tile} data-reveal="scale" style={{ ["--reveal-delay" as string]: `${i * 80}ms` }}>
                <PlaceholderMedia
                  ratio={i % 2 === 0 ? "4:5" : "1:1"}
                  variant={variants[i % variants.length]}
                  file={`univers-0${i + 1}.jpg`}
                  title={t.label}
                />
                <p className={styles.tileCaption}>
                  <span className="label">{t.label}</span>
                  <span className={styles.tileTitle}>{t.title}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Retrouvez-nous ------------------------------------------------------ */}
      <section className={`${styles.find} theme-dark`} aria-labelledby="find-title">
        <div className={`container ${styles.findInner}`}>
          <div data-reveal>
            <p className="label label--index muted" data-index="04">
              Pratique
            </p>
            <h2 id="find-title" className={`display h2 ${styles.findTitle}`}>
              {c.h2Find}
            </h2>
            {hasAddress(siteConfig) ? (
              <address className={`${styles.findAddress} lead`}>{formatAddress(siteConfig.address)}</address>
            ) : (
              <p className={`prose muted ${styles.findText}`}>{c.findText}</p>
            )}
          </div>
          <div className={styles.findActions} data-reveal="right">
            <Button href={routes.contact} size="lg">
              {c.findCta}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
