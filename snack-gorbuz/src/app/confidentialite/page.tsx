import type { Metadata } from "next";
import { copy } from "@/data/copy";
import { buildMetadata, seoPages } from "@/data/seoData";
import { isLegalComplete, siteConfig } from "@/data/siteConfig";
import { LegalField, LegalFields, LegalLayout, LegalSection } from "@/components/legal/LegalLayout";

export const metadata: Metadata = { ...buildMetadata(seoPages.privacy), title: { absolute: seoPages.privacy.title } };

/**
 * /confidentialite — décrit l'état technique réel du site (aucune collecte,
 * aucun cookie tiers) et laisse les champs du responsable à compléter.
 */
export default function PrivacyPage() {
  const p = copy.privacy;
  const { legal } = siteConfig;
  return (
    <LegalLayout
      chapter="06"
      label="Légal"
      title={p.h1}
      lead={p.lead}
      banner={isLegalComplete() ? null : p.pendingBanner}
      updatedAt={legal.updatedAt}
    >
      <LegalSection title={p.sections.controller}>
        <LegalFields>
          <LegalField label="Responsable du traitement" value={legal.dataController ?? legal.companyName} />
          <LegalField label="Email de contact RGPD" value={legal.privacyEmail ?? siteConfig.email} />
        </LegalFields>
      </LegalSection>

      <LegalSection title={p.sections.data}>
        <p>{p.dataText}</p>
      </LegalSection>

      <LegalSection title={p.sections.cookies}>
        <p>{p.cookiesText}</p>
      </LegalSection>

      <LegalSection title={p.sections.rights}>
        <p>{p.rightsText}</p>
      </LegalSection>

      <LegalSection title={p.sections.contact}>
        <p>{legal.privacyEmail ?? siteConfig.email ?? p.contactPending}</p>
      </LegalSection>
    </LegalLayout>
  );
}
