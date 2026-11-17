import type { ReactNode } from "react";

interface SectionHeadProps {
  chapter: string;
  label: string;
  title: ReactNode;
  align?: "left" | "right";
  /** Niveau de titre : h2 par défaut. */
  as?: "h1" | "h2" | "h3";
  id?: string;
  className?: string;
  children?: ReactNode;
}

/**
 * En-tête de chapitre : numéro + étiquette + titre display.
 * Toutes les sections de l'accueil et des pages l'utilisent, avec des
 * alignements variés pour casser la répétition.
 */
export function SectionHead({
  chapter,
  label,
  title,
  align = "left",
  as: Tag = "h2",
  id,
  className,
  children,
}: SectionHeadProps) {
  return (
    <div
      className={["section-head", align === "right" ? "section-head--right" : "", className]
        .filter(Boolean)
        .join(" ")}
      data-reveal
    >
      <p className="section-head__top">
        <span className="label label--index" data-index={chapter}>
          {label}
        </span>
      </p>
      <Tag id={id} className={`display ${Tag === "h3" ? "h3" : "h2"} section-head__title`}>
        {title}
      </Tag>
      {children}
    </div>
  );
}
