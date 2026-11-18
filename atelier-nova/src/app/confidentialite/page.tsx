import type { Metadata } from "next";
import { site } from "@/config/site";
import { LegalPage } from "@/components/sections/LegalPage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Politique de confidentialité",
  description: `Comment ${site.name} traite vos données personnelles, conformément au RGPD et à la loi belge du 30 juillet 2018.`,
  path: "/confidentialite",
});

export default function Confidentialite() {
  return (
    <LegalPage
      label="Vie privée"
      title="Politique de confidentialité"
      updated={site.legal.lastUpdate}
      sections={[
        {
          id: "responsable",
          title: "Responsable du traitement",
          body: (
            <p>
              {site.legalName}, {site.legal.registeredOffice}, BCE {site.legal.companyNumber}. Pour toute question relative à vos données : <a className="link-u-static" href={`mailto:${site.contact.email}`}>{site.contact.email}</a>.
            </p>
          ),
        },
        {
          id: "donnees",
          title: "Données collectées",
          body: (
            <>
              <p>
                Nous collectons uniquement les données que vous saisissez dans le formulaire de brief : prénom, nom, adresse e-mail, entreprise, type de projet, budget, délai, description et adresse de votre site existant.
              </p>
              <p>Aucun compte n’est créé et aucune donnée n’est collectée à votre insu.</p>
            </>
          ),
        },
        {
          id: "finalites",
          title: "Finalités et base légale",
          body: (
            <p>
              Ces données servent exclusivement à répondre à votre demande et, le cas échéant, à établir un devis. La base légale est votre consentement (article 6.1.a du RGPD) et l’exécution de mesures précontractuelles prises à votre demande (article 6.1.b).
            </p>
          ),
        },
        {
          id: "destinataires",
          title: "Destinataires et sous-traitants",
          body: (
            <>
              <p>Vos données ne sont ni vendues, ni louées, ni cédées. Elles sont transmises par e-mail à l’équipe {site.name} via notre prestataire d’envoi Resend, qui agit en tant que sous-traitant.</p>
              <p>Le site est hébergé par {site.legal.host}. Des transferts hors de l’Union européenne peuvent avoir lieu ; ils sont encadrés par les clauses contractuelles types de la Commission européenne.</p>
            </>
          ),
        },
        {
          id: "duree",
          title: "Durée de conservation",
          body: <p>Les demandes sans suite sont supprimées au plus tard 12 mois après le dernier échange. Les données liées à un contrat sont conservées pendant la durée légale applicable.</p>,
        },
        {
          id: "cookies",
          title: "Cookies et mesure d’audience",
          body: (
            <>
              <p>
                Ce site n’utilise aucun cookie publicitaire ni de suivi. Les polices sont hébergées sur nos propres serveurs : aucune requête n’est envoyée à des services tiers lors de votre visite. Une mémoire de session de votre navigateur retient seulement que l’animation d’introduction a déjà été vue ; elle disparaît à la fermeture de l’onglet.
              </p>
              <p>Si une mesure d’audience est ajoutée, elle sera anonyme et sans cookie, ou soumise à votre consentement préalable.</p>
            </>
          ),
        },
        {
          id: "droits",
          title: "Vos droits",
          body: (
            <>
              <p>
                Vous disposez d’un droit d’accès, de rectification, d’effacement, de limitation, d’opposition et de portabilité de vos données, ainsi que du droit de retirer votre consentement à tout moment. Écrivez-nous à <a className="link-u-static" href={`mailto:${site.contact.email}`}>{site.contact.email}</a>.
              </p>
              <p>
                Vous pouvez également introduire une réclamation auprès de l’Autorité de protection des données (APD), rue de la Presse 35, 1000 Bruxelles,{" "}
                <a className="link-u-static" href="https://www.autoriteprotectiondonnees.be" target="_blank" rel="noopener noreferrer">
                  autoriteprotectiondonnees.be
                </a>
                .
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
