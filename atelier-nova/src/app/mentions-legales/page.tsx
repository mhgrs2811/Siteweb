import type { Metadata } from "next";
import { site } from "@/config/site";
import { LegalPage } from "@/components/sections/LegalPage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Mentions légales",
  description: `Informations légales relatives au site ${site.name} : éditeur, hébergeur, propriété intellectuelle.`,
  path: "/mentions-legales",
});

export default function MentionsLegales() {
  const l = site.legal;
  return (
    <LegalPage
      label="Informations légales"
      title="Mentions légales"
      updated={l.lastUpdate}
      sections={[
        {
          id: "editeur",
          title: "Éditeur du site",
          body: (
            <>
              <p>
                {site.legalName}
                <br />
                Siège : {l.registeredOffice}
                <br />
                Numéro d’entreprise (BCE) : {l.companyNumber}
                <br />
                Contact : <a className="link-u-static" href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
              </p>
              <p>Responsable de la publication : {l.publisher}</p>
            </>
          ),
        },
        {
          id: "hebergeur",
          title: "Hébergement",
          body: <p>{l.host}</p>,
        },
        {
          id: "propriete",
          title: "Propriété intellectuelle",
          body: (
            <>
              <p>
                L’ensemble des contenus de ce site (textes, mises en page, images de synthèse, sculpture 3D, code) est la propriété de {site.legalName}, sauf mention contraire. Toute reproduction sans autorisation écrite est interdite.
              </p>
              <p>
                Les typographies Geist et Instrument Serif sont distribuées sous licence SIL Open Font License. Les icônes proviennent de la bibliothèque Lucide (licence ISC).
              </p>
            </>
          ),
        },
        {
          id: "concepts",
          title: "Projets présentés",
          body: (
            <p>
              Les projets de la rubrique Réalisations sont des concepts fictifs créés par {site.name} pour illustrer son savoir-faire. Les noms de marques, lieux et scénarios présentés sont imaginaires ; toute ressemblance avec une entreprise existante serait fortuite.
            </p>
          ),
        },
        {
          id: "responsabilite",
          title: "Responsabilité",
          body: (
            <p>
              Les informations de ce site, notamment les tarifs, sont fournies à titre indicatif et peuvent être modifiées à tout moment. Seul un devis signé engage {site.legalName}.
            </p>
          ),
        },
        {
          id: "droit",
          title: "Droit applicable",
          body: <p>Le présent site est soumis au droit belge. En cas de litige, et à défaut de solution amiable, les tribunaux de l’arrondissement judiciaire de Bruxelles sont compétents.</p>,
        },
      ]}
    />
  );
}
