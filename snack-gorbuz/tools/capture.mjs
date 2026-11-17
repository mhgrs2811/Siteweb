/**
 * Contrôle visuel automatisé (Playwright, Chromium).
 * Capture chaque page aux largeurs 375 / 768 / 1440 px en pleine page, et vérifie :
 *  - absence de défilement horizontal ;
 *  - chargement des polices web ;
 *  - absence d'erreurs console ;
 *  - un seul <h1> par page.
 *
 * Usage : npm run preview (dans un autre terminal) puis `node tools/capture.mjs [baseUrl]`
 * Sorties : tools/output/<page>-<largeur>.png
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const base = process.argv[2] ?? 'http://localhost:4321';
const outDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'output');
await mkdir(outDir, { recursive: true });

const pages = [
  { name: 'accueil', path: '/' },
  { name: 'menu', path: '/menu/' },
  { name: 'univers', path: '/univers/' },
  { name: 'galerie', path: '/galerie/' },
  { name: 'contact', path: '/contact/' },
  { name: 'mentions', path: '/mentions-legales/' },
  { name: '404', path: '/page-inexistante/' },
];
const widths = [375, 768, 1440];
const extra = process.env.EXTRA_WIDTHS ? process.env.EXTRA_WIDTHS.split(',').map(Number) : [];

const browser = await chromium.launch();
const report = [];

for (const width of [...widths, ...extra]) {
  const context = await browser.newContext({
    viewport: { width, height: width < 768 ? 812 : 900 },
    deviceScaleFactor: 1,
    locale: 'fr-BE',
    timezoneId: 'Europe/Brussels',
  });
  for (const p of pages) {
    const page = await context.newPage();
    const errors = [];
    page.on('console', (m) => {
      // Le statut 404 de la page d'erreur elle-même est attendu.
      if (m.type() === 'error' && !(p.name === '404' && m.text().includes('404'))) errors.push(m.text());
    });
    page.on('pageerror', (e) => errors.push(String(e)));

    await page.goto(base + p.path, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    // Défilement instantané (sans lissage) pour déclencher les apparitions au scroll
    // avant la capture pleine page.
    await page.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.6;
      for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 700));
    });

    const checks = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      fraunces: document.fonts.check('500 20px "Fraunces Variable"'),
      manrope: document.fonts.check('400 16px "Manrope Variable"'),
      h1: document.querySelectorAll('h1').length,
      title: document.title,
    }));

    const file = path.join(outDir, `${p.name}-${width}.png`);
    await page.screenshot({ path: file, fullPage: true });
    report.push({ page: p.name, width, ...checks, errors });
    await page.close();
  }
  await context.close();
}

await browser.close();

let failed = false;
for (const r of report) {
  const problems = [];
  if (r.scrollWidth > r.innerWidth) problems.push(`débordement horizontal (${r.scrollWidth} > ${r.innerWidth})`);
  if (!r.fraunces || !r.manrope) problems.push('polices web non chargées');
  if (r.h1 !== 1) problems.push(`${r.h1} <h1>`);
  if (r.errors.length) problems.push(`erreurs console : ${r.errors.join(' | ')}`);
  const status = problems.length ? '✗' : '✓';
  if (problems.length) failed = true;
  console.log(`${status} ${r.page.padEnd(8)} ${String(r.width).padStart(4)} px  ${problems.join(' ; ') || 'OK'}`);
}
process.exit(failed ? 1 : 0);
