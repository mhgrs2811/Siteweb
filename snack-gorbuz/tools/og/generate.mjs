/**
 * Génère public/og-image.jpg (1200×630) et public/apple-touch-icon.png (180×180)
 * à partir de tools/og/og-template.html et public/favicon.svg.
 * Usage : node tools/og/generate.mjs
 */
import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..');
const browser = await chromium.launch();

const og = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await og.goto(pathToFileURL(path.join(here, 'og-template.html')).href, { waitUntil: 'networkidle' });
await og.evaluate(() => document.fonts.ready);
await og.screenshot({ path: path.join(root, 'public', 'og-image.jpg'), type: 'jpeg', quality: 86 });

const icon = await browser.newPage({ viewport: { width: 180, height: 180 }, deviceScaleFactor: 1 });
await icon.setContent(
  `<html><body style="margin:0;background:#8a2f2a"><img src="${pathToFileURL(path.join(root, 'public', 'favicon.svg')).href}" width="180" height="180" style="display:block"></body></html>`,
);
await icon.waitForTimeout(200);
await icon.screenshot({ path: path.join(root, 'public', 'apple-touch-icon.png') });

await browser.close();
console.log('OK : public/og-image.jpg, public/apple-touch-icon.png');
