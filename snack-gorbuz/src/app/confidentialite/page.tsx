import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { DraftBanner, LegalField } from "@/components/legal/LegalField";
import { copy } from "@/data/copy";
import { seo } from "@/data/seo";
import { siteConfig } from "@/data/site";
import s from "../legal.module.css";

export const metadata: Metadata = {
  title: { absolute: seo.privacy.title },
  description: seo.privacy.description,
  robots: siteConfig.legal.complete ? undefined : { index: false, follow: true },
};

/** Politique de confidentialité : structure à compléter selon les outils réellement utilisés. */
export default function PrivacyPage() {
  const l = siteConfig.legal;
  return (
    <>
      <PageHero tone="light" number="§2" label="Informations" title={copy.legal.privacyTitle} lead={copy.legal.privacyLead} />
      <section className={`tone-light ${s.section}`}>
        <div className={`container ${s.inner}`}>
          {!l.complete && <DraftBanner />}

          <h2 className="display display-m">Responsable du traitement</h2>
          <dl>
            <LegalField label="Responsable" value={l.dataController} />
            <LegalField label="Contact" value={l.contactEmail} />
          </dl>

          <h2 className="display display-m">Données collectées</h2>
          <p>
            Dans sa version actuelle, ce site ne comporte ni formulaire, ni compte utilisateur, ni outil de mesure
            d’audience. Aucune donnée personnelle n’est collectée directement par le site.
          </p>
          <p>
            Si un formulaire de contact, un service de commande ou un outil statistique est ajouté, cette section
            devra décrire les données traitées, leur finalité, leur durée de conservation et leur base légale.
          </p>

          <h2 className="display display-m">Cookies</h2>
          <p>
            Ce site ne dépose aucun cookie de suivi. Seuls des éléments techniques strictement nécessaires au
            fonctionnement des pages peuvent être stockés par le navigateur. Toute évolution (statistiques, contenus
            tiers) fera l’objet d’une information et, le cas échéant, d’une demande de consentement.
          </p>

          <h2 className="display display-m">Hébergement et journaux techniques</h2>
          <dl>
            <LegalField label="Hébergeur" value={l.hostName} />
          </dl>
          <p>
            L’hébergeur peut conserver des journaux techniques (adresse IP, horodatage, pages consultées) pour la
            sécurité et le bon fonctionnement du service. Les durées de conservation sont à préciser avec l’hébergeur.
          </p>

          <h2 className="display display-m">Vos droits</h2>
          <p>
            Conformément au Règlement général sur la protection des données (RGPD), vous disposez d’un droit d’accès,
            de rectification, d’effacement, de limitation et d’opposition concernant vos données. Vous pouvez exercer
            ces droits auprès du responsable du traitement indiqué ci-dessus, et introduire une réclamation auprès de
            l’Autorité de protection des données (Belgique).
          </p>
        </div>
      </section>
    </>
  );
}
