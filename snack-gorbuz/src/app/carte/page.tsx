import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { FamilyNav } from "@/components/menu/FamilyNav";
import { FamilySection } from "@/components/menu/FamilySection";
import { ArrowRight } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { copy } from "@/data/copy";
import { families, productsByFamily } from "@/data/menu";
import { seo } from "@/data/seo";
import s from "./page.module.css";

export const metadata: Metadata = {
  title: { absolute: seo.menu.title },
  description: seo.menu.description,
  openGraph: { title: seo.menu.title, description: seo.menu.description },
};

export default function MenuPage() {
  const counts = Object.fromEntries(families.map((f) => [f.slug, productsByFamily(f.slug).length]));

  return (
    <>
      <PageHero
        tone="light"
        number="02"
        label={copy.nav.menu}
        title={copy.menuPage.title}
        lead={copy.menuPage.lead}
        ghost="Carte"
      />

      <FamilyNav families={families} counts={counts} label={copy.menuPage.navLabel} />

      <div className={`tone-light ${s.body}`}>
        <div className={`container ${s.sectionTitle}`}>
          <h2 className="display display-l">{copy.menuPage.sectionTitle}</h2>
        </div>
        {families.map((family, i) => (
          <FamilySection key={family.slug} family={family} products={productsByFamily(family.slug)} index={i} />
        ))}
      </div>

      <section className={`tone-dark ${s.question}`} aria-labelledby="question-title">
        <div className={`container ${s.questionGrid}`}>
          <Reveal className={s.questionHead}>
            <h2 id="question-title" className="display display-xl">
              {copy.menuPage.questionTitle}
            </h2>
          </Reveal>
          <Reveal className={s.questionBody} delay={1}>
            <p>{copy.menuPage.questionText}</p>
            <Link href="/contact" className="btn btn-primary btn-lg">
              {copy.menuPage.questionCta}
              <ArrowRight />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
