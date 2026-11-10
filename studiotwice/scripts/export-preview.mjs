/**
 * Export statique pour un aperçu partagé (sans serveur, donc sans formulaire).
 *   npm run export:preview
 * Résultat dans out/ : chemins relatifs, dossier _next renommé nxt (certains hébergeurs
 * d'aperçu réservent les noms commençant par un tiret bas), caractères U+FFFD échappés.
 */
import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
// Mis de côté le temps de l'export : la route serveur et les fichiers sitemap/robots (inutiles en aperçu).
const asideDir = join(root, ".api-aside");
const moved = [
  ["src/app/api", "api"],
  ["src/app/sitemap.ts", "sitemap.ts"],
  ["src/app/robots.ts", "robots.ts"],
].map(([from, to]) => [join(root, from), join(asideDir, to)]);
const dist = join(root, ".next-export");
const out = join(root, process.env.EXPORT_OUT || "out");

rmSync(dist, { recursive: true, force: true });
rmSync(out, { recursive: true, force: true });
mkdirSync(asideDir, { recursive: true });
for (const [from, to] of moved) if (existsSync(from)) renameSync(from, to);
try {
  execSync("npx next build", { stdio: "inherit", env: { ...process.env, STATIC_EXPORT: "1", NEXT_PUBLIC_STATIC_PREVIEW: "1" } });
} finally {
  for (const [from, to] of moved) if (existsSync(to)) renameSync(to, from);
  rmSync(asideDir, { recursive: true, force: true });
}

const walk = (dir) => readdirSync(dir).flatMap((n) => { const p = join(dir, n); return statSync(p).isDirectory() ? walk(p) : [p]; });
mkdirSync(out);
for (const f of walk(dist)) {
  const rel = relative(dist, f);
  if (rel.endsWith(".txt") || /^(robots\.txt|sitemap\.xml|_not-found\.html)$/.test(rel)) continue;
  mkdirSync(join(out, rel, ".."), { recursive: true });
  cpSync(f, join(out, rel));
}
renameSync(join(out, "_next"), join(out, "nxt"));

const pairs = [
  ['href="/icon.svg"', 'href="icon.svg"'], ['href="/apple-icon.png"', 'href="apple-icon.png"'],
  ['href="/mentions-legales"', 'href="mentions-legales.html"'], ['href="/confidentialite"', 'href="confidentialite.html"'],
  ['\\"/mentions-legales\\"', '\\"mentions-legales.html\\"'], ['\\"/confidentialite\\"', '\\"confidentialite.html\\"'],
  ['\\"/icon.svg\\"', '\\"icon.svg\\"'], ['\\"/apple-icon.png\\"', '\\"apple-icon.png\\"'],
];
for (const f of walk(out)) {
  if (!/\.(html|js|css)$/.test(f)) continue;
  let s = readFileSync(f, "utf8");
  const before = s;
  s = s.replaceAll("_next/", "nxt/").replaceAll("\uFFFD", "\\ufffd");
  if (f.endsWith(".html")) {
    for (const [a, b] of pairs) s = s.replaceAll(a, b);
    if (!f.endsWith("index.html")) s = s.replaceAll('href="/"', 'href="index.html"').replaceAll('\\"href\\":\\"/\\"', '\\"href\\":\\"index.html\\"');
  }
  if (s !== before) writeFileSync(f, s);
}
const files = walk(out).map((f) => relative(out, f)).filter((f) => f !== "index.html").sort();
writeFileSync(join(out, "files.json"), JSON.stringify(files.map((path) => ({ path }))));
console.log(`\nAperçu exporté dans out/ (${files.length + 1} fichiers).`);
