import * as THREE from "three";

/**
 * Textures procédurales dessinées sur canvas au montage de la scène.
 * Aucune image externe : tout est généré côté client, dans la palette Gorbuz.
 */

const CREAM = "#F4EFE6";
const RED = "#D94B32";

function makeCanvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D indisponible");
  return { c, ctx };
}

function toTexture(c: HTMLCanvasElement, repeat = false) {
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  if (repeat) {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  }
  tex.needsUpdate = true;
  return tex;
}

/** Papier d'emballage : crème, rayures fines, wordmark répété, tampon rouge. */
export function drawPaper(c: HTMLCanvasElement, fontReady: boolean) {
  const ctx = c.getContext("2d");
  if (!ctx) return;
  const { width: w, height: h } = c;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = CREAM;
  ctx.fillRect(0, 0, w, h);

  // rayures diagonales
  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.rotate(-Math.PI / 4);
  ctx.strokeStyle = "rgba(23,23,23,0.085)";
  ctx.lineWidth = 3;
  const span = Math.max(w, h) * 1.5;
  for (let x = -span; x < span; x += 42) {
    ctx.beginPath();
    ctx.moveTo(x, -span);
    ctx.lineTo(x, span);
    ctx.stroke();
  }
  ctx.restore();

  // wordmark répété en diagonale, très léger
  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.rotate(-0.22);
  ctx.fillStyle = "rgba(23,23,23,0.16)";
  ctx.font = `400 ${Math.round(h * 0.16)}px ${fontReady ? "Anton" : "Impact"}, Impact, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const step = h * 0.24;
  for (let row = -3; row <= 3; row++) {
    const offset = row % 2 === 0 ? 0 : w * 0.28;
    for (let col = -2; col <= 2; col++) {
      ctx.fillText("GORBUZ", col * w * 0.56 + offset, row * step);
    }
  }
  ctx.restore();

  // tampon rouge
  const sx = w * 0.78;
  const sy = h * 0.3;
  const r = h * 0.17;
  ctx.save();
  ctx.translate(sx, sy);
  ctx.rotate(0.25);
  ctx.strokeStyle = RED;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([4, 6]);
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.72, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = RED;
  ctx.font = `400 ${Math.round(r * 0.75)}px ${fontReady ? "Anton" : "Impact"}, Impact, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("GZ", 0, 2);
  ctx.font = `800 ${Math.round(r * 0.19)}px "Manrope Variable", system-ui, sans-serif`;
  const label = "SNACK · GORBUZ · STREET-FOOD · ";
  const chars = label.repeat(2);
  const radius = r * 0.86;
  for (let i = 0; i < chars.length; i++) {
    const a = (i / chars.length) * Math.PI * 2 - Math.PI / 2;
    ctx.save();
    ctx.translate(Math.cos(a) * radius, Math.sin(a) * radius);
    ctx.rotate(a + Math.PI / 2);
    ctx.fillText(chars[i] ?? "", 0, 0);
    ctx.restore();
  }
  ctx.restore();

  // ligne pointillée façon ticket
  ctx.strokeStyle = "rgba(23,23,23,0.35)";
  ctx.setLineDash([10, 10]);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(w * 0.06, h * 0.9);
  ctx.lineTo(w * 0.94, h * 0.9);
  ctx.stroke();
  ctx.setLineDash([]);
}

export function makePaperTexture() {
  const { c } = makeCanvas(1024, 640);
  drawPaper(c, false);
  const tex = toTexture(c);
  // Redessine avec la vraie display quand elle est disponible.
  if (typeof document !== "undefined" && "fonts" in document) {
    document.fonts
      .load("400 64px Anton")
      .then(() => {
        drawPaper(c, true);
        tex.needsUpdate = true;
      })
      .catch(() => undefined);
  }
  return tex;
}

/** Pain : beige, grain fin, zones légèrement dorées. */
export function makeBreadTexture() {
  const { c, ctx } = makeCanvas(512, 512);
  ctx.fillStyle = "#DDBE95";
  ctx.fillRect(0, 0, 512, 512);
  // taches dorées
  for (let i = 0; i < 26; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = 40 + Math.random() * 90;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, "rgba(176,128,78,0.55)");
    g.addColorStop(1, "rgba(176,128,78,0)");
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  // grain
  for (let i = 0; i < 9000; i++) {
    const v = Math.random();
    ctx.fillStyle = v > 0.5 ? "rgba(255,240,215,0.18)" : "rgba(90,60,30,0.14)";
    ctx.fillRect(Math.random() * 512, Math.random() * 512, 1.5, 1.5);
  }
  return toTexture(c, true);
}

/** Peau de pomme de terre : brun chaud, piqué. */
export function makePotatoTexture() {
  const { c, ctx } = makeCanvas(512, 512);
  ctx.fillStyle = "#A97A52";
  ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = 50 + Math.random() * 110;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, "rgba(120,80,48,0.45)");
    g.addColorStop(1, "rgba(120,80,48,0)");
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  for (let i = 0; i < 400; i++) {
    ctx.fillStyle = "rgba(70,45,25,0.35)";
    ctx.beginPath();
    ctx.ellipse(Math.random() * 512, Math.random() * 512, 1.5 + Math.random() * 2, 1 + Math.random(), Math.random() * 3, 0, Math.PI * 2);
    ctx.fill();
  }
  for (let i = 0; i < 7000; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? "rgba(255,220,180,0.12)" : "rgba(60,35,15,0.12)";
    ctx.fillRect(Math.random() * 512, Math.random() * 512, 1.5, 1.5);
  }
  return toTexture(c, true);
}

/** Déforme légèrement une sphère pour un volume organique (kumpir). */
export function displaceSphere(geometry: THREE.SphereGeometry, amount = 0.06) {
  const pos = geometry.attributes.position;
  if (!pos) return geometry;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const n =
      Math.sin(v.x * 3.1 + 0.4) * Math.cos(v.y * 2.7) * 0.5 +
      Math.sin(v.z * 4.3 + v.x * 1.7) * 0.3 +
      Math.cos(v.y * 5.1 + v.z * 2.2) * 0.2;
    const len = v.length();
    v.multiplyScalar(1 + (n * amount) / Math.max(len, 0.0001));
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  pos.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}
