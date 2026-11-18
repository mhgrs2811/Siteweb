import type { Metadata } from "next";
import Link from "next/link";
import { Stamp } from "@/components/brand/Stamp";
import { FamilyGraphic } from "@/components/graphics/FamilyGraphic";
import { PageHero } from "@/components/layout/PageHero";
import { Chapter } from "@/components/ui/Chapter";
import { ArrowRight } from "@/components/ui/Icons";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { Reveal } from "@/components/ui/Reveal";
import { copy } from "@/data/copy";
import { galleryItems } from "@/data/gallery";
import { families } from "@/data/menu";
import { seo } from "@/data/seo";
import { hasAddress, siteConfig } from "@/data/site";
import { formatAddressLines } from "@/lib/format";
import s from "./page.module.css";

export const metadata: Metadata = {
  title: { absolute: seo.concept.title },
  description: seo.concept.description,
  openGraph: { title: seo.concept.title, description: seo.concept.description },
};

const pick = (id: string) => galleryItems.find((g) => g.id === id)!;

export default function ConceptPage() {
  const c = copy.conceptPage;
  const motifs = copy.universe.motifs;
  const address = siteConfig.address;

  return (
    <>
      <PageHero tone="dark" number="03" label={copy.nav.concept} title={c.title} lead={c.lead} ghost="Esprit" />

      <section className={`tone-light ${s.positioning}`} aria-labelledby="positionnement-title">
        <div className={`container ${s.grid}`}>
          <Reveal className={s.posHead}>
            <Chapter number="01" label="Positionnement" />
            <h2 id="positionnement-title" className="display display-xl">
              {c.positioningTitle}
            </h2>
          </Reveal>
          <Reveal className={s.posText} delay={1}>
            {c.positioning.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </Reveal>
          <Reveal className={s.posStamp} delay={2}>
            <Stamp />
          </Reveal>
        </div>
      </section>

      <section className={`tone-dark ${s.families}`} aria-labelledby="envies-concept-title">
        <div className="container">
          <Reveal className={s.famHead}>
            <Chapter number="02" label="Les envies" />
            <h2 id="envies-concept-title" className="display display-xl">
              {c.familiesTitle}
            </h2>
          </Reveal>
          <div className={s.famList}>
            {families.map((family, i) => (
              <Reveal key={family.slug} className={s.fam} delay={i} as="article">
                {family.media.src ? (
                  <MediaSlot media={family.media} sizes="(max-width: 768px) 100vw, 40vw" zoomable />
                ) : (
                  <div className={s.famPanel}>
                    <FamilyGraphic family={family.slug} uid={`concept-${family.slug}`} />
                  </div>
                )}
                <h3 className="display display-m">{family.name}</h3>
                <p>{family.definition}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className={`tone-dark ${s.universe}`} aria-labelledby="univers-concept-title" style={{ background: "var(--charbon-2)" }}>
        <div className="container">
          <div className={s.uniHead}>
            <Reveal className={s.uniTitle}>
              <Chapter number="03" label="L’univers" />
              <h2 id="univers-concept-title" className="display display-xl">
                {c.universeTitle}
              </h2>
            </Reveal>
            <Reveal className={s.uniText} delay={1} as="p">
              {c.universeText}
            </Reveal>
          </div>
          <Reveal className={s.uniGrid} delay={1}>
            <MediaSlot media={pick("snack-exterior")} className={s.uniMedia} ratio="16:9" sizes="(max-width: 768px) 100vw, 60vw" />
            <div className={s.uniSpec} style={{ background: "var(--charbon)" }}>
              <span className={s.uniLettering} aria-hidden="true">
                Gorbuz
              </span>
              <span className={s.uniLabel}>{motifs[0].label}</span>
              <p>{motifs[0].text}</p>
            </div>
            <div className={s.uniSpec} style={{ background: "var(--charbon)" }}>
              <Stamp className={s.uniStamp} />
              <span className={s.uniLabel}>{motifs[1].label}</span>
              <p>{motifs[1].text}</p>
            </div>
            <MediaSlot media={pick("snack-interior")} className={s.uniMedia} ratio="4:3" sizes="(max-width: 768px) 100vw, 33vw" />
            <MediaSlot media={pick("team-gorbuz")} className={s.uniMedia} ratio="4:3" sizes="(max-width: 768px) 100vw, 33vw" />
          </Reveal>
        </div>
      </section>

      <section className={`tone-beige ${s.find}`} aria-labelledby="retrouvez-title">
        <div className={`container ${s.findGrid}`}>
          <Reveal className={s.findHead}>
            <h2 id="retrouvez-title" className="display display-xl">
              {c.findTitle}
            </h2>
          </Reveal>
          <Reveal className={s.findBody} delay={1}>
            {hasAddress() && address ? (
              <p className={s.findAddress}>{formatAddressLines(address).join(", ")}</p>
            ) : (
              <p>{c.findText}</p>
            )}
            <Link href="/contact" className="btn btn-solid btn-lg">
              {c.findCta}
              <ArrowRight />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
