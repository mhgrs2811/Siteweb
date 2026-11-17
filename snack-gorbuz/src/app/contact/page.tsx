import type { Metadata } from "next";
import { copy } from "@/data/copy";
import { buildMetadata, seoPages } from "@/data/seoData";
import { hasOrdering } from "@/data/siteConfig";
import { routes } from "@/lib/routes";
import { PageIntro } from "@/components/layout/PageIntro";
import { PracticalBlocks } from "@/components/practical/PracticalBlocks";
import { Button } from "@/components/ui/Button";
import { SectionHead } from "@/components/ui/SectionHead";
import styles from "./page.module.css";

export const metadata: Metadata = { ...buildMetadata(seoPages.contact), title: { absolute: seoPages.contact.title } };

/**
 * /contact — H1 « On se retrouve chez Gorbuz ? », H2 infos pratiques,
 * H3 adresse / horaires / contact. Carte interactive uniquement avec une adresse
 * réelle ; pas de formulaire tant qu'aucun traitement serveur n'est configuré.
 */
export default function ContactPage() {
  const c = copy.contact;
  return (
    <>
      <PageIntro chapter="04" label={copy.nav.contact} title={c.h1} lead={c.lead} compact />
      <section className={`${styles.body} theme-dark`} aria-labelledby="infos-title">
        <div className="container">
          <SectionHead chapter="01" label="Pratique" title={c.h2} id="infos-title" />
          <PracticalBlocks headings={{ address: c.h3Address, hours: c.h3Hours, contact: c.h3Contact }} withMap />
          {!hasOrdering() && (
            <aside className={`${styles.note} diecut`} data-reveal aria-labelledby="note-title">
              <div>
                <p id="note-title" className={`display ${styles.noteTitle}`}>
                  {c.noteTitle}
                </p>
                <p className={styles.noteText}>{c.noteText}</p>
              </div>
              <Button href={routes.menu} variant="ink">
                {copy.nav.ctaMenu}
              </Button>
            </aside>
          )}
        </div>
      </section>
    </>
  );
}
