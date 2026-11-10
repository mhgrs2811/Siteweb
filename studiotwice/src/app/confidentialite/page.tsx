import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { orSoon, site } from "@/content/site";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Quelles données StudioTwice collecte via son site, pourquoi, et vos droits.",
  robots: { index: false },
};

export default function Page() {
  return (
    <LegalPage title="Politique de confidentialité" updated="novembre 2026">
      <h2>En bref</h2>
      <p>
        Ce site ne dépose aucun cookie et n’utilise aucun outil de mesure d’audience. Les seules données que nous recevons sont celles que
        vous nous envoyez volontairement par le formulaire de contact, par WhatsApp ou par téléphone.
      </p>
      <h2>Responsable du traitement</h2>
      <p>
        {site.name}, {orSoon(site.bce)}. Contact : {orSoon(site.email)}.
      </p>
      <h2>Données collectées par le formulaire</h2>
      <p>
        Votre nom, le nom de votre commerce, un moyen de vous joindre (téléphone ou e-mail), votre message et, si vous l’avez utilisé, le
        récapitulatif du configurateur de prix. Ces données servent uniquement à vous répondre et à préparer un devis. Elles sont transmises
        par e-mail via le service Resend et conservées dans notre messagerie le temps de l’échange commercial, puis trois ans au maximum.
      </p>
      <h2>Base légale</h2>
      <p>
        Votre demande constitue une mesure précontractuelle prise à votre initiative (article 6.1.b du RGPD). Nous ne vous envoyons aucune
        communication commerciale non sollicitée.
      </p>
      <h2>Vos droits</h2>
      <p>
        Vous pouvez demander l’accès, la rectification ou l’effacement de vos données, ou vous opposer à leur traitement, en nous écrivant à{" "}
        {orSoon(site.email)}. Vous pouvez aussi introduire une réclamation auprès de l’Autorité de protection des données, rue de la Presse 35,
        1000 Bruxelles, www.autoriteprotectiondonnees.be.
      </p>
      <h2>Sous-traitants</h2>
      <p>
        Vercel Inc. pour l’hébergement du site et Resend Inc. pour l’acheminement des e-mails du formulaire. Chacun agit selon nos
        instructions et dans le cadre de garanties conformes au RGPD.
      </p>
    </LegalPage>
  );
}
