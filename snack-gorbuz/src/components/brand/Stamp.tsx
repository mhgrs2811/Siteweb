import type { SVGProps } from "react";

/** Marque « G » dans un cercle : repère minimal réutilisable (favicon, coins, étiquettes). */
export function StampMark({ className, ...rest }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false" {...rest}>
      <circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="32" cy="32" r="24.5" fill="none" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2 3" />
      <text
        x="32"
        y="44"
        textAnchor="middle"
        fontSize="34"
        fill="currentColor"
        style={{ fontFamily: "var(--font-display)" }}
      >
        G
      </text>
    </svg>
  );
}

interface StampProps extends SVGProps<SVGSVGElement> {
  /** Texte circulaire ; répété deux fois. */
  ring?: string;
}

/** Tampon rond complet : texte circulaire + « G » central. Décoratif. */
export function Stamp({ className, ring = "Snack Gorbuz — Belgique — Street-food — ", ...rest }: StampProps) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" focusable="false" {...rest}>
      <defs>
        <path id="stamp-ring" d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0" />
      </defs>
      <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="100" cy="100" r="52" fill="none" stroke="currentColor" strokeWidth="1.25" />
      <text
        fill="currentColor"
        fontSize="19"
        letterSpacing="2.5"
        style={{ fontFamily: "var(--font-display)", textTransform: "uppercase" }}
      >
        <textPath href="#stamp-ring" startOffset="0" textLength="450" lengthAdjust="spacingAndGlyphs">
          {ring.toUpperCase()}
        </textPath>
      </text>
      <text
        x="100"
        y="126"
        textAnchor="middle"
        fontSize="72"
        fill="currentColor"
        style={{ fontFamily: "var(--font-display)" }}
      >
        G
      </text>
    </svg>
  );
}
