import Link from "next/link";
import { FamilyGraphic } from "@/components/graphics/FamilyGraphic";
import { Chapter } from "@/components/ui/Chapter";
import { ArrowRight } from "@/components/ui/Icons";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { Reveal } from "@/components/ui/Reveal";
import { copy } from "@/data/copy";
import { families } from "@/data/menu";
import type { Family } from "@/data/types";
import s from "./Families.module.css";

/** Visuel d’une famille : photo réelle si fournie, sinon interprétation graphique. */
export function FamilyVisual({ family, uid }: { family: Family; uid: string }) {
  if (family.media.src) {
    return <MediaSlot media={family.media} sizes="(max-width: 768px) 100vw, 60vw" zoomable />;
  }
  return (
    <div className={s.panel}>
      <FamilyGraphic family={family.slug} uid={uid} />
    </div>
  );
}

/** Section 03 — Les envies Gorbuz : trois compositions distinctes, pas trois cartes. */
export function Families() {
  return (
    <section className={`tone-dark ${s.section}`} aria-labelledby="envies-title">
      <div className="container">
        <div className={s.head}>
          <Reveal className={s.headTitle}>
            <Chapter number="03" label="Les envies" />
            <h2 id="envies-title" className="display display-xl">
              {copy.families.title}
            </h2>
          </Reveal>
          <Reveal className={s.headIntro} delay={1} as="p">
            {copy.families.intro}
          </Reveal>
        </div>

        <div className={s.list}>
          {families.map((family, i) => (
            <Reveal key={family.slug} className={`${s.row} ${s[family.slug]}`} as="article">
              <div className={s.visual}>
                <span className={s.index} aria-hidden="true">
                  Famille 0{i + 1}
                </span>
                <FamilyVisual family={family} uid={`home-${family.slug}`} />
              </div>
              <div className={s.text}>
                <h3 className={`display display-l ${s.name}`}>{family.name}</h3>
                <p className={s.definition}>{family.definition}</p>
                <p className={s.tagline}>{family.tagline}</p>
                <Link href={`/carte#${family.slug}`} className={`link ${s.link}`}>
                  Voir les {family.name.toLowerCase()} dans la carte
                  <ArrowRight />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>

        <div className={s.cta}>
          <Link href="/carte" className="btn btn-primary btn-lg">
            {copy.families.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
