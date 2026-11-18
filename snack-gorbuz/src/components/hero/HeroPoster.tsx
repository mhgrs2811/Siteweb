/**
 * Poster de secours du hero : la même nature morte stylisée (durum emballé, frites,
 * kumpir, plateau Gorbuz) en SVG plat. Affiché au premier rendu, sur mobile, sans WebGL
 * et quand la scène 3D n’est pas disponible. Décoratif, aucun ingrédient précis.
 */
export function HeroPoster({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 640 560" className={className} aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="hp-light" cx="0.42" cy="0.55" r="0.6">
          <stop offset="0" stopColor="#d49a43" stopOpacity="0.22" />
          <stop offset="1" stopColor="#d49a43" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hp-bread" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e8c99c" />
          <stop offset="0.6" stopColor="#d7b58b" />
          <stop offset="1" stopColor="#b48c5a" />
        </linearGradient>
        <radialGradient id="hp-skin" cx="0.4" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#a98258" />
          <stop offset="0.7" stopColor="#8a6746" />
          <stop offset="1" stopColor="#6b4f36" />
        </radialGradient>
        <radialGradient id="hp-top" cx="0.5" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#f8f1df" />
          <stop offset="1" stopColor="#e7d9bc" />
        </radialGradient>
        <linearGradient id="hp-fry" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f0c66b" />
          <stop offset="1" stopColor="#d49a43" />
        </linearGradient>
        <linearGradient id="hp-tray" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a3029" />
          <stop offset="1" stopColor="#241e1a" />
        </linearGradient>
        <filter id="hp-blur" x="-20%" y="-60%" width="140%" height="220%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <filter id="hp-blur-s" x="-20%" y="-60%" width="140%" height="220%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* Lumière chaude */}
      <ellipse cx="300" cy="330" rx="330" ry="260" fill="url(#hp-light)" />

      {/* Ombre au sol et plateau */}
      <ellipse cx="320" cy="500" rx="270" ry="30" fill="#000" opacity="0.5" filter="url(#hp-blur)" />
      <path d="M92 404 L560 404 Q592 404 584 428 L566 484 Q560 500 540 500 L60 500 Q42 500 48 482 L70 426 Q78 404 92 404 Z" fill="url(#hp-tray)" />
      <path d="M100 414 L552 414 Q572 414 566 432 L553 470 Q549 480 536 480 L76 480 Q62 480 67 466 L82 430 Q88 414 100 414 Z" fill="#f4efe6" />
      <g stroke="#171717" strokeOpacity="0.08" strokeWidth="1.2">
        <path d="M120 414 L96 480 M160 414 L136 480 M200 414 L176 480 M240 414 L216 480 M280 414 L256 480 M320 414 L296 480 M360 414 L336 480 M400 414 L376 480 M440 414 L416 480 M480 414 L456 480 M520 414 L496 480" />
      </g>
      <path d="M60 500 L540 500 Q560 500 566 484 L560 492 Q556 508 538 508 L58 508 Q40 508 46 492 Z" fill="#d94b32" />
      <text x="118" y="466" fill="#d94b32" fontSize="26" letterSpacing="2" transform="rotate(-2 118 466)" style={{ fontFamily: "var(--font-display)", textTransform: "uppercase" }}>
        Gorbuz
      </text>

      {/* Kumpir (arrière droit) */}
      <ellipse cx="452" cy="396" rx="104" ry="18" fill="#000" opacity="0.35" filter="url(#hp-blur-s)" />
      <ellipse cx="452" cy="392" rx="112" ry="18" fill="#d7b58b" />
      <ellipse cx="452" cy="388" rx="102" ry="12" fill="#c6a070" />
      <ellipse cx="452" cy="330" rx="100" ry="68" fill="url(#hp-skin)" />
      <path d="M368 318 Q452 284 536 318 Q532 326 452 304 Q372 326 368 318 Z" fill="#5e4430" opacity="0.55" />
      <ellipse cx="452" cy="312" rx="70" ry="25" fill="url(#hp-top)" />
      <ellipse cx="436" cy="306" rx="24" ry="8" fill="#fff" opacity="0.45" />
      <path d="M404 310 q16 -16 36 -8 M460 302 q20 -6 36 8" stroke="#d49a43" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.9" />

      {/* Frites et boîte (arrière gauche) */}
      <g fill="url(#hp-fry)">
        <rect x="152" y="178" width="17" height="150" rx="6" transform="rotate(-16 160 253)" />
        <rect x="186" y="156" width="17" height="170" rx="6" transform="rotate(-7 194 241)" />
        <rect x="222" y="150" width="17" height="180" rx="6" transform="rotate(1 230 240)" />
        <rect x="256" y="162" width="17" height="170" rx="6" transform="rotate(8 264 247)" />
        <rect x="290" y="186" width="17" height="150" rx="6" transform="rotate(17 298 261)" />
        <rect x="206" y="196" width="15" height="140" rx="6" transform="rotate(-22 213 266)" fill="#c88f3b" />
        <rect x="270" y="200" width="15" height="140" rx="6" transform="rotate(24 277 270)" fill="#c88f3b" />
      </g>
      <polygon points="150,296 304,296 292,420 162,420" fill="#f4efe6" />
      <polygon points="150,296 162,420 136,412 128,300" fill="#ddd3c0" />
      <polygon points="148,316 306,316 304,340 150,340" fill="#d94b32" />
      <text x="227" y="335" textAnchor="middle" fill="#f4efe6" fontSize="18" letterSpacing="2" style={{ fontFamily: "var(--font-display)", textTransform: "uppercase" }}>
        Gorbuz
      </text>

      {/* Durum emballé (avant) */}
      <ellipse cx="330" cy="446" rx="190" ry="20" fill="#000" opacity="0.4" filter="url(#hp-blur-s)" />
      <g transform="rotate(-24 330 400)">
        <rect x="150" y="350" width="360" height="104" rx="52" fill="url(#hp-bread)" />
        <ellipse cx="484" cy="402" rx="24" ry="48" fill="#c69a66" />
        <ellipse cx="484" cy="402" rx="13" ry="32" fill="#b2855a" />
        <path d="M250 366 q50 -8 100 0 M240 440 q60 10 120 0" stroke="#b58c5c" strokeWidth="3" fill="none" opacity="0.6" strokeLinecap="round" />
        <rect x="140" y="340" width="200" height="124" rx="8" fill="#f4efe6" />
        <g stroke="#171717" strokeOpacity="0.1" strokeWidth="1.2">
          <path d="M156 340 L140 356 M196 340 L140 396 M236 340 L140 436 M276 340 L146 464 M316 340 L186 464 M340 356 L232 464 M340 396 L272 464 M340 436 L312 464" />
        </g>
        <rect x="206" y="340" width="48" height="124" fill="#d94b32" />
        <text x="230" y="402" textAnchor="middle" fill="#f4efe6" fontSize="31" letterSpacing="1" transform="rotate(-90 230 402)" style={{ fontFamily: "var(--font-display)", textTransform: "uppercase" }}>
          Gorbuz
        </text>
      </g>

      {/* Petit pot (avant gauche) */}
      <ellipse cx="128" cy="470" rx="34" ry="8" fill="#000" opacity="0.35" filter="url(#hp-blur-s)" />
      <rect x="102" y="432" width="52" height="36" rx="6" fill="#f4efe6" />
      <ellipse cx="128" cy="432" rx="26" ry="9" fill="#d49a43" />
      <ellipse cx="122" cy="430" rx="10" ry="3" fill="#fff" opacity="0.35" />
    </svg>
  );
}
