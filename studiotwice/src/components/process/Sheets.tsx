import type { CSSProperties } from "react";
import { heroCopy } from "@/content/hero";
import { pricing } from "@/content/pricing";
import { formatEuro } from "@/lib/estimate";

const d = heroCopy.demo;

/** Seuil de révélation d'un élément dans la feuille (0 à 1 de la progression de l'étape). */
const at = (v: number) => ({ "--at": v }) as CSSProperties;

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
        {rows.map(([k, v], i) => (
          <div key={k} className="ps__row rv" style={at(0.04 + i * 0.15)}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      <p className="ps__total rv" style={at(0.82)}>
        <span>{pricing.showPrices ? "Estimation" : "Devis"}</span>
        <b>{pricing.showPrices ? `${formatEuro(pricing.sites[1].from)} ${pricing.vat}` : "envoyé après la visite"}</b>
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
        <div className="mini__nav rv" style={at(0.04)}>
          <b>{d.name}</b>
          <span>{d.links[1]}</span>
        </div>
        <p className="mini__title rv" style={at(0.22)}>
          {d.title}
        </p>
        <p className="mini__para rv" style={at(0.4)}>
          {d.para}
        </p>
        <div className="mini__photo rv" style={at(0.56)}>
          <span>{d.photo}</span>
        </div>
        <div className="mini__cta rv" style={at(0.72)}>
          {d.cta}
        </div>
      </div>
      <p className="ps__note rv" style={at(0.88)}>
        Version 2, après vos remarques
      </p>
    </div>
  );
}

/** Feuille 3 : la mise en ligne, une adresse et une fiche Google remplies. */
export function SheetEnLigne() {
  const checks = [
    "Nom de domaine réservé à votre nom",
    "Hébergement et sauvegardes",
    "Fiche Google Business remplie",
    "Vérifié ensemble sur votre téléphone",
  ];
  return (
    <div className="ps ps--enligne" aria-hidden="true">
      <p className="ps__cap">Mise en ligne</p>
      <div className="url">
        <i />
        <i />
        <i />
        <span className="url__bar">
          <span className="url__dot rv" style={at(0.3)} />
          <span className="url__text rv rv--wipe" style={at(0.02)}>
            {d.url}
          </span>
        </span>
      </div>
      <ul className="checks">
        {checks.map((c, i) => (
          <li key={c} className="rv" style={at(0.42 + i * 0.14)}>
            {c}
          </li>
        ))}
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
        <p className="chat__msg chat__msg--them rv" style={at(0.06)}>
          Bonjour, on passe à la carte d’hiver lundi. Je vous envoie la nouvelle carte en photo ?
        </p>
        <p className="chat__msg chat__msg--us rv" style={at(0.42)}>
          Parfait, envoyez-la. Je la mets en ligne et je vous préviens.
        </p>
        <p className="chat__msg chat__msg--us rv" style={at(0.76)}>
          C’est en ligne. Les horaires de décembre sont à jour aussi.
        </p>
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
