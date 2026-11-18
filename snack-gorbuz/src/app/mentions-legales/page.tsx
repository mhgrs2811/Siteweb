import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { DraftBanner, LegalField } from "@/components/legal/LegalField";
import { copy } from "@/data/copy";
import { seo } from "@/data/seo";
import { siteConfig } from "@/data/site";
import s from "../legal.module.css";

export const metadata: Metadata = {
  title: { absolute: seo.legalNotice.title },
  description: seo.legalNotice.description,
  robots: siteConfig.legal.complete ? undefined : { index: false, follow: true },
};

/** Mentions légales : structure à compléter avec les informations réelles (siteConfig.legal). */
export default function LegalNoticePage() {
  const l = siteConfig.legal;
  return (
    <>
      <PageHero tone="light" number="§1" label="Informations" title={copy.legal.noticeTitle} lead={copy.legal.noticeLead} />
      <section className={`tone-light ${s.section}`}>
        <div className={`container ${s.inner}`}>
          {!l.complete && <DraftBanner />}

          <h2 className="display display-m">Éditeur du site</h2>
          <dl>
            <LegalField label="Dénomination" value={l.companyName} />
            <LegalField label="Forme juridique" value={l.legalForm} />
            <LegalField label="Numéro d’entreprise (BCE)" value={l.companyNumber} />
            <LegalField label="Numéro de TVA" value={l.vatNumber} />
            <LegalField label="Siège social" value={l.registeredOffice} />
            <LegalField label="Responsable de la publication" value={l.publisherName} />
            <LegalField label="Contact" value={l.contactEmail} />
          </dl>

          <h2 className="display display-m">Hébergement</h2>
          <dl>
            <LegalField label="Hébergeur" value={l.hostName} />
            <LegalField label="Adresse de l’hébergeur" value={l.hostAddress} />
          </dl>

          <h2 className="display display-m">Propriété intellectuelle</h2>
          <p>
            L’ensemble des éléments de ce site (textes, lettrages, visuels, compositions graphiques et 3D) est protégé
            par le droit d’auteur. Toute reproduction ou représentation, totale ou partielle, sans autorisation
            préalable de l’éditeur est interdite.
          </p>

          <h2 className="display display-m">Responsabilité</h2>
          <p>
            L’éditeur s’efforce de maintenir des informations exactes et à jour. Les informations pratiques (carte, prix,
            horaires) sont publiées à titre indicatif et peuvent évoluer ; les informations définitives sont celles
            communiquées sur place.
          </p>
        </div>
      </section>
    </>
  );
}
