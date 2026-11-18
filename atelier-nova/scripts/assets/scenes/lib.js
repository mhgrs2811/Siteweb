// Shared helpers for the photographic Three.js renders.
// Technique: progressive accumulation. Each pass re-renders the scene with
// jittered area-light positions, a random "sky" light for soft occlusion and a
// sub-pixel camera offset; passes are averaged on a 2D canvas. The result has
// soft penumbras, contact shadows and clean anti-aliasing — far closer to a
// photograph than a single real-time frame. A film grain + vignette pass is
// composited at the end, then the PNG is POSTed back to the local server.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export { THREE };

export const params = new URLSearchParams(location.search);
export const shot = params.get('shot') || 'cover';
export const W = +(params.get('w') || 1600);
export const H = +(params.get('h') || 1000);
export const SCALE = +(params.get('scale') || 2);
export const PASSES = +(params.get('passes') || 16);

// Deterministic random so every run gives the same image.
let seed = 1337;
export function rand() {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
}
export function setSeed(s) { seed = s; }
export const rr = (a, b) => a + (b - a) * rand();

export function createRenderer({ exposure = 1, clear = 0x000000 } = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = W * SCALE;
  canvas.height = H * SCALE;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1);
  renderer.setSize(W * SCALE, H * SCALE, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = exposure;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(clear);
  return renderer;
}

export function roomEnv(renderer, intensity = 1) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = new RoomEnvironment();
  const tex = pmrem.fromScene(env, 0.04).texture;
  return tex;
}

// Environment from a custom softbox scene: dark room + emissive panels.
export function softboxEnv(renderer, panels, bg = 0x000000) {
  const s = new THREE.Scene();
  s.background = new THREE.Color(bg);
  for (const p of panels) {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(p.w, p.h),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(p.color ?? 0xffffff).multiplyScalar(p.intensity ?? 1), side: THREE.DoubleSide })
    );
    m.position.set(...p.pos);
    m.lookAt(0, 0, 0);
    s.add(m);
  }
  const pmrem = new THREE.PMREMGenerator(renderer);
  return pmrem.fromScene(s, 0.02).texture;
}

// Curved studio backdrop (floor that bends up into a wall).
export function cyclorama({ width = 40, depth = 20, height = 20, radius = 6, color = 0xdddddd, roughness = 0.95, map = null } = {}) {
  // Build a ruled surface from the profile (profile in z/y), extruded along x.
  // profile: z = depth..0 along floor, then curve up, then wall to height
  const seg = 24;
  const prof = [];
  const n = 60;
  for (let i = 0; i <= n; i++) prof.push([depth - (depth - radius) * (i / n), 0]);
  for (let i = 1; i <= seg; i++) {
    const a = (i / seg) * (Math.PI / 2);
    prof.push([radius - Math.sin(a) * radius, radius - Math.cos(a) * radius]);
  }
  for (let i = 1; i <= 30; i++) prof.push([0, radius + (height - radius) * (i / 30)]);
  const geo = new THREE.BufferGeometry();
  const pos = [], uv = [], idx = [];
  const xs = 2;
  let len = 0; const lens = [0];
  for (let i = 1; i < prof.length; i++) { len += Math.hypot(prof[i][0] - prof[i - 1][0], prof[i][1] - prof[i - 1][1]); lens.push(len); }
  for (let i = 0; i < prof.length; i++) {
    for (let j = 0; j < xs; j++) {
      const x = -width / 2 + width * j;
      pos.push(x, prof[i][1], prof[i][0]);
      uv.push(x / 12, lens[i] / 12);
    }
  }
  for (let i = 0; i < prof.length - 1; i++) {
    const a = i * 2, b = a + 1, c = a + 2, d = a + 3;
    idx.push(a, b, c, b, d, c);
  }
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  const mat = new THREE.MeshStandardMaterial({ color, roughness, map });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.receiveShadow = true;
  mesh.position.z = -radius - 2;
  return mesh;
}

export function noiseCanvas(size, fn) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  fn(ctx, size);
  return c;
}

export function canvasTex(canvas, { srgb = true, repeat = [1, 1], aniso = 8 } = {}) {
  const t = new THREE.CanvasTexture(canvas);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(...repeat);
  t.anisotropy = aniso;
  return t;
}

// Speckled / mottled surface texture.
export function speckle(size, base, specks, { count = 4000, min = 0.4, max = 1.6, blotches = 0, alpha = [0.2, 0.8] } = {}) {
  return noiseCanvas(size, (ctx, s) => {
    ctx.fillStyle = base; ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < blotches; i++) {
      const r = rr(s * 0.05, s * 0.2);
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
      const col = specks[Math.floor(rand() * specks.length)];
      g.addColorStop(0, col.replace('ALPHA', '0.10')); g.addColorStop(1, col.replace('ALPHA', '0'));
      const px = rand() * s, py = rand() * s;
      for (const ox of [-s, 0, s]) for (const oy of [-s, 0, s]) { ctx.save(); ctx.translate(px + ox, py + oy); ctx.fillStyle = g; ctx.fillRect(-r, -r, 2 * r, 2 * r); ctx.restore(); }
    }
    for (let i = 0; i < count; i++) {
      const col = specks[Math.floor(rand() * specks.length)];
      ctx.fillStyle = col.replace('ALPHA', String(rr(alpha[0], alpha[1])));
      ctx.beginPath(); ctx.arc(rand() * s, rand() * s, rr(min, max), 0, Math.PI * 2); ctx.fill();
    }
  });
}

export function lathe(profile, segments = 96) {
  return new THREE.LatheGeometry(profile.map(([x, y]) => new THREE.Vector2(x, y)), segments);
}

// Smooth a lathe profile with Catmull-Rom.
export function smoothProfile(points, n = 80) {
  const c = new THREE.SplineCurve(points.map(([x, y]) => new THREE.Vector2(x, y)));
  return c.getPoints(n).map(p => [Math.max(0.0001, p.x), p.y]);
}

export function shadowLight(light, { size = 4096, area = 10, near = 0.5, far = 60, bias = -0.0002, normalBias = 0.02 } = {}) {
  light.castShadow = true;
  light.shadow.mapSize.set(size, size);
  const cam = light.shadow.camera;
  if (cam.isOrthographicCamera) { cam.left = -area; cam.right = area; cam.top = area; cam.bottom = -area; }
  cam.near = near; cam.far = far;
  light.shadow.bias = bias;
  light.shadow.normalBias = normalBias;
  light.shadow.radius = 2;
  cam.updateProjectionMatrix();
  return light;
}

export function enableShadows(root, { cast = true, receive = true } = {}) {
  root.traverse(o => { if (o.isMesh) { o.castShadow = cast; o.receiveShadow = receive; } });
}

// Progressive accumulation with jitter.
// lights: [{ light, base: Vector3, jitter: number }]
// sky: optional { light, intensity, minElev } — random hemisphere direction per pass (soft occlusion)
export async function accumulate(renderer, scene, camera, { passes = PASSES, lights = [], sky = null, onPass = null, shift = [0, 0], dof = null } = {}) {
  const w = renderer.domElement.width, h = renderer.domElement.height;
  const acc = document.createElement('canvas');
  acc.width = w; acc.height = h;
  const actx = acc.getContext('2d');
  for (const l of lights) l.base = l.base || l.light.position.clone();
  const target = sky?.target || new THREE.Vector3();
  const camBase = camera.position.clone();
  const camRight = new THREE.Vector3(), camUp = new THREE.Vector3();
  if (dof) {
    camera.lookAt(dof.focus);
    camera.updateMatrixWorld();
    camRight.setFromMatrixColumn(camera.matrixWorld, 0);
    camUp.setFromMatrixColumn(camera.matrixWorld, 1);
  }
  for (let i = 0; i < passes; i++) {
    for (const l of lights) {
      // uniform disc jitter perpendicular-ish (simple cube jitter is fine)
      const r = l.jitter * Math.sqrt(rand());
      const a = rand() * Math.PI * 2;
      const u = new THREE.Vector3(Math.cos(a) * r, rr(-0.5, 0.5) * r, Math.sin(a) * r);
      l.light.position.copy(l.base).add(u);
    }
    if (sky) {
      const el = rr(sky.minElev ?? 0.25, 1.35);
      const az = rand() * Math.PI * 2;
      const d = sky.distance ?? 25;
      sky.light.position.set(target.x + Math.cos(az) * Math.cos(el) * d, target.y + Math.sin(el) * d, target.z + Math.sin(az) * Math.cos(el) * d);
      sky.light.target.position.copy(target);
    }
    if (dof) {
      // golden-angle disc sampling for an even bokeh
      const r = dof.aperture * Math.sqrt((i + 0.5) / passes);
      const a = i * 2.39996323;
      camera.position.copy(camBase).addScaledVector(camRight, Math.cos(a) * r).addScaledVector(camUp, Math.sin(a) * r);
      camera.lookAt(dof.focus);
    }
    if (onPass) onPass(i);
    camera.setViewOffset(w, h, rr(-0.5, 0.5) + shift[0] * w, rr(-0.5, 0.5) + shift[1] * h, w, h);
    renderer.render(scene, camera);
    actx.globalAlpha = 1 / (i + 1);
    actx.drawImage(renderer.domElement, 0, 0);
    if (i % 4 === 0) await new Promise(r => setTimeout(r, 0));
  }
  camera.clearViewOffset();
  return acc;
}

// Photographic finish: grade, vignette, grain.
export function finish(acc, { grain = 0.05, vignette = 0.35, tint = null, contrast = 0 } = {}) {
  const w = acc.width, h = acc.height;
  const out = document.createElement('canvas');
  out.width = w; out.height = h;
  const ctx = out.getContext('2d');
  ctx.drawImage(acc, 0, 0);
  if (tint) {
    ctx.globalCompositeOperation = 'soft-light';
    ctx.globalAlpha = tint.alpha ?? 0.25;
    ctx.fillStyle = tint.color;
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 1;
  }
  if (vignette > 0) {
    ctx.globalCompositeOperation = 'multiply';
    const g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.hypot(w, h) * 0.62);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(1, `rgba(${Math.round(255 * (1 - vignette))},${Math.round(255 * (1 - vignette))},${Math.round(255 * (1 - vignette))},1)`);
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  }
  if (grain > 0) {
    const n = document.createElement('canvas');
    const ns = 512; n.width = n.height = ns;
    const nctx = n.getContext('2d');
    const id = nctx.createImageData(ns, ns);
    for (let i = 0; i < id.data.length; i += 4) {
      const v = 128 + (Math.random() + Math.random() + Math.random() - 1.5) * 120;
      id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255;
    }
    nctx.putImageData(id, 0, 0);
    ctx.globalCompositeOperation = 'overlay';
    ctx.globalAlpha = grain;
    const pat = ctx.createPattern(n, 'repeat');
    ctx.fillStyle = pat; ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 1;
  }
  ctx.globalCompositeOperation = 'source-over';
  return out;
}

export async function save(canvas, name) {
  const blob = await new Promise(r => canvas.toBlob(r, 'image/png'));
  const res = await fetch('/__save?name=' + encodeURIComponent(name), { method: 'POST', body: blob });
  if (!res.ok) throw new Error('save failed');
  window.__done = true;
}

export async function run(build) {
  try {
    const name = params.get('out');
    const canvas = await build();
    await save(canvas, name);
  } catch (e) {
    window.__error = String(e && e.stack || e);
    console.error(e);
  }
}
