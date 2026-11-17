import type { Metadata } from "next";
import { copy } from "@/data/copy";
import { buildMetadata, seoPages } from "@/data/seoData";
import { isLegalComplete, siteConfig } from "@/data/siteConfig";
import { LegalField, LegalFields, LegalLayout, LegalSection } from "@/components/legal/LegalLayout";

export const metadata: Metadata = { ...buildMetadata(seoPages.legal), title: { absolute: seoPages.legal.title } };

/**
 * /mentions-legales — structure à compléter avec les informations officielles.
 * Non indexée tant que l'éditeur, le numéro BCE et le responsable manquent.
 */
export default function LegalPage() {
  const l = copy.legal;
  const { legal } = siteConfig;
  return (
    <LegalLayout
      chapter="05"
      label="Légal"
      title={l.h1}
      lead={l.lead}
      banner={isLegalComplete() ? null : l.pendingBanner}
      updatedAt={legal.updatedAt}
    >
      <LegalSection title={l.sections.publisher}>
        <LegalFields>
          <LegalField label={l.fields.companyName} value={legal.companyName} />
          <LegalField label={l.fields.legalForm} value={legal.legalForm} />
          <LegalField label={l.fields.companyNumber} value={legal.companyNumber} />
          <LegalField label={l.fields.registeredOffice} value={legal.registeredOffice} />
          <LegalField label={l.fields.publisher} value={legal.publisher} />
        </LegalFields>
      </LegalSection>

      <LegalSection title={l.sections.host}>
        <LegalFields>
          <LegalField label={l.fields.host} value={legal.host} />
        </LegalFields>
      </LegalSection>

      <LegalSection title={l.sections.ip}>
        <p>{l.ipText}</p>
      </LegalSection>

      <LegalSection title={l.sections.liability}>
        <p>{l.liabilityText}</p>
      </LegalSection>

      <LegalSection title={l.sections.contact}>
        <LegalFields>
          <LegalField label={l.fields.email} value={siteConfig.email} />
          <LegalField label={l.fields.phone} value={siteConfig.phone} />
        </LegalFields>
      </LegalSection>
    </LegalLayout>
  );
}
