/**
 * Renders the provisional brand assets (app icon, adaptive icon, splash wordmark, favicon)
 * with headless Chromium so the Fraunces wordmark is pixel-accurate.
 *
 * Usage: node scripts/generate-assets.mjs
 * Requires: playwright (dev machine or CI) and network access to Google Fonts.
 * Output: assets/images/*.png (committed). Re-run only when the wordmark changes.
 */
import { mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// CommonJS resolution honours NODE_PATH, so a globally installed Playwright works too.
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const here = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(here, '..', 'assets', 'images');

const BRAND = {
  ivory: '#F7F3EE',
  night: '#1C1A18',
  nightDeep: '#121110',
  ink: '#1C1A17',
  inkDark: '#F2EDE6',
  terracotta: '#B5684A',
  terracottaDark: '#C97E60',
};

const FONT_LINK =
  '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500&display=swap">';

function page(body, { width, height, background }) {
  return `<!doctype html>
<html><head><meta charset="utf-8">${FONT_LINK}
<style>
  html, body { margin: 0; padding: 0; width: ${width}px; height: ${height}px; background: ${background}; overflow: hidden; }
  .wrap { width: ${width}px; height: ${height}px; display: flex; align-items: center; justify-content: center; }
  .mark { font-family: 'Fraunces', Georgia, serif; font-weight: 500; font-variation-settings: 'opsz' 144; line-height: 1; letter-spacing: -0.03em; display: flex; align-items: flex-end; }
  .dot { border-radius: 50%; display: inline-block; }
</style></head><body><div class="wrap">${body}</div></body></html>`;
}

/** Monogram "L." for icons. `scale` is the icon size in px. */
function monogram(size, ink, accent) {
  const fontSize = Math.round(size * 0.62);
  const dot = Math.round(size * 0.085);
  return `<div class="mark" style="font-size:${fontSize}px;color:${ink};margin-top:${Math.round(size * 0.02)}px">
    L<span class="dot" style="width:${dot}px;height:${dot}px;background:${accent};margin-left:${Math.round(size * 0.015)}px;margin-bottom:${Math.round(size * 0.07)}px"></span>
  </div>`;
}

/** Wordmark "Lumé." for the splash screen. */
function wordmark(fontSize, ink, accent) {
  const dot = Math.round(fontSize * 0.14);
  return `<div class="mark" style="font-size:${fontSize}px;color:${ink}">
    Lumé<span class="dot" style="width:${dot}px;height:${dot}px;background:${accent};margin-left:${Math.round(fontSize * 0.05)}px;margin-bottom:${Math.round(fontSize * 0.1)}px"></span>
  </div>`;
}

const ASSETS = [
  {
    file: 'icon.png',
    width: 1024,
    height: 1024,
    background: BRAND.ivory,
    body: monogram(1024, BRAND.ink, BRAND.terracotta),
  },
  {
    file: 'icon-dark.png',
    width: 1024,
    height: 1024,
    background: BRAND.night,
    body: monogram(1024, BRAND.inkDark, BRAND.terracottaDark),
  },
  {
    // Android adaptive foreground: transparent, content inside the central safe zone.
    file: 'adaptive-icon.png',
    width: 1024,
    height: 1024,
    background: 'transparent',
    body: monogram(760, BRAND.ink, BRAND.terracotta),
  },
  {
    file: 'splash-icon.png',
    width: 1200,
    height: 420,
    background: 'transparent',
    body: wordmark(240, BRAND.ink, BRAND.terracotta),
  },
  {
    file: 'splash-icon-dark.png',
    width: 1200,
    height: 420,
    background: 'transparent',
    body: wordmark(240, BRAND.inkDark, BRAND.terracottaDark),
  },
  {
    file: 'favicon.png',
    width: 96,
    height: 96,
    background: BRAND.ivory,
    body: monogram(96, BRAND.ink, BRAND.terracotta),
  },
];

async function main() {
  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch();
  try {
    for (const asset of ASSETS) {
      const tab = await browser.newPage({
        viewport: { width: asset.width, height: asset.height },
        deviceScaleFactor: 1,
      });
      await tab.setContent(page(asset.body, asset), { waitUntil: 'networkidle' });
      await tab.evaluate(() => document.fonts.ready);
      await tab.screenshot({
        path: path.join(outDir, asset.file),
        omitBackground: asset.background === 'transparent',
        type: 'png',
      });
      await tab.close();
      process.stdout.write(`wrote ${asset.file}\n`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
  process.exitCode = 1;
});
