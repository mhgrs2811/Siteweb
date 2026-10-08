/**
 * Serves the static web export (dist/) and captures screenshots of the Phase 0 screens in
 * light and dark mode, French and English, at iPhone size.
 *
 * Usage: npx expo export --platform web && node scripts/preview-web.mjs
 * Output: .preview/*.png (git-ignored)
 */
import { createReadStream, existsSync } from 'node:fs';
import { mkdir, stat } from 'node:fs/promises';
import http from 'node:http';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const dist = path.join(root, 'dist');
const outDir = path.join(root, '.preview');
const PORT = 4173;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.wasm': 'application/wasm',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.ttf': 'font/ttf',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
};

async function resolveFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0]);
  const candidates = [
    path.join(dist, clean),
    path.join(dist, `${clean}.html`),
    path.join(dist, clean, 'index.html'),
  ];
  for (const candidate of candidates) {
    if (!candidate.startsWith(dist)) continue;
    if (existsSync(candidate) && (await stat(candidate)).isFile()) return candidate;
  }
  return path.join(dist, 'index.html');
}

function serve() {
  const server = http.createServer(async (req, res) => {
    const file = await resolveFile(req.url ?? '/');
    res.setHeader('Content-Type', MIME[path.extname(file)] ?? 'application/octet-stream');
    createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(PORT, () => resolve(server)));
}

const SHOTS = [
  { file: 'home-light-fr.png', route: '/', theme: 'light', language: 'fr', fullPage: false },
  { file: 'home-dark-fr.png', route: '/', theme: 'dark', language: 'fr', fullPage: false },
  { file: 'home-light-en.png', route: '/', theme: 'light', language: 'en', fullPage: false },
  { file: 'home-full-light-fr.png', route: '/', theme: 'light', language: 'fr', fullPage: true },
  { file: 'home-full-dark-fr.png', route: '/', theme: 'dark', language: 'fr', fullPage: true },
  {
    file: 'sheet-appearance-light-fr.png',
    route: '/settings/appearance',
    theme: 'light',
    language: 'fr',
    fullPage: false,
  },
  {
    file: 'sheet-next-step-dark-fr.png',
    route: '/next-step',
    theme: 'dark',
    language: 'fr',
    fullPage: false,
  },
  {
    file: 'design-system-light-fr.png',
    route: '/dev/design-system',
    theme: 'light',
    language: 'fr',
    fullPage: true,
  },
  {
    file: 'design-system-dark-fr.png',
    route: '/dev/design-system',
    theme: 'dark',
    language: 'fr',
    fullPage: true,
  },
  {
    file: 'design-system-light-en.png',
    route: '/dev/design-system',
    theme: 'light',
    language: 'en',
    fullPage: true,
  },
];

async function main() {
  if (!existsSync(dist)) {
    throw new Error('dist/ not found. Run `npx expo export --platform web` first.');
  }
  await mkdir(outDir, { recursive: true });
  const server = await serve();
  const browser = await chromium.launch();
  try {
    for (const shot of SHOTS) {
      const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 2,
        colorScheme: shot.theme,
        locale: shot.language === 'fr' ? 'fr-FR' : 'en-US',
      });
      // Persisted preferences, exactly as the app would store them.
      await context.addInitScript(
        ({ theme, language }) => {
          window.localStorage.setItem(
            'lume.preferences.v1',
            JSON.stringify({
              state: { themeMode: theme, language, hapticsEnabled: true },
              version: 0,
            }),
          );
        },
        { theme: shot.theme, language: shot.language },
      );
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text());
      });
      await page.goto(`http://localhost:${PORT}${shot.route}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      // Let entering animations, the score ring and the shimmer settle.
      await page.waitForTimeout(2500);
      if (shot.fullPage) {
        // React Native Web scrolls inside a 100vh container, so `fullPage` would only capture
        // the viewport. Grow the viewport to the tallest scrollable content instead.
        const contentHeight = await page.evaluate(() =>
          Math.max(...Array.from(document.querySelectorAll('*')).map((el) => el.scrollHeight)),
        );
        await page.setViewportSize({ width: 390, height: Math.min(contentHeight + 24, 12000) });
        await page.waitForTimeout(800);
        await page.screenshot({ path: path.join(outDir, shot.file) });
        // Readable segments for review, 1690 px tall each.
        const segmentHeight = 1690;
        const segments = Math.ceil(contentHeight / segmentHeight);
        for (let index = 0; index < segments; index += 1) {
          await page.screenshot({
            path: path.join(outDir, shot.file.replace('.png', `-${index + 1}.png`)),
            clip: {
              x: 0,
              y: index * segmentHeight,
              width: 390,
              height: Math.min(segmentHeight, contentHeight - index * segmentHeight),
            },
          });
        }
      } else {
        await page.screenshot({ path: path.join(outDir, shot.file) });
      }
      process.stdout.write(
        `wrote ${shot.file}${errors.length ? ` (${errors.length} console errors)` : ''}\n`,
      );
      for (const error of errors.slice(0, 5)) process.stdout.write(`  ! ${error}\n`);
      await context.close();
    }
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
  process.exitCode = 1;
});
