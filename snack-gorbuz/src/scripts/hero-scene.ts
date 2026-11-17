/**
 * ============================================================
 * SCÈNE DU HERO — « LE GOÛT EN SCÈNE »
 * ============================================================
 * Composition procédurale en pseudo-3D (Canvas 2D, aucune dépendance) :
 * une pile de disques stylisés dans la palette de la marque, éclairée par
 * le haut-gauche, posée sur un comptoir. Objet de marque abstrait — ce n'est
 * PAS la représentation d'un produit de la carte.
 *
 * Interactions :
 *  - pointeur (souris) : légère rotation / inclinaison de la pile ;
 *  - défilement : les couches s'écartent (vue éclatée) et la pile pivote ;
 *  - respiration lente au repos.
 *
 * Performance & accessibilité :
 *  - DPR plafonné (2 desktop / 1,5 mobile) ;
 *  - animation uniquement lorsque la scène est visible et l'onglet actif ;
 *  - prefers-reduced-motion : une seule image statique, pas de boucle ;
 *  - un repli CSS (HTML) est affiché tant que le canvas n'est pas prêt.
 */

interface Layer {
  /** Rayon relatif (1 = rayon de base). */
  r: number;
  /** Épaisseur relative. */
  t: number;
  /** Décalage horizontal relatif (pile « posée », pas parfaitement alignée). */
  ox: number;
  oz: number;
  color: string;
  shade: string;
  highlight: string;
}

const LAYERS: Layer[] = [
  { r: 1.0, t: 0.07, ox: 0, oz: 0, color: '#e6dac6', shade: '#b9a98f', highlight: '#fbf6ec' },
  { r: 0.74, t: 0.16, ox: 0.05, oz: -0.02, color: '#3b2c23', shade: '#1f1510', highlight: '#5a463a' },
  { r: 0.84, t: 0.09, ox: -0.06, oz: 0.03, color: '#8a2f2a', shade: '#55191a', highlight: '#b24a42' },
  { r: 0.72, t: 0.08, ox: 0.04, oz: 0.05, color: '#8e9b74', shade: '#5f6b4c', highlight: '#b3bd9c' },
  { r: 0.8, t: 0.12, ox: -0.03, oz: -0.04, color: '#f3ecdf', shade: '#c4b59c', highlight: '#ffffff' },
  { r: 0.6, t: 0.1, ox: 0.07, oz: 0.02, color: '#b8874f', shade: '#7f5a30', highlight: '#dcb27f' },
  { r: 0.66, t: 0.08, ox: -0.05, oz: -0.03, color: '#8a2f2a', shade: '#55191a', highlight: '#b24a42' },
  { r: 0.4, t: 0.18, ox: 0.02, oz: 0.04, color: '#3b2c23', shade: '#1f1510', highlight: '#5a463a' },
];

const clamp = (v: number, min: number, max: number): number => Math.min(max, Math.max(min, v));
const lerp = (a: number, b: number, k: number): number => a + (b - a) * k;
const easeOut = (x: number): number => 1 - Math.pow(1 - x, 3);

class HeroScene {
  private readonly root: HTMLElement;
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly reduceMotion: boolean;
  private readonly isTouch: boolean;

  private w = 0;
  private h = 0;
  private dpr = 1;

  private yaw = 0;
  private pitch = 0;
  private targetYaw = 0;
  private targetPitch = 0;
  private spread = 0;
  private targetSpread = 0;
  private scrollYaw = 0;
  private time = 0;

  private raf = 0;
  private visible = true;
  private running = false;

  constructor(root: HTMLElement, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.root = root;
    this.canvas = canvas;
    this.ctx = ctx;
    this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.isTouch = window.matchMedia('(hover: none)').matches;
  }

  init(): void {
    this.resize();
    this.root.classList.add('is-ready');

    const ro = new ResizeObserver(() => {
      this.resize();
      if (this.reduceMotion) this.draw();
    });
    ro.observe(this.root);

    if (this.reduceMotion) {
      this.draw();
      return;
    }

    if (!this.isTouch) {
      const hero = this.root.closest<HTMLElement>('[data-hero]') ?? this.root;
      hero.addEventListener(
        'pointermove',
        (e: PointerEvent) => {
          if (e.pointerType !== 'mouse') return;
          const rect = hero.getBoundingClientRect();
          const nx = clamp((e.clientX - rect.left) / rect.width, 0, 1) - 0.5;
          const ny = clamp((e.clientY - rect.top) / rect.height, 0, 1) - 0.5;
          this.targetYaw = nx * 0.9;
          this.targetPitch = ny * 0.14;
        },
        { passive: true },
      );
      hero.addEventListener('pointerleave', () => {
        this.targetYaw = 0;
        this.targetPitch = 0;
      });
    }

    const onScroll = (): void => {
      const limit = Math.max(window.innerHeight * 0.85, 1);
      const p = clamp(window.scrollY / limit, 0, 1);
      this.targetSpread = easeOut(p);
      this.scrollYaw = p * 0.7;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const io = new IntersectionObserver(
      (entries) => {
        this.visible = entries.some((e) => e.isIntersecting);
        this.syncLoop();
      },
      { threshold: 0.02 },
    );
    io.observe(this.root);

    document.addEventListener('visibilitychange', () => this.syncLoop());
    this.syncLoop();
  }

  private syncLoop(): void {
    const shouldRun = this.visible && document.visibilityState === 'visible';
    if (shouldRun && !this.running) {
      this.running = true;
      this.raf = requestAnimationFrame(this.tick);
    } else if (!shouldRun && this.running) {
      this.running = false;
      cancelAnimationFrame(this.raf);
    }
  }

  private tick = (now: number): void => {
    if (!this.running) return;
    this.time = now / 1000;
    this.yaw = lerp(this.yaw, this.targetYaw, 0.06);
    this.pitch = lerp(this.pitch, this.targetPitch, 0.06);
    this.spread = lerp(this.spread, this.targetSpread, 0.08);
    this.draw();
    this.raf = requestAnimationFrame(this.tick);
  };

  private resize(): void {
    const rect = this.root.getBoundingClientRect();
    this.w = Math.max(1, Math.round(rect.width));
    this.h = Math.max(1, Math.round(rect.height));
    const maxDpr = window.innerWidth < 768 ? 1.5 : 2;
    this.dpr = clamp(window.devicePixelRatio || 1, 1, maxDpr);
    this.canvas.width = Math.round(this.w * this.dpr);
    this.canvas.height = Math.round(this.h * this.dpr);
    this.canvas.style.width = `${this.w}px`;
    this.canvas.style.height = `${this.h}px`;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  private draw(): void {
    const { ctx, w, h } = this;
    ctx.clearRect(0, 0, w, h);

    const s = Math.min(w, h) * 0.3; // rayon de base
    const breath = this.reduceMotion ? 0 : Math.sin(this.time * 0.9) * 0.015;
    const pitch = 0.46 + this.pitch; // élévation de la caméra (rad)
    const yaw = this.yaw + this.scrollYaw;
    const sinP = Math.sin(pitch);
    const cosP = Math.cos(pitch);
    const cosA = Math.cos(yaw);
    const sinA = Math.sin(yaw);

    // Hauteur totale de la pile pour centrer verticalement.
    const gap = s * (0.09 + this.spread * 0.22 + breath);
    let totalH = 0;
    for (const l of LAYERS) totalH += l.t * s + gap;

    const cx = w * 0.5;
    const cy = h * 0.5 + (totalH * cosP) * 0.5 - this.spread * h * 0.06;

    // Ombre portée sur le comptoir
    const shadowR = s * 1.25;
    const shadow = ctx.createRadialGradient(cx, cy + s * 0.08, 0, cx, cy + s * 0.08, shadowR);
    shadow.addColorStop(0, 'rgba(0,0,0,0.42)');
    shadow.addColorStop(0.55, 'rgba(0,0,0,0.16)');
    shadow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.save();
    ctx.translate(cx, cy + s * 0.08);
    ctx.scale(1, sinP * 0.9);
    ctx.translate(-cx, -(cy + s * 0.08));
    ctx.fillStyle = shadow;
    ctx.fillRect(cx - shadowR, cy + s * 0.08 - shadowR, shadowR * 2, shadowR * 2);
    ctx.restore();

    // Couches, de bas en haut
    let level = 0;
    for (let i = 0; i < LAYERS.length; i++) {
      const l = LAYERS[i];
      const r = l.r * s;
      const t = l.t * s;
      const ox = l.ox * s;
      const oz = l.oz * s;
      const x3 = ox * cosA - oz * sinA;
      const z3 = ox * sinA + oz * cosA;
      const wobble = this.reduceMotion ? 0 : Math.sin(this.time * 0.7 + i * 0.9) * s * 0.008;

      const sx = cx + x3;
      const sy = cy - level * cosP + z3 * sinP + wobble;
      const rx = r;
      const ry = r * sinP;
      const tv = t * cosP;

      // Face latérale (ellipse basse + rectangle)
      const side = ctx.createLinearGradient(sx - rx, 0, sx + rx, 0);
      side.addColorStop(0, l.color);
      side.addColorStop(0.45, l.shade);
      side.addColorStop(1, l.shade);
      ctx.fillStyle = side;
      ctx.beginPath();
      ctx.ellipse(sx, sy + tv, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(sx - rx, sy, rx * 2, tv);

      // Face supérieure, lumière haut-gauche
      const top = ctx.createRadialGradient(
        sx - rx * 0.35,
        sy - ry * 0.35,
        0,
        sx,
        sy,
        rx * 1.1,
      );
      top.addColorStop(0, l.highlight);
      top.addColorStop(0.35, l.color);
      top.addColorStop(1, l.shade);
      ctx.fillStyle = top;
      ctx.beginPath();
      ctx.ellipse(sx, sy, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();

      // Liseré discret
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();

      level += t + gap;
    }
  }
}

function initHeroScene(): void {
  const root = document.querySelector<HTMLElement>('[data-hero-scene]');
  const canvas = root?.querySelector<HTMLCanvasElement>('canvas');
  if (!root || !canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return; // repli CSS conservé
  new HeroScene(root, canvas, ctx).init();
}

initHeroScene();
