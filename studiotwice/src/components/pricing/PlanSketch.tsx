/**
 * Le croquis de chaque formule, dans le même langage que le hero : des feuilles au trait fin,
 * une cote qui nomme ce qu'on obtient, et des éléments qui se « construisent » (photo, bouton,
 * module) quand la carte est choisie ou survolée, par la variable --fill.
 */
type Plan = "onepage" | "vitrine" | "custom";

/** Une feuille de site au trait : barre, titre, texte, photo, bouton. */
function Sheet({ x, y, w, h, detail = true, fill = true }: { x: number; y: number; w: number; h: number; detail?: boolean; fill?: boolean }) {
  const m = w * 0.1;
  const iw = w - 2 * m;
  const photoY = y + h * 0.42;
  const photoH = h * 0.3;
  const btnY = y + h * 0.8;
  return (
    <g>
      <rect className="pk__line" x={x} y={y} width={w} height={h} rx={w * 0.06} />
      {detail && (
        <>
          <line className="pk__line pk__line--soft" x1={x + m} y1={y + h * 0.12} x2={x + w - m} y2={y + h * 0.12} />
          <rect className="pk__line" x={x + m} y={y + h * 0.18} width={iw * 0.8} height={h * 0.09} />
          <rect className="pk__line pk__line--soft" x={x + m} y={y + h * 0.31} width={iw * 0.6} height={h * 0.05} />
          <rect className="pk__line" x={x + m} y={photoY} width={iw} height={photoH} />
          <line className="pk__line pk__line--soft" x1={x + m} y1={photoY} x2={x + m + iw} y2={photoY + photoH} />
          <line className="pk__line pk__line--soft" x1={x + m + iw} y1={photoY} x2={x + m} y2={photoY + photoH} />
          <rect className="pk__line" x={x + m} y={btnY} width={iw * 0.62} height={h * 0.09} rx={h * 0.045} />
          {fill && (
            <g className="pk__fill">
              <rect className="pk__photo" x={x + m} y={photoY} width={iw} height={photoH} />
              <rect className="pk__btn" x={x + m} y={btnY} width={iw * 0.62} height={h * 0.09} rx={h * 0.045} />
              <rect className="pk__ink" x={x + m} y={y + h * 0.18} width={iw * 0.8} height={h * 0.09} />
              <line className="pk__rule" x1={x + m} y1={y + h * 0.12} x2={x + w - m} y2={y + h * 0.12} />
            </g>
          )}
        </>
      )}
    </g>
  );
}

/** Une cote : trait, deux repères, étiquette au-dessus. */
function Dim({ x1, x2, y, label }: { x1: number; x2: number; y: number; label: string }) {
  return (
    <g className="pk__dim">
      <line className="pk__line" x1={x1} y1={y} x2={x2} y2={y} />
      <line className="pk__line" x1={x1} y1={y - 5} x2={x1} y2={y + 5} />
      <line className="pk__line" x1={x2} y1={y - 5} x2={x2} y2={y + 5} />
      <text x={(x1 + x2) / 2} y={y - 8} textAnchor="middle">
        {label}
      </text>
    </g>
  );
}

export default function PlanSketch({ plan }: { plan: Plan }) {
  return (
    <svg className={`pk pk--${plan}`} viewBox="0 0 320 190" aria-hidden="true">
      {plan === "onepage" && (
        <>
          <Sheet x={118} y={18} w={84} h={138} />
          <Dim x1={118} x2={202} y={172} label="1 page" />
        </>
      )}
      {plan === "vitrine" && (
        <>
          <g className="pk__fan">
            <Sheet x={176} y={14} w={76} h={112} detail={false} />
            <Sheet x={152} y={22} w={76} h={112} detail={false} />
            <Sheet x={128} y={30} w={76} h={112} detail={false} />
            <Sheet x={104} y={38} w={76} h={112} detail={false} />
          </g>
          <Sheet x={68} y={46} w={84} h={120} />
          <Dim x1={68} x2={252} y={182} label="5 à 7 pages" />
        </>
      )}
      {plan === "custom" && (
        <>
          <Sheet x={40} y={22} w={132} h={126} fill={false} />
          {/* Module de réservation : un calendrier qui se remplit */}
          <g className="pk__module">
            <rect className="pk__line" x={190} y={38} width={92} height={92} rx={6} />
            <line className="pk__line pk__line--soft" x1={190} y1={58} x2={282} y2={58} />
            {Array.from({ length: 12 }).map((_, i) => {
              const cx = 200 + (i % 4) * 22;
              const cy = 68 + Math.floor(i / 4) * 20;
              return <rect key={i} className="pk__line pk__line--soft" x={cx} y={cy} width={14} height={12} rx={2} />;
            })}
            <g className="pk__fill">
              <rect className="pk__btn" x={244} y={88} width={14} height={12} rx={2} />
              <rect className="pk__btn" x={200} y={112} width={82} height={12} rx={6} />
              <rect className="pk__photo" x={53} y={75} width={106} height={38} />
              <rect className="pk__ink" x={53} y={45} width={85} height={11} />
            </g>
          </g>
          <line className="pk__line pk__line--soft" x1={172} y1={84} x2={190} y2={84} />
          <Dim x1={40} x2={282} y={170} label="sur mesure" />
        </>
      )}
    </svg>
  );
}
