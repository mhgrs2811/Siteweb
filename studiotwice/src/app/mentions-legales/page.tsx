import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { orSoon, site } from "@/content/site";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Informations légales sur StudioTwice, studio de création de sites web pour commerces locaux en Belgique francophone.",
  robots: { index: false },
};

export default function Page() {
  const addr = [site.address.street, [site.address.postal, site.address.city].filter(Boolean).join(" ")].filter(Boolean).join(", ");
  return (
    <LegalPage title="Mentions légales" updated="novembre 2026">
      <h2>Éditeur du site</h2>
      <p>
        {site.name}, studio de création de sites web.
        <br />
        {/* TODO: compléter l'adresse, le numéro d'entreprise et l'e-mail dans src/content/site.ts */}
        Siège : {orSoon(addr)}.
        <br />
        Numéro d’entreprise (BCE) : {orSoon(site.bce)}.
        <br />
        TVA : {site.bce ? site.bce.replace(/^BE\s?/, "BE ") : "à venir"}.
        <br />
        E-mail : {orSoon(site.email)}. Téléphone : {orSoon(site.phone)}.
      </p>
      <h2>Hébergement</h2>
      <p>
        Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis. Les données sont servies depuis des
        serveurs situés en Europe.
      </p>
      <h2>Propriété intellectuelle</h2>
      <p>
        Les textes, la mise en page, les illustrations et le code de ce site sont la propriété de {site.name}. Les sites réalisés pour nos
        clients leur appartiennent intégralement, textes, images et code compris.
      </p>
      <h2>Prix</h2>
      <p>
        Les prix affichés sur ce site sont indiqués hors TVA et à titre indicatif. Seul un devis signé engage {site.name}.
      </p>
      <h2>Responsabilité</h2>
      <p>
        Nous veillons à l’exactitude des informations publiées, sans pouvoir garantir l’absence d’erreur. Les liens vers des sites tiers sont
        donnés à titre d’information, leur contenu ne nous engage pas.
      </p>
      <h2>Droit applicable</h2>
      <p>Le présent site est soumis au droit belge. En cas de litige, les tribunaux belges sont seuls compétents.</p>
    </LegalPage>
  );
}
