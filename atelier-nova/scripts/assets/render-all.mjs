#!/usr/bin/env node
// Atelier Nova — portfolio asset pipeline.
//
//   node scripts/assets/render-all.mjs                 # everything
//   node scripts/assets/render-all.mjs --only=renders  # 3D renders only
//   node scripts/assets/render-all.mjs --only=sites    # mini-site screenshots only
//   node scripts/assets/render-all.mjs --only=media    # regenerate media.ts only
//   node scripts/assets/render-all.mjs --filter=orbe-cafe/cover   # one render / one site
//   node scripts/assets/render-all.mjs --passes=8      # faster, noisier preview renders
//
// 1. Serves the atelier-nova folder on a local port (scenes import three from node_modules).
// 2. Renders each Three.js scene in headless Chromium (SwiftShader) → PNG (POSTed back to the server).
// 3. Converts to WebP with sharp at the final size into public/images/projects/<slug>/.
// 4. Screenshots each concept mini-site (scripts/assets/sites/<slug>/index.html) with Playwright.
// 5. Writes src/content/generated/media.ts (dimensions + blur placeholders).
import http from 'node:http';
import fs from 'node:fs/promises';
import fss from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import sharp from 'sharp';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const TMP = path.join(ROOT, 'scripts/assets/.tmp');
const OUT = path.join(ROOT, 'public/images/projects');
const MEDIA_TS = path.join(ROOT, 'src/content/generated/media.ts');

const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const only = args.only;
const filter = args.filter;
const PASSES = args.passes ? +args.passes : null;

export const SLUGS = ['maison-ardoise', 'seve-institut', 'hinoki-lin', 'vide-architecture', 'orbe-cafe'];

// Render specs: output name → size. Scenes render at 2× then sharp downsamples.
const SHOTS = [
  { shot: 'cover', w: 1600, h: 1000 },
  { shot: 'render-1', w: 1600, h: 1100 },
  { shot: 'render-2', w: 1200, h: 1500 },
];

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };

function startServer() {
  return new Promise(resolve => {
    const server = http.createServer(async (req, res) => {
      const url = new URL(req.url, 'http://x');
      if (req.method === 'POST' && url.pathname === '/__save') {
        const name = url.searchParams.get('name');
        const chunks = [];
        for await (const c of req) chunks.push(c);
        await fs.mkdir(path.dirname(path.join(TMP, name)), { recursive: true });
        await fs.writeFile(path.join(TMP, name), Buffer.concat(chunks));
        res.writeHead(200); res.end('ok'); return;
      }
      const file = path.join(ROOT, decodeURIComponent(url.pathname));
      if (!file.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
      try {
        let f = file;
        if ((await fs.stat(f)).isDirectory()) f = path.join(f, 'index.html');
        const data = await fs.readFile(f);
        res.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' });
        res.end(data);
      } catch { res.writeHead(404); res.end('not found'); }
    });
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

async function launch() {
  return chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
}

async function toWebp(input, output, { width, height, quality = 82 } = {}) {
  await fs.mkdir(path.dirname(output), { recursive: true });
  let img = sharp(input);
  if (width) img = img.resize(width, height, { fit: 'cover', kernel: 'lanczos3' });
  await img.webp({ quality, effort: 6, smartSubsample: true }).toFile(output);
}

async function renderScenes(browser, base) {
  for (const slug of SLUGS) {
    for (const s of SHOTS) {
      const key = `${slug}/${s.shot}`;
      if (filter && !key.startsWith(filter) && filter !== slug) continue;
      const t0 = Date.now();
      const page = await browser.newPage();
      page.on('console', m => { if (m.type() === 'error') console.log(`  [${key}] console:`, m.text()); });
      page.on('pageerror', e => console.log(`  [${key}] pageerror:`, e.message));
      const name = `${slug}/${s.shot}.png`;
      const q = new URLSearchParams({ shot: s.shot, w: s.w, h: s.h, scale: 2, out: name });
      if (PASSES) q.set('passes', PASSES);
      await page.goto(`${base}/scripts/assets/scenes/${slug}.html?${q}`, { waitUntil: 'commit' });
      await page.waitForFunction(() => window.__done || window.__error, null, { timeout: 15 * 60_000, polling: 500 });
      const err = await page.evaluate(() => window.__error);
      await page.close();
      if (err) { console.error(`✗ ${key}\n${err}`); continue; }
      await toWebp(path.join(TMP, name), path.join(OUT, slug, `${s.shot}.webp`), { width: s.w, height: s.h, quality: 84 });
      console.log(`✓ render ${key} (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
    }
  }
}

// Screenshot specs per site. `detail` = selector of the signature section to frame at 1440×900.
const SITE_DETAIL = {
  'maison-ardoise': ['#menu', null],
  'seve-institut': ['#rendez-vous', null],
  'hinoki-lin': ['#collection', null],
  'vide-architecture': ['#projets', null],
  'orbe-cafe': ['#produit', 'cart'],
};
const SITE_MOBILE2 = {
  'maison-ardoise': '#reservation',
  'seve-institut': '#soins',
  'hinoki-lin': '#collection',
  'vide-architecture': '#projets',
  'orbe-cafe': '#produit',
};

async function settle(page) {
  await page.waitForLoadState('networkidle');
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map(i => i.complete ? null : new Promise(r => { i.onload = i.onerror = r; })));
  });
  await page.waitForTimeout(300);
}

async function scrollTo(page, sel) {
  await page.evaluate(s => { const el = document.querySelector(s); window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY); }, sel);
  await page.waitForTimeout(250);
}

async function shootSites(browser, base) {
  for (const slug of SLUGS) {
    if (filter && !filter.startsWith(slug)) continue;
    const url = `${base}/scripts/assets/sites/${slug}/index.html`;
    const dir = path.join(OUT, slug);
    const tdir = path.join(TMP, slug);
    await fs.mkdir(tdir, { recursive: true });

    // Desktop
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5 });
    const page = await ctx.newPage();
    page.on('pageerror', e => console.log(`  [${slug}] pageerror:`, e.message));
    await page.goto(url);
    await settle(page);
    await page.screenshot({ path: path.join(tdir, 'desktop-hero.png') });
    const [detailSel, extra] = SITE_DETAIL[slug];
    await scrollTo(page, detailSel);
    await page.screenshot({ path: path.join(tdir, 'detail-1.png') });
    if (extra === 'cart') {
      await page.evaluate(() => document.body.classList.add('cart-open'));
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(tdir, 'detail-2.png') });
      await page.evaluate(() => document.body.classList.remove('cart-open'));
    }
    await ctx.close();

    const ctxFull = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
    const pf = await ctxFull.newPage();
    await pf.goto(url);
    await settle(pf);
    await pf.screenshot({ path: path.join(tdir, 'desktop-full.png'), fullPage: true });
    await ctxFull.close();

    // Mobile
    const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    const mp = await mctx.newPage();
    await mp.goto(url);
    await settle(mp);
    await mp.screenshot({ path: path.join(tdir, 'mobile-1.png') });
    await scrollTo(mp, SITE_MOBILE2[slug]);
    await mp.screenshot({ path: path.join(tdir, 'mobile-2.png') });
    await mctx.close();

    await toWebp(path.join(tdir, 'desktop-hero.png'), path.join(dir, 'desktop-hero.webp'), { width: 1440, height: 900, quality: 80 });
    await toWebp(path.join(tdir, 'detail-1.png'), path.join(dir, 'detail-1.webp'), { width: 1440, height: 900, quality: 80 });
    if (extra === 'cart') await toWebp(path.join(tdir, 'detail-2.png'), path.join(dir, 'detail-2.webp'), { width: 1440, height: 900, quality: 80 });
    await toWebp(path.join(tdir, 'desktop-full.png'), path.join(dir, 'desktop-full.webp'), { quality: 76 });
    await toWebp(path.join(tdir, 'mobile-1.png'), path.join(dir, 'mobile-1.webp'), { quality: 80 });
    await toWebp(path.join(tdir, 'mobile-2.png'), path.join(dir, 'mobile-2.webp'), { quality: 80 });
    console.log(`✓ site ${slug}`);
  }
}

async function writeMedia() {
  const entries = [];
  for (const slug of SLUGS) {
    const dir = path.join(OUT, slug);
    if (!fss.existsSync(dir)) continue;
    const files = (await fs.readdir(dir)).filter(f => f.endsWith('.webp')).sort();
    for (const f of files) {
      const p = path.join(dir, f);
      const meta = await sharp(p).metadata();
      const tiny = await sharp(p).resize(16).webp({ quality: 50 }).toBuffer();
      const src = `/images/projects/${slug}/${f}`;
      entries.push([src, { src, width: meta.width, height: meta.height, blurDataURL: `data:image/webp;base64,${tiny.toString('base64')}` }]);
    }
  }
  const body = entries.map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)},`).join('\n');
  const ts = `// AUTO-GENERATED by scripts/assets/render-all.mjs — do not edit by hand.\n` +
    `export type MediaInfo = { src: string; width: number; height: number; blurDataURL: string };\n\n` +
    `export const media: Record<string, MediaInfo> = {\n${body}\n};\n`;
  await fs.mkdir(path.dirname(MEDIA_TS), { recursive: true });
  await fs.writeFile(MEDIA_TS, ts);
  console.log(`✓ media.ts (${entries.length} entries)`);
}

const server = await startServer();
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await launch();
try {
  if (!only || only === 'renders') await renderScenes(browser, base);
  if (!only || only === 'sites') await shootSites(browser, base);
  if (!only || only === 'media' || !filter) await writeMedia();
} finally {
  await browser.close();
  server.close();
}
