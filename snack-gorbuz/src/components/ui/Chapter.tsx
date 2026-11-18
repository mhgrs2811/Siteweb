interface ChapterProps {
  number: string;
  label: string;
  className?: string;
}

/** Repère de chapitre éditorial : numéro en display, intitulé, filet. */
export function Chapter({ number, label, className }: ChapterProps) {
  return (
    <p className={["chapter", className].filter(Boolean).join(" ")}>
      <span className="chapter-num" aria-hidden="true">
        {number}
      </span>
      <span>{label}</span>
    </p>
  );
}
