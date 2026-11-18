import type { FamilySlug } from "@/data/types";

interface FamilyGraphicProps {
  family: FamilySlug;
  className?: string;
  /** Identifiant unique pour les dégradés (évite les collisions quand plusieurs graphiques coexistent). */
  uid?: string;
}

/**
 * Interprétations graphiques stylisées des trois familles confirmées.
 * Décoratives : silhouettes et matières génériques, aucun ingrédient précis.
 * Couleurs issues des tokens de marque (beige = pain, ambre = frites, crème = papier, rouge = bande).
 */
export function FamilyGraphic({ family, className, uid = family }: FamilyGraphicProps) {
  const common = { className, "aria-hidden": true as const, focusable: "false" as const };

  if (family === "durums") {
    return (
      <svg viewBox="0 0 400 400" {...common}>
        <defs>
          <linearGradient id={`${uid}-bread`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e6c698" />
            <stop offset="0.6" stopColor="#d7b58b" />
            <stop offset="1" stopColor="#b8925f" />
          </linearGradient>
          <filter id={`${uid}-blur`} x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>
        <ellipse cx="205" cy="318" rx="150" ry="20" fill="#000" opacity="0.28" filter={`url(#${uid}-blur)`} />
        <g transform="rotate(-32 200 200)">
          <rect x="40" y="150" width="320" height="100" rx="50" fill={`url(#${uid}-bread)`} />
          <ellipse cx="335" cy="200" rx="22" ry="46" fill="#c69a66" />
          <ellipse cx="335" cy="200" rx="12" ry="30" fill="#b8895a" />
          <path d="M120 165 q40 -6 80 0 M110 235 q50 8 100 0" stroke="#b58c5c" strokeWidth="3" fill="none" opacity="0.6" strokeLinecap="round" />
          <rect x="30" y="140" width="180" height="120" rx="8" fill="#f4efe6" />
          <g stroke="#171717" strokeOpacity="0.1" strokeWidth="1.2">
            <path d="M46 140 L30 156 M86 140 L30 196 M126 140 L30 236 M166 140 L36 260 M206 140 L76 260 M210 176 L116 260 M210 216 L156 260" />
          </g>
          <rect x="88" y="140" width="46" height="120" fill="#d94b32" />
          <text
            x="111"
            y="202"
            textAnchor="middle"
            fill="#f4efe6"
            fontSize="30"
            letterSpacing="1"
            transform="rotate(-90 111 200)"
            style={{ fontFamily: "var(--font-display)", textTransform: "uppercase" }}
          >
            Gorbuz
          </text>
        </g>
      </svg>
    );
  }

  if (family === "kumpirs") {
    return (
      <svg viewBox="0 0 400 400" {...common}>
        <defs>
          <radialGradient id={`${uid}-skin`} cx="0.4" cy="0.3" r="0.8">
            <stop offset="0" stopColor="#a98258" />
            <stop offset="0.7" stopColor="#8a6746" />
            <stop offset="1" stopColor="#6b4f36" />
          </radialGradient>
          <radialGradient id={`${uid}-top`} cx="0.5" cy="0.35" r="0.7">
            <stop offset="0" stopColor="#f8f1df" />
            <stop offset="1" stopColor="#e7d9bc" />
          </radialGradient>
          <filter id={`${uid}-blur`} x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>
        <ellipse cx="200" cy="318" rx="140" ry="22" fill="#000" opacity="0.3" filter={`url(#${uid}-blur)`} />
        <ellipse cx="200" cy="292" rx="150" ry="24" fill="#d7b58b" />
        <ellipse cx="200" cy="286" rx="138" ry="16" fill="#c6a070" />
        <ellipse cx="200" cy="210" rx="135" ry="92" fill={`url(#${uid}-skin)`} />
        <g fill="#5e4430" opacity="0.5">
          <ellipse cx="120" cy="230" rx="5" ry="3" />
          <ellipse cx="290" cy="245" rx="4" ry="2.5" />
          <ellipse cx="250" cy="275" rx="4" ry="2.5" />
          <ellipse cx="150" cy="275" rx="3.5" ry="2" />
        </g>
        <path d="M86 196 Q200 150 314 196 Q310 206 200 176 Q90 206 86 196 Z" fill="#5e4430" opacity="0.55" />
        <ellipse cx="200" cy="186" rx="96" ry="34" fill={`url(#${uid}-top)`} />
        <ellipse cx="178" cy="178" rx="34" ry="12" fill="#fff" opacity="0.45" />
        <path d="M136 182 q20 -22 48 -10 M212 172 q26 -8 48 10" stroke="#d49a43" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.9" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 520 320" {...common}>
      <defs>
        <linearGradient id={`${uid}-bread`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e9cc9f" />
          <stop offset="0.65" stopColor="#d7b58b" />
          <stop offset="1" stopColor="#b48c5a" />
        </linearGradient>
        <linearGradient id={`${uid}-fry`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f0c66b" />
          <stop offset="1" stopColor="#d49a43" />
        </linearGradient>
        <filter id={`${uid}-blur`} x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>
      <ellipse cx="262" cy="282" rx="210" ry="18" fill="#000" opacity="0.3" filter={`url(#${uid}-blur)`} />
      {/* Frites, dessinées derrière le pain */}
      <g fill={`url(#${uid}-fry)`}>
        <rect x="150" y="60" width="18" height="150" rx="6" transform="rotate(-14 159 135)" />
        <rect x="190" y="38" width="18" height="170" rx="6" transform="rotate(-6 199 123)" />
        <rect x="232" y="30" width="18" height="180" rx="6" transform="rotate(2 241 120)" />
        <rect x="272" y="46" width="18" height="170" rx="6" transform="rotate(8 281 131)" />
        <rect x="312" y="68" width="18" height="150" rx="6" transform="rotate(16 321 143)" />
        <rect x="212" y="74" width="16" height="140" rx="6" transform="rotate(-20 220 144)" fill="#c88f3b" />
        <rect x="292" y="80" width="16" height="140" rx="6" transform="rotate(22 300 150)" fill="#c88f3b" />
      </g>
      {/* Pain : demi-baguette ouverte */}
      <path
        d="M40 200 Q40 150 100 146 L420 146 Q480 150 480 200 L480 214 Q480 258 430 258 L90 258 Q40 258 40 214 Z"
        fill={`url(#${uid}-bread)`}
      />
      <path d="M70 158 Q260 128 450 158 Q260 150 70 158 Z" fill="#8f6a44" opacity="0.6" />
      <path d="M96 188 q60 -8 120 0 M300 188 q60 -8 120 0" stroke="#b58c5c" strokeWidth="3" fill="none" opacity="0.55" strokeLinecap="round" />
      {/* Bande papier Gorbuz */}
      <rect x="352" y="138" width="92" height="128" rx="6" fill="#f4efe6" />
      <g stroke="#171717" strokeOpacity="0.1" strokeWidth="1.2">
        <path d="M368 138 L352 154 M408 138 L352 194 M444 142 L352 234 M444 182 L360 266 M444 222 L400 266" />
      </g>
      <rect x="352" y="186" width="92" height="30" fill="#d94b32" />
      <text
        x="398"
        y="208"
        textAnchor="middle"
        fill="#f4efe6"
        fontSize="22"
        letterSpacing="1.5"
        style={{ fontFamily: "var(--font-display)", textTransform: "uppercase" }}
      >
        Gorbuz
      </text>
    </svg>
  );
}
