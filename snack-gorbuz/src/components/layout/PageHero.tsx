import type { ReactNode } from "react";
import { Chapter } from "@/components/ui/Chapter";
import s from "./PageHero.module.css";

interface PageHeroProps {
  tone: "dark" | "light";
  label: string;
  number: string;
  title: string;
  lead?: string;
  /** Mot fantôme décoratif en arrière-plan. */
  ghost?: string;
  aside?: ReactNode;
}

/** En-tête éditorial des pages intérieures : H1 unique + chapô + repère de section. */
export function PageHero({ tone, label, number, title, lead, ghost, aside }: PageHeroProps) {
  return (
    <section className={`tone-${tone} ${s.hero}`} aria-labelledby="page-title">
      {ghost && (
        <div className={`ghost ${s.ghost}`} aria-hidden="true">
          {ghost}
        </div>
      )}
      <div className={`container ${s.grid}`}>
        <div className={s.head}>
          <Chapter number={number} label={label} />
          <h1 id="page-title" className="display display-xl">
            {title}
          </h1>
        </div>
        {lead && <p className={`lead ${s.lead}`}>{lead}</p>}
        {aside && <div className={s.aside}>{aside}</div>}
      </div>
    </section>
  );
}
