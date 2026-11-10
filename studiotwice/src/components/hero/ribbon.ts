/**
 * Ruban de lumière : le trait qui « dessine » la page au passage.
 * Dessiné en 2D derrière la scène, très peu coûteux.
 */
interface Pt {
  x: number;
  y: number;
}

function bezier(p0: Pt, p1: Pt, p2: Pt, p3: Pt, u: number): Pt {
  const v = 1 - u;
  return {
    x: v * v * v * p0.x + 3 * v * v * u * p1.x + 3 * v * u * u * p2.x + u * u * u * p3.x,
    y: v * v * v * p0.y + 3 * v * v * u * p1.y + 3 * v * u * u * p2.y + u * u * u * p3.y,
  };
}

export function drawRibbon(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  p: number,
  t: number,
  dayT: number,
  compact = false,
) {
  ctx.clearRect(0, 0, w, h);
  // La courbe traverse tout le hero : elle entre hors écran en bas à gauche, passe derrière
  // les plaques et ressort hors écran en haut à droite. Jamais de bord visible.
  const wob = Math.sin(t * 0.35) * 0.02 * h;
  const p0 = compact ? { x: -0.3 * w, y: 1.06 * h + wob } : { x: -0.05 * w, y: 1.15 * h + wob };
  const p1 = compact ? { x: 0.35 * w, y: 1.0 * h - wob } : { x: 0.42 * w, y: 1.0 * h - wob };
  const p2 = compact ? { x: 0.7 * w, y: 0.42 * h + wob } : { x: 0.68 * w, y: 0.0 * h + wob };
  const p3 = compact ? { x: 1.3 * w, y: 0.6 * h } : { x: 1.12 * w, y: 0.2 * h };

  const head = Math.min(1, 0.4 + p * 0.72);
  const tail = Math.max(0, head - 0.82);
  const steps = 90;
  const pts: Pt[] = [];
  for (let i = 0; i <= steps; i++) {
    const u = tail + (head - tail) * (i / steps);
    pts.push(bezier(p0, p1, p2, p3, u));
  }
  const a = pts[0];
  const b = pts[pts.length - 1];
  const alphaMul = 1 - 0.78 * dayT;
  const color = dayT < 0.5 ? "242,244,246" : "255,255,255";

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.globalCompositeOperation = dayT < 0.5 ? "lighter" : "source-over";
  // Halo obtenu par superposition de traits de largeur décroissante : aucun flou, donc peu coûteux.
  const k = compact ? 0.6 : 1;
  const passes: Array<[number, number]> = [
    [140 * k, 0.014],
    [104 * k, 0.022],
    [72 * k, 0.034],
    [46 * k, 0.055],
    [26 * k, 0.09],
    [12 * k, 0.2],
    [2.2, 0.9],
  ];
  ctx.shadowBlur = 0;
  for (const [lw, alpha] of passes) {
    const g = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
    g.addColorStop(0, `rgba(${color},0)`);
    g.addColorStop(0.55, `rgba(${color},${alpha * alphaMul})`);
    g.addColorStop(1, `rgba(${color},${alpha * alphaMul})`);
    ctx.strokeStyle = g;
    ctx.lineWidth = lw;
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.stroke();
  }
  // Pointe lumineuse
  ctx.fillStyle = `rgba(${color},${0.95 * alphaMul})`;
  ctx.beginPath();
  ctx.arc(b.x, b.y, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
