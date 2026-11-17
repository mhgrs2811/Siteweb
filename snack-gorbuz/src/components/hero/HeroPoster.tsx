import styles from "./HeroPoster.module.css";

/**
 * Fallback graphique du hero : composition SVG originale, plate et assumée,
 * qui reprend les silhouettes de la scène 3D (plateau, durum, frites, kumpir)
 * dans la palette Gorbuz. Affichée sans WebGL, sur appareils faibles, et
 * pendant le chargement différé de la scène.
 */
export function HeroPoster({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 600"
      className={[styles.poster, className].filter(Boolean).join(" ")}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern id="gz-stripes" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
          <rect width="14" height="14" fill="#F4EFE6" />
          <rect width="1.5" height="14" fill="rgba(23,23,23,0.1)" />
        </pattern>
        <linearGradient id="gz-bread" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E6C8A1" />
          <stop offset="1" stopColor="#C89B68" />
        </linearGradient>
        <linearGradient id="gz-potato" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#B4875D" />
          <stop offset="1" stopColor="#7E5636" />
        </linearGradient>
        <radialGradient id="gz-shadow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="rgba(0,0,0,0.55)" />
          <stop offset="1" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>

      {/* ombre au sol */}
      <ellipse cx="300" cy="470" rx="250" ry="48" fill="url(#gz-shadow)" />

      {/* plateau en perspective */}
      <g transform="translate(300 400) skewX(-14) scale(1 0.62)">
        <rect x="-240" y="-120" width="480" height="240" rx="10" fill="#1F1D1B" />
        <rect x="-228" y="-108" width="456" height="216" rx="6" fill="none" stroke="#D49A43" strokeWidth="1.5" />
        <rect x="-212" y="-94" width="424" height="188" fill="url(#gz-stripes)" />
        <text
          x="0"
          y="18"
          textAnchor="middle"
          fontFamily="Anton, Impact, sans-serif"
          fontSize="92"
          fill="rgba(23,23,23,0.16)"
          letterSpacing="4"
        >
          GORBUZ
        </text>
        <circle cx="150" cy="-45" r="36" fill="none" stroke="#D94B32" strokeWidth="4" />
        <circle cx="150" cy="-45" r="26" fill="none" stroke="#D94B32" strokeWidth="2" strokeDasharray="3 5" />
        <text x="150" y="-32" textAnchor="middle" fontFamily="Anton, Impact, sans-serif" fontSize="34" fill="#D94B32">
          GZ
        </text>
      </g>

      {/* kumpir */}
      <g transform="translate(372 360)">
        <ellipse cx="0" cy="0" rx="92" ry="52" fill="url(#gz-potato)" />
        <ellipse cx="0" cy="-16" rx="62" ry="20" fill="#F4EFE6" />
        <ellipse cx="0" cy="-20" rx="62" ry="14" fill="#FBF8F2" />
        <circle cx="18" cy="-24" r="9" fill="#D94B32" />
        <circle cx="-22" cy="-22" r="7" fill="#D49A43" />
        <circle cx="-50" cy="12" r="1.8" fill="rgba(60,35,15,0.5)" />
        <circle cx="40" cy="22" r="1.8" fill="rgba(60,35,15,0.5)" />
        <circle cx="-10" cy="30" r="1.8" fill="rgba(60,35,15,0.5)" />
      </g>

      {/* cornet de frites */}
      <g transform="translate(460 255)">
        {[
          [-26, -112, -14],
          [-10, -126, -4],
          [8, -122, 6],
          [24, -108, 16],
          [-2, -138, 1],
          [-36, -98, -22],
          [38, -96, 24],
        ].map(([x, y, r], i) => (
          <rect
            key={i}
            x={(x ?? 0) - 7}
            y={y ?? 0}
            width="14"
            height="130"
            rx="3"
            fill={i % 3 === 0 ? "#CF9339" : "#E6B35A"}
            transform={`rotate(${r ?? 0} ${x ?? 0} ${(y ?? 0) + 130})`}
          />
        ))}
        <path d="M-56 -20 L56 -20 L40 90 L-40 90 Z" fill="#D94B32" />
        <path d="M-56 -20 L56 -20 L53 2 L-53 2 Z" fill="#F4EFE6" />
        <path d="M-56 -20 L56 -20 L55 -14 L-55 -14 Z" fill="#B73B25" />
      </g>

      {/* durum roulé */}
      <g transform="translate(200 330) rotate(-34)">
        <rect x="-150" y="-42" width="300" height="84" rx="42" fill="url(#gz-bread)" />
        <path d="M-60 -41 Q-40 0 -60 41" stroke="#A97744" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M-10 -41 Q10 0 -10 41" stroke="#A97744" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M40 -41 Q60 0 40 41" stroke="#A97744" strokeWidth="3" fill="none" strokeLinecap="round" />
        <rect x="-160" y="-48" width="130" height="96" rx="8" fill="url(#gz-stripes)" stroke="rgba(23,23,23,0.2)" />
        <rect x="-160" y="22" width="130" height="14" fill="#D94B32" />
        <text
          x="-95"
          y="8"
          textAnchor="middle"
          fontFamily="Anton, Impact, sans-serif"
          fontSize="30"
          fill="#171717"
          letterSpacing="2"
        >
          GORBUZ
        </text>
      </g>

      {/* touches de sauce */}
      <ellipse cx="520" cy="420" rx="16" ry="7" fill="#D94B32" />
      <ellipse cx="118" cy="430" rx="14" ry="6" fill="#D49A43" />

      {/* ticket */}
      <g transform="translate(110 395) skewX(-14) scale(1 0.62)">
        <rect x="-36" y="-22" width="72" height="44" fill="#F4EFE6" />
        <rect x="-30" y="-16" width="16" height="16" fill="#D94B32" />
        <rect x="-8" y="-14" width="30" height="3" fill="#2a2825" />
        <rect x="-8" y="-6" width="24" height="3" fill="#2a2825" />
        <rect x="-8" y="2" width="18" height="3" fill="#2a2825" />
      </g>
    </svg>
  );
}
