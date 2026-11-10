/**
 * COORDONNÉES ET INFORMATIONS LÉGALES
 * ---------------------------------------------------------------------------
 * Tout ce qui identifie le studio est ici. Les champs vides sont affichés
 * comme « à venir » sur le site : remplissez-les dès que vous les avez.
 */
interface SiteInfo {
  name: string;
  tagline: string;
  url: string;
  locale: string;
  language: string;
  phone: string;
  whatsapp: string;
  email: string;
  bce: string;
  address: { street: string; postal: string; city: string };
  area: string;
  hours: string;
}

export const site: SiteInfo = {
  name: "StudioTwice",
  tagline: "Sites web pour commerces locaux et indépendants, en Belgique francophone",
  // TODO: domaine définitif (sans barre oblique finale).
  url: "https://studiotwice.example",
  locale: "fr-BE",
  language: "fr",

  // TODO: numéro de téléphone au format international, ex. "+32 470 00 00 00".
  phone: "",
  // TODO: numéro WhatsApp, chiffres seulement avec l'indicatif, ex. "32470000000".
  whatsapp: "",
  // TODO: adresse e-mail de contact publique.
  email: "",

  // TODO: numéro d'entreprise, ex. "BE 0123.456.789".
  bce: "",
  // TODO: adresse du siège (rue, code postal, ville).
  address: { street: "", postal: "", city: "" },
  /** Zone où l'on se déplace pour rencontrer les commerçants. */
  area: "Bruxelles et toute la Wallonie",
  // TODO: horaires de disponibilité, ex. "Du lundi au vendredi, 9 h à 18 h".
  hours: "",
};

/** « à venir » quand la valeur n'est pas encore renseignée. */
export const orSoon = (v: string) => (v.trim() ? v : "à venir");
