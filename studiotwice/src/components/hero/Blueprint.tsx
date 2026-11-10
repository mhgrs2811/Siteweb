/**
 * La feuille de croquis posée sur chaque plaque : trame de points, blocs au trait fin,
 * annotations, cotes, et le contour que la pointe lumineuse parcourt à l'arrivée.
 * Les coordonnées reprennent la mise en page de la page d'exemple (Demo).
 */
type Variant = "desk" | "phone";

interface Block {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  rx?: number;
  cross?: boolean;
}

const LAYOUT: Record<Variant, { w: number; h: number; r: number; fs: number; dim: string; blocks: Block[]; foot: number }> = {
  desk: {
    w: 1600,
    h: 1000,
    r: 56,
    fs: 26,
    dim: "1440 px",
    foot: 896,
    blocks: [
      { x: 80, y: 52, w: 1440, h: 48, label: "navigation" },
      { x: 80, y: 150, w: 704, h: 150, label: "titre" },
      { x: 80, y: 356, w: 576, h: 104, label: "texte" },
      { x: 856, y: 170, w: 664, h: 600, label: "photo", cross: true },
      { x: 80, y: 560, w: 320, h: 72, label: "bouton", rx: 36 },
    ],
  },
  phone: {
    w: 720,
    h: 1480,
    r: 64,
    fs: 34,
    dim: "390 px",
    foot: 1391,
    blocks: [
      { x: 48, y: 80, w: 624, h: 50, label: "navigation" },
      { x: 48, y: 196, w: 624, h: 130, label: "titre" },
      { x: 48, y: 430, w: 624, h: 150, label: "texte" },
      { x: 48, y: 636, w: 624, h: 533, label: "photo", cross: true },
      { x: 48, y: 1214, w: 624, h: 86, label: "bouton", rx: 43 },
    ],
  },
};

/** Courbe de la baguette cuivrée, du bas gauche au haut droit de la plaque. */
const filetPath = (w: number, h: number) =>
  `M${-0.04 * w} ${0.82 * h}C${0.28 * w} ${0.8 * h} ${0.5 * w} ${0.4 * h} ${1.04 * w} ${0.16 * h}`;

const roundedRectPath = (w: number, h: number, r: number) =>
  `M${r} 0H${w - r}A${r} ${r} 0 0 1 ${w} ${r}V${h - r}A${r} ${r} 0 0 1 ${w - r} ${h}H${r}A${r} ${r} 0 0 1 0 ${h - r}V${r}A${r} ${r} 0 0 1 ${r} 0Z`;

export default function Blueprint({ variant }: { variant: Variant }) {
  const L = LAYOUT[variant];
  const dotsId = `bp-dots-${variant}`;
  const dimY = -72;
  return (
    <svg className={`bp bp--${variant}`} viewBox={`0 0 ${L.w} ${L.h}`} overflow="visible" aria-hidden="true">
      <defs>
        <pattern id={dotsId} width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="1.6" fill="currentColor" />
        </pattern>
        <linearGradient id={`bp-copper-${variant}`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#b98a63" />
          <stop offset="0.45" stopColor="#f0d6bd" />
          <stop offset="0.6" stopColor="#d9b08a" />
          <stop offset="1" stopColor="#a97b57" />
        </linearGradient>
      </defs>

      {/* Trame de points, comme un papier technique */}
      <rect className="bp__dots" x="0" y="0" width={L.w} height={L.h} rx={L.r} fill={`url(#${dotsId})`} />

      {/* Cote de largeur, au-dessus de la plaque */}
      <g className="bp__dim">
        <line className="bp__line" x1="0" y1={dimY} x2={L.w} y2={dimY} pathLength={1} />
        <line className="bp__line" x1="0" y1={dimY - 14} x2="0" y2={dimY + 14} pathLength={1} />
        <line className="bp__line" x1={L.w} y1={dimY - 14} x2={L.w} y2={dimY + 14} pathLength={1} />
        <text x={L.w / 2} y={dimY - 22} textAnchor="middle" style={{ fontSize: L.fs + 4 }}>
          {L.dim}
        </text>
      </g>

      {/* Blocs de la page, au trait fin, avec leur nom */}
      <g className="bp__blocks">
        {L.blocks.map((b) => (
          <g key={b.label}>
            <rect className="bp__line" x={b.x} y={b.y} width={b.w} height={b.h} rx={b.rx ?? 0} pathLength={1} />
            {b.cross && (
              <>
                <line className="bp__line bp__line--soft" x1={b.x} y1={b.y} x2={b.x + b.w} y2={b.y + b.h} pathLength={1} />
                <line className="bp__line bp__line--soft" x1={b.x + b.w} y1={b.y} x2={b.x} y2={b.y + b.h} pathLength={1} />
              </>
            )}
          </g>
        ))}
        <line className="bp__line" x1={L.blocks[0].x} y1={L.foot} x2={L.blocks[0].x + L.blocks[0].w} y2={L.foot} pathLength={1} />
      </g>
      <g className="bp__labels" style={{ fontSize: L.fs }}>
        {L.blocks.map((b) => (
          <text key={b.label} x={b.x + 14} y={b.y - 12}>
            {b.label}
          </text>
        ))}
        <text x={L.blocks[0].x} y={L.foot + L.fs + 18}>
          pied de page
        </text>
      </g>

      {/* Baguette cuivrée, posée sur la plaque, qui s'efface quand la page prend vie */}
      <g className="bp__filet">
        <path className="bp__filet-shadow" d={filetPath(L.w, L.h)} pathLength={1} />
        <path className="bp__filet-line" d={filetPath(L.w, L.h)} pathLength={1} style={{ stroke: `url(#bp-copper-${variant})` }} />
      </g>

      {/* Contour : chemin que suit la pointe lumineuse */}
      <path className={`bp__outline bp__outline--${variant}`} d={roundedRectPath(L.w, L.h, L.r)} pathLength={1} />
      <g className={`bp__pen bp__pen--${variant}`}>
        <circle r="26" className="bp__pen-halo" />
        <circle r="7" className="bp__pen-dot" />
      </g>
    </svg>
  );
}
