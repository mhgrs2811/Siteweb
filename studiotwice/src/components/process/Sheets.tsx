import { heroCopy } from "@/content/hero";

const d = heroCopy.demo;

/** Feuille 1 : le compte rendu de la visite, rempli à la main sur place. */
export function SheetVisite() {
  const rows: Array<[string, string]> = [
    ["Commerce", "Brasserie, 40 couverts"],
    ["Horaires", "Mar. à sam., midi et soir"],
    ["Ce qui marche déjà", "Le bouche-à-oreille, la terrasse"],
    ["Ce qu’il manque", "Réserver sans appeler"],
    ["Photos", "12 à prendre, 4 réutilisables"],
  ];
  return (
    <div className="ps ps--visite" aria-hidden="true">
      <p className="ps__cap">Compte rendu de visite</p>
      <dl className="ps__rows">
        {rows.map(([k, v]) => (
          <div key={k} className="ps__row">
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      <p className="ps__total">
        <span>Estimation</span>
        <b>1 890 € HTVA</b>
      </p>
    </div>
  );
}

/** Feuille 2 : la maquette, en gris, avant la couleur et la photo. */
export function SheetMaquette() {
  return (
    <div className="ps ps--maquette" aria-hidden="true">
      <p className="ps__cap">Maquette, page d’accueil</p>
      <div className="mini">
        <div className="mini__nav">
          <b>{d.name}</b>
          <span>{d.links[1]}</span>
        </div>
        <p className="mini__title">{d.title}</p>
        <p className="mini__para">{d.para}</p>
        <div className="mini__photo">
          <span>{d.photo}</span>
        </div>
        <div className="mini__cta">{d.cta}</div>
      </div>
      <p className="ps__note">Version 2, après vos remarques</p>
    </div>
  );
}

/** Feuille 3 : la mise en ligne, une adresse et une fiche Google remplies. */
export function SheetEnLigne() {
  return (
    <div className="ps ps--enligne" aria-hidden="true">
      <p className="ps__cap">Mise en ligne</p>
      <div className="url">
        <i />
        <i />
        <i />
        <span className="url__bar">
          <span className="url__dot" />
          {d.url}
        </span>
      </div>
      <ul className="checks">
        <li>Nom de domaine réservé à votre nom</li>
        <li>Hébergement et sauvegardes</li>
        <li>Fiche Google Business remplie</li>
        <li>Vérifié ensemble sur votre téléphone</li>
      </ul>
    </div>
  );
}

/** Feuille 4 : le suivi, un échange de messages comme on en aura. */
export function SheetSuivi() {
  return (
    <div className="ps ps--suivi" aria-hidden="true">
      <p className="ps__cap">Suivi</p>
      <div className="chat">
        <p className="chat__msg chat__msg--them">Bonjour, on passe à la carte d’hiver lundi. Je vous envoie la nouvelle carte en photo ?</p>
        <p className="chat__msg chat__msg--us">Parfait, envoyez-la. Je la mets en ligne et je vous préviens.</p>
        <p className="chat__msg chat__msg--us">C’est en ligne. Les horaires de décembre sont à jour aussi.</p>
      </div>
    </div>
  );
}

export const sheetFor = (id: string) => {
  switch (id) {
    case "visite":
      return <SheetVisite />;
    case "maquette":
      return <SheetMaquette />;
    case "enligne":
      return <SheetEnLigne />;
    default:
      return <SheetSuivi />;
  }
};
