// Génère public/og.jpg (1200×630) : image de partage Open Graph.
// Usage : node scripts/render-og.mjs
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import sharp from "sharp";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const ring = readFileSync(new URL("../public/images/sculpture/nova-ring.webp", import.meta.url)).toString("base64");
const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
<style>
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#0e0e0d;color:#eeeae2;font-family:Geist,sans-serif;position:relative;overflow:hidden}
.ring{position:absolute;right:-120px;top:-60px;width:760px;height:760px;background:url(data:image/webp;base64,${ring}) center/contain no-repeat}
.top{position:absolute;left:64px;top:56px;right:64px;display:flex;justify-content:space-between;font-size:15px;letter-spacing:.18em;text-transform:uppercase;color:#8e8b84}
.logo{position:absolute;left:64px;top:52px;display:flex;align-items:baseline;gap:10px}
.logo b{font-weight:600;font-size:16px;letter-spacing:.24em;text-transform:uppercase}
.logo i{font-family:'Instrument Serif';font-size:34px}
.dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:#ff4f17;margin-left:3px}
h1{position:absolute;left:60px;bottom:120px;font-weight:500;font-size:104px;line-height:.9;letter-spacing:-.045em}
h1 em{font-family:'Instrument Serif';font-weight:400;font-style:italic;display:block;padding-left:90px;mix-blend-mode:difference}
.foot{position:absolute;left:64px;right:64px;bottom:48px;display:flex;justify-content:space-between;font-size:18px;color:#8e8b84;border-top:1px solid rgba(238,234,226,.15);padding-top:20px}
</style></head><body>
<div class="ring"></div>
<div class="logo"><b>Atelier</b><i>Nova<span class="dot"></span></i></div>
<h1>Votre marque<em>mérite mieux</em>qu’un template.</h1>
<div class="foot"><span>Studio web · Direction artistique · IA</span><span>Bruxelles — Belgique</span></div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
const png = await page.screenshot();
await sharp(png).jpeg({ quality: 86, mozjpeg: true }).toFile(new URL("../public/og.jpg", import.meta.url).pathname);
await browser.close();
console.log("og.jpg ok");
