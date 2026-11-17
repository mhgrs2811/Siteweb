import type { SVGProps } from "react";

/**
 * Jeu d'icônes unique, au trait fin (1.75), dessiné pour Snack Gorbuz.
 * Pas d'emoji, pas de bibliothèque externe : quelques pictos suffisent.
 */

type IconProps = SVGProps<SVGSVGElement> & { title?: string };

const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

export const ArrowRight = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
);

export const ArrowUpRight = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

export const ArrowDown = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 4v15M6 13l6 6 6-6" />
  </svg>
);

export const Close = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const Pin = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 21s-6-5.3-6-11a6 6 0 1 1 12 0c0 5.7-6 11-6 11Z" />
    <circle cx="12" cy="10" r="2.25" />
  </svg>
);

export const Clock = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

export const Phone = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M5.5 4h3l1.5 4-2 1.5a10 10 0 0 0 6.5 6.5L16 14l4 1.5v3a1.5 1.5 0 0 1-1.6 1.5A15.5 15.5 0 0 1 4 5.6 1.5 1.5 0 0 1 5.5 4Z" />
  </svg>
);

export const Mail = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);

export const Image = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="3.5" y="4.5" width="17" height="15" rx="1.5" />
    <path d="m4 17 5-5 4 4 3-3 4 4" />
    <circle cx="15.5" cy="9" r="1.5" />
  </svg>
);

export const Chevron = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="m9 6 6 6-6 6" />
  </svg>
);

/* Réseaux sociaux — formes génériques, trait fin */
export const Instagram = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
    <circle cx="12" cy="12" r="3.75" />
    <circle cx="17" cy="7" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

export const Facebook = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M14 8.5V7a1.5 1.5 0 0 1 1.5-1.5H17V3h-2.5A4 4 0 0 0 10.5 7v1.5H8V12h2.5v9H14v-9h2.5l.5-3.5h-3Z" />
  </svg>
);

export const TikTok = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3a5 5 0 0 0 5 5" />
  </svg>
);

export const Globe = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17M12 3.5c2.5 2.5 3.5 5.5 3.5 8.5s-1 6-3.5 8.5c-2.5-2.5-3.5-5.5-3.5-8.5s1-6 3.5-8.5Z" />
  </svg>
);

/* ---- Glyphes de familles (originaux, décoratifs) ---------------------- */

export const GlyphDurum = (p: IconProps) => (
  <svg {...base} viewBox="0 0 48 48" strokeWidth={1.5} {...p}>
    <path d="M9 33 31 11a6 6 0 0 1 8.5 8.5L17.5 41.5A6 6 0 0 1 9 33Z" />
    <path d="M14 28c3 1 5 3 6 6M20 22c3 1 5 3 6 6M26 16c3 1 5 3 6 6" />
    <path d="M9 33c-1-4 0-7 3-10" />
  </svg>
);

export const GlyphKumpir = (p: IconProps) => (
  <svg {...base} viewBox="0 0 48 48" strokeWidth={1.5} {...p}>
    <ellipse cx="24" cy="27" rx="17" ry="12" />
    <path d="M12 24c3-4 7-6 12-6s9 2 12 6" />
    <path d="M16 23c2 2 4 3 8 3s6-1 8-3" />
    <circle cx="14" cy="32" r="0.8" fill="currentColor" stroke="none" />
    <circle cx="33" cy="33" r="0.8" fill="currentColor" stroke="none" />
    <circle cx="25" cy="36" r="0.8" fill="currentColor" stroke="none" />
  </svg>
);

export const GlyphMitraillette = (p: IconProps) => (
  <svg {...base} viewBox="0 0 48 48" strokeWidth={1.5} {...p}>
    <path d="M6 30c0-6 8-10 18-10s18 4 18 10-8 10-18 10S6 36 6 30Z" />
    <path d="M8 27c4-3 9-4 16-4s12 1 16 4" />
    <path d="m18 23 2-11M24 22V9M30 23l-2-11M36 25l4-9M12 25 8 16" />
  </svg>
);

export const familyGlyphs = {
  durums: GlyphDurum,
  kumpirs: GlyphKumpir,
  mitraillettes: GlyphMitraillette,
} as const;
