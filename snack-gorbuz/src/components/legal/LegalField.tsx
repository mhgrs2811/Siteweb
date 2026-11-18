import { copy } from "@/data/copy";
import s from "./LegalField.module.css";

/** Ligne « intitulé : valeur » ; affiche « À compléter » si la donnée n’est pas fournie. */
export function LegalField({ label, value }: { label: string; value: string | null }) {
  return (
    <div className={s.field}>
      <dt>{label}</dt>
      <dd>{value ?? <span className={s.todo}>{copy.legal.toComplete}</span>}</dd>
    </div>
  );
}

export function DraftBanner() {
  return <p className={s.banner}>{copy.legal.draftBanner}</p>;
}
