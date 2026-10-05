// Génère des versions autonomes des pages (CSS, JS, polices et photos intégrés)
// dans apercu/, pour les envoyer au client ou les ouvrir sans serveur.
// Usage : npm run preview
import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const root = path.join(project, "public");
const out = path.join(project, "apercu");
const pages = ["index.html", "carte.html", "reserver.html", "mentions-legales.html"];
const mime = { ".woff2": "font/woff2", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml" };

const exists = (p) => access(p).then(() => true, () => false);
const dataUri = async (file) => `data:${mime[path.extname(file)]};base64,${(await readFile(file)).toString("base64")}`;

async function inlineCss() {
  let css = await readFile(path.join(root, "assets/css/main.css"), "utf8");
  const urls = [...css.matchAll(/url\("(\.\.\/fonts\/[^"]+)"\)/g)].map((m) => m[1]);
  for (const u of new Set(urls)) {
    css = css.replaceAll(`url("${u}")`, `url("${await dataUri(path.join(root, "assets/css", u))}")`);
  }
  return css;
}

async function inlineImages(html) {
  const srcs = [...html.matchAll(/src="(assets\/img\/[^"]+)"/g)].map((m) => m[1]);
  let missing = 0;
  for (const src of new Set(srcs)) {
    const file = path.join(root, src);
    if (await exists(file)) html = html.replaceAll(`src="${src}"`, `src="${await dataUri(file)}"`);
    else missing++;
  }
  return { html, missing };
}

const css = await inlineCss();
const js = await readFile(path.join(root, "assets/js/main.js"), "utf8");
const favicon = await dataUri(path.join(root, "favicon.svg"));
await mkdir(out, { recursive: true });

for (const page of pages) {
  let html = await readFile(path.join(root, page), "utf8");
  html = html
    .replace(/\s*<link rel="preload"[^>]*>/g, "")
    .replace(/\s*<link rel="manifest"[^>]*>/, "")
    .replace('href="favicon.svg"', `href="${favicon}"`)
    .replace('<link rel="stylesheet" href="assets/css/main.css">', () => `<style>\n${css}</style>`)
    .replace(/\s*<script src="assets\/js\/main\.js" defer><\/script>/, "")
    .replace("</body>", () => `<script>\n${js.replace('endpoint: "/api/reservation"', 'endpoint: ""')}</script>\n</body>`);
  const result = await inlineImages(html);
  await writeFile(path.join(out, page), result.html);
  console.log(`apercu/${page}${result.missing ? ` (${result.missing} photo(s) manquante(s))` : ""}`);
}
