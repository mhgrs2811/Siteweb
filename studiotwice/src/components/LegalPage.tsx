import Link from "next/link";
import Arrow from "@/components/Arrow";
import DayMode from "@/components/DayMode";

/** Gabarit des pages légales : une colonne de texte, lisible, sans effets. */
export default function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <main className="legal">
      <DayMode />
      <div className="legal__inner">
        <Link className="link legal__back" href="/">
          <Arrow className="link__arrow link__arrow--back" />
          Retour au site
        </Link>
        <h1 className="t-display legal__title">{title}</h1>
        <p className="legal__updated t-caption">Dernière mise à jour : {updated}</p>
        <div className="legal__body">{children}</div>
      </div>
    </main>
  );
}
