import type { Metadata } from "next";
import Link from "next/link";
import { copy } from "@/data/copy";
import { families } from "@/data/menuData";
import { buildMetadata, seoPages } from "@/data/seoData";
import { siteConfig } from "@/data/siteConfig";
import { routes } from "@/lib/routes";
import { PageIntro } from "@/components/layout/PageIntro";
import { FamilyNav } from "@/components/menu/FamilyNav";
import { FamilySection } from "@/components/menu/FamilySection";
import { Button } from "@/components/ui/Button";
import { ArrowUpRight } from "@/components/ui/Icons";
import { SectionHead } from "@/components/ui/SectionHead";
import styles from "./page.module.css";

export const metadata: Metadata = { ...buildMetadata(seoPages.menu), title: { absolute: seoPages.menu.title } };

/**
 * /carte — H1 « La carte Snack Gorbuz », nav par ancres, H2 « Trouve ton envie »,
 * un chapitre H3 par famille confirmée, H2 « Une question sur la carte ? ».
 */
export default function MenuPage() {
  const m = copy.menu;
  return (
    <>
      <PageIntro
        chapter="01"
        label={copy.nav.menu}
        title={m.h1}
        lead={m.lead}
        compact
        aside={
          siteConfig.menuPdfUrl ? (
            <a href={siteConfig.menuPdfUrl} className="link" target="_blank" rel="noopener noreferrer">
              {m.pdfCta}
              <ArrowUpRight />
            </a>
          ) : undefined
        }
      />

      <FamilyNav />

      <section className={`${styles.families} theme-light`} aria-labelledby="envie-title">
        <div className="container">
          <SectionHead chapter="02" label="Familles" title={m.h2Families} id="envie-title" className={styles.head} />
          {families.map((f, i) => (
            <FamilySection key={f.id} family={f} position={i} />
          ))}
        </div>
      </section>

      <section className={`${styles.question} theme-dark`} aria-labelledby="question-title">
        <div className={`container ${styles.questionInner}`}>
          <div data-reveal>
            <p className="label label--index muted" data-index="03">
              Contact
            </p>
            <h2 id="question-title" className={`display h2 ${styles.questionTitle}`}>
              {m.h2Question}
            </h2>
            <p className={`prose muted ${styles.questionText}`}>{m.questionText}</p>
          </div>
          <div className={styles.questionActions} data-reveal="right">
            <Button href={routes.contact} size="lg">
              {m.questionCta}
            </Button>
            <Link href={routes.concept} className="link">
              {copy.nav.concept}
              <ArrowUpRight />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
