// Capture des images fixes de la sculpture (repli mobile / mouvement réduit,
// CTA final, page 404) depuis le vrai rendu WebGL du site.
// Usage : serveur lancé (npm run dev) puis `node scripts/render-sculpture.mjs [url]`
import { createRequire } from "node:module";
import sharp from "sharp";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const base = process.argv[2] ?? "http://localhost:3100";
const out = new URL("../public/images/sculpture/", import.meta.url).pathname;

const poses = [
  { name: "nova-ring", wait: 2500, pointer: null },
  { name: "nova-ring-alt", wait: 7000, pointer: [0.78, 0.3] },
  { name: "nova-ring-melt", wait: 4000, pointer: [0.3, 0.75], melt: true },
];

const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
for (const pose of poses) {
  const ctx = await browser.newContext({ viewport: { width: 1100, height: 1100 }, deviceScaleFactor: 1.6 });
  await ctx.addInitScript(() => sessionStorage.setItem("nova-intro", "1"));
  const page = await ctx.newPage();
  await page.goto(base + "/?force-gl", { waitUntil: "networkidle" });
  await page.addStyleTag({
    content: `html,body,section,main{background:transparent!important} body>*:not(main){display:none!important}
    #top>*:not(:first-child){visibility:hidden!important} #top::after{display:none!important}
    #top>div:first-child{position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;transform:none!important;left:0!important;top:0!important;right:auto!important}
    main>section:not(#top){display:none!important}`,
  });
  await page.evaluate(() => window.dispatchEvent(new Event("resize")));
  if (pose.pointer) await page.mouse.move(1100 * pose.pointer[0], 1100 * pose.pointer[1], { steps: 8 });
  await page.waitForTimeout(pose.wait);
  const canvas = await page.$("#top canvas");
  const png = await canvas.screenshot({ omitBackground: true });
  await sharp(png).resize(1400, 1400, { fit: "inside" }).webp({ quality: 82, alphaQuality: 90 }).toFile(`${out}${pose.name}.webp`);
  console.log("ok", pose.name);
  await ctx.close();
}
await browser.close();
