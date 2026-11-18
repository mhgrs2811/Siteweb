import { Fragment, type ReactNode } from "react";

/** Découpe un texte en mots masqués (pour <Reveal mode="words">). */
export function SplitWords({ text, className }: { text: string; className?: string }) {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className={`split-word ${className ?? ""}`}>
            <span>{w}</span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}

/** Une ligne masquée (pour <Reveal mode="lines">). */
export function Line({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={`split-line ${className ?? ""}`}>
      <span>{children}</span>
    </span>
  );
}
