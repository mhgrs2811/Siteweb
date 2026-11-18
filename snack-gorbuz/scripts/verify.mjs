/**
 * Vérification visuelle et fonctionnelle du site Snack Gorbuz.
 * Prérequis : serveur lancé (npm run dev ou npm run build && npm start).
 * Usage : node scripts/verify.mjs [baseUrl]   (défaut : http://localhost:3000)
 * Produit des captures pleine page dans scripts/output/ et un rapport dans la console.
 */
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const base = process.argv[2] ?? "http://localhost:3000";
const out = join(dirname(fileURLToPath(import.meta.url)), "output");
mkdirSync(out, { recursive: true });

const routes = ["/", "/carte", "/concept", "/galerie", "/contact", "/mentions-legales", "/confidentialite", "/page-inexistante"];
const widths = [375, 768, 1440];
const forbidden = [/\d+[,.]\d{2}\s?€/, /\btel:/, /mailto:/, /\b0[1-9](?:[ .]?\d{2}){4}\b/, /\+32/, /lorem ipsum/i, /\bTODO\b/, /\bRue\s[A-Z]/, /\d{2}h\d{2}/, /★|⭐/];

const browser = await chromium.launch();
const problems = [];
const summary = [];

for (const width of widths) {
  const context = await browser.newContext({
    viewport: { width, height: width < 768 ? 740 : 900 },
    deviceScaleFactor: 1,
    reducedMotion: "no-preference",
  });
  for (const route of routes) {
    const page = await context.newPage();
    const errors = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
    const resp = await page.goto(base + route, { waitUntil: "networkidle" });
    await page.waitForTimeout(900);

    // Déclenche les reveals en défilant jusqu'en bas puis retour.
    await page.evaluate(async () => {
      const h = document.documentElement.scrollHeight;
      for (let y = 0; y <= h; y += 400) {
        window.scrollTo({ top: y, behavior: "instant" });
        await new Promise((r) => setTimeout(r, 90));
      }
      window.scrollTo({ top: 0, behavior: "instant" });
    });
    await page.waitForTimeout(1200);

    const data = await page.evaluate(() => {
      const h1 = [...document.querySelectorAll("h1")].map((h) => h.textContent?.trim());
      const headings = [...document.querySelectorAll("h1,h2,h3,h4")].map((h) => `${h.tagName}:${h.textContent?.trim().slice(0, 50)}`);
      const links = [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href"));
      const emptyLinks = links.filter((h) => !h || h === "#" || h === "");
      const brokenImgs = [...document.querySelectorAll("img")].filter((i) => !i.complete || i.naturalWidth === 0).length;
      const fontFaces = [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family);
      return {
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        h1,
        headings,
        linkCount: links.length,
        emptyLinks,
        brokenImgs,
        fontFaces: [...new Set(fontFaces)],
        text: document.body.innerText,
        title: document.title,
        lang: document.documentElement.lang,
        hasCanvas: Boolean(document.querySelector("canvas")),
        hasViewport: Boolean(document.querySelector('meta[name="viewport"]')),
      };
    });

    const name = `${route === "/" ? "accueil" : route.replace(/\//g, "") || "accueil"}-${width}.png`;
    await page.screenshot({ path: join(out, name), fullPage: true });

    const issues = [];
    if (route !== "/page-inexistante" && resp?.status() !== 200) issues.push(`HTTP ${resp?.status()}`);
    if (route === "/page-inexistante" && resp?.status() !== 404) issues.push(`404 attendu, reçu ${resp?.status()}`);
    if (data.scrollWidth > data.innerWidth) issues.push(`débordement horizontal ${data.scrollWidth} > ${data.innerWidth}`);
    if (data.h1.length !== 1) issues.push(`H1 count = ${data.h1.length}`);
    if (data.emptyLinks.length) issues.push(`liens vides: ${data.emptyLinks.length}`);
    if (data.brokenImgs) issues.push(`images cassées: ${data.brokenImgs}`);
    const realErrors = route === "/page-inexistante" ? errors.filter((e) => !/404/.test(e)) : errors;
    if (realErrors.length) issues.push(`console: ${realErrors.slice(0, 3).join(" | ")}`);
    if (!data.fontFaces.some((f) => /anton/i.test(f))) issues.push("police display non chargée");
    if (!data.fontFaces.some((f) => /manrope/i.test(f))) issues.push("police texte non chargée");
    if (data.lang !== "fr") issues.push(`lang=${data.lang}`);
    if (!data.hasViewport) issues.push("meta viewport absente");
    for (const re of forbidden) {
      const m = data.text.match(re);
      if (m) issues.push(`donnée suspecte « ${m[0]} »`);
    }
    if (issues.length) problems.push({ route, width, issues });
    summary.push({ route, width, title: data.title, h1: data.h1[0], canvas: data.hasCanvas, links: data.linkCount, headings: data.headings });
    await page.close();
  }
  await context.close();
}

// Menu mobile : ouverture, focus, Échap.
{
  const context = await browser.newContext({ viewport: { width: 375, height: 740 } });
  const page = await context.newPage();
  await page.goto(base + "/", { waitUntil: "networkidle" });
  const btn = page.locator("header button[aria-controls]");
  await btn.click();
  await page.waitForTimeout(400);
  const expanded = await btn.getAttribute("aria-expanded");
  const visible = await page.getByRole("navigation", { name: "Navigation mobile" }).getByRole("link", { name: "La carte" }).isVisible();
  await page.screenshot({ path: join(out, "menu-mobile-375.png") });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
  const expandedAfter = await btn.getAttribute("aria-expanded");
  if (expanded !== "true" || !visible) problems.push({ route: "/", width: 375, issues: ["menu mobile ne s'ouvre pas"] });
  if (expandedAfter !== "false") problems.push({ route: "/", width: 375, issues: ["menu mobile ne se ferme pas à Échap"] });
  // Navigation réelle via le menu
  await btn.click();
  await page.getByRole("navigation", { name: "Navigation mobile" }).getByRole("link", { name: "La carte" }).click();
  await page.waitForURL("**/carte");
  await context.close();
}

// Ancres de la carte
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(base + "/carte", { waitUntil: "networkidle" });
  await page.getByRole("navigation", { name: "Familles de la carte" }).getByRole("link", { name: /mitraillettes/i }).click();
  await page.waitForTimeout(900);
  const y = await page.evaluate(() => window.scrollY);
  if (y < 200) problems.push({ route: "/carte", width: 1440, issues: ["ancre Mitraillettes sans défilement"] });
  await page.screenshot({ path: join(out, "carte-ancre-1440.png") });
  // Hero 3D : canvas présent à 1440 ?
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  const canvas = await page.evaluate(() => Boolean(document.querySelector("canvas")));
  summary.push({ route: "/", width: 1440, note: `canvas WebGL présent après chargement : ${canvas}` });
  await page.screenshot({ path: join(out, "hero-3d-1440.png") });
  await context.close();
}

// Mouvement réduit : la page reste complète.
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: join(out, "accueil-reduced-motion-1440.png") });
  await context.close();
}

await browser.close();

console.log("=== RÉSUMÉ ===");
for (const s of summary) console.log(JSON.stringify(s));
console.log("\n=== PROBLÈMES ===");
if (!problems.length) console.log("Aucun problème détecté.");
for (const p of problems) console.log(`${p.route} @${p.width}: ${p.issues.join(" ; ")}`);
process.exitCode = problems.length ? 1 : 0;
