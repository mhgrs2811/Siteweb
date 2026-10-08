/**
 * Serves the static web export (dist/) and captures screenshots of every screen in light and
 * dark mode, French and English, at iPhone size, with the persisted state each one needs.
 *
 * Usage: EXPO_PUBLIC_ENABLE_DEV_SCREENS=true npx expo export --platform web --clear
 *        node scripts/preview-web.mjs
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

/** Persisted onboarding answers, exactly as the Zustand store writes them. */
const ANSWERS = {
  firstName: 'Camille',
  ageBand: '30_34',
  skinType: 'combination',
  goals: ['glow', 'hydration'],
  sensitivities: ['fragrance'],
  routineLevel: 'basic',
  monthlyBudget: '20_50',
  lifestyle: { sleep: '7_8', water: '1_2', sun: 'sometimes', makeup: true },
  photoConsent: { acceptedAt: null, version: null, keepPhotos: true },
  notificationsOptIn: null,
};

const ONBOARDING_STATES = {
  fresh: null,
  started: {
    answers: ANSWERS,
    status: 'in_progress',
    furthestStep: 'lifestyle',
    startedAt: '2026-10-08T09:00:00.000Z',
    completedAt: null,
    pendingSync: false,
  },
  completed: {
    answers: {
      ...ANSWERS,
      photoConsent: {
        acceptedAt: '2026-10-08T09:30:00.000Z',
        version: '2026-10-v1',
        keepPhotos: true,
      },
      notificationsOptIn: true,
    },
    status: 'completed',
    furthestStep: 'capture-guide',
    startedAt: '2026-10-08T09:00:00.000Z',
    completedAt: '2026-10-08T09:32:00.000Z',
    pendingSync: false,
  },
  blocked: {
    answers: { ...ANSWERS, ageBand: 'under_16' },
    status: 'blocked_age',
    furthestStep: 'age',
    startedAt: '2026-10-08T09:00:00.000Z',
    completedAt: null,
    pendingSync: false,
  },
};

const shot = (
  file,
  route,
  { theme = 'light', language = 'fr', fullPage = false, onboarding = 'fresh' } = {},
) => ({ file, route, theme, language, fullPage, onboarding });

const SHOTS = [
  shot('welcome-light-fr.png', '/welcome'),
  shot('welcome-dark-fr.png', '/welcome', { theme: 'dark' }),
  shot('welcome-light-en.png', '/welcome', { language: 'en' }),
  shot('welcome-full-light-fr.png', '/welcome', { fullPage: true }),
  shot('welcome-resume-light-fr.png', '/welcome', { fullPage: true, onboarding: 'started' }),
  shot('name-light-fr.png', '/name', { onboarding: 'started' }),
  shot('name-dark-fr.png', '/name', { theme: 'dark', onboarding: 'started' }),
  shot('age-light-fr.png', '/age', { onboarding: 'started' }),
  shot('age-dark-fr.png', '/age', { theme: 'dark', onboarding: 'started' }),
  shot('skin-type-light-fr.png', '/skin-type', { onboarding: 'started' }),
  shot('skin-type-dark-fr.png', '/skin-type', { theme: 'dark', onboarding: 'started' }),
  shot('goals-light-fr.png', '/goals', { onboarding: 'started' }),
  shot('goals-dark-fr.png', '/goals', { theme: 'dark', onboarding: 'started' }),
  shot('goals-light-en.png', '/goals', { language: 'en', onboarding: 'started' }),
  shot('sensitivities-light-fr.png', '/sensitivities', { onboarding: 'started' }),
  shot('sensitivities-dark-fr.png', '/sensitivities', { theme: 'dark', onboarding: 'started' }),
  shot('routine-light-fr.png', '/routine', { fullPage: true, onboarding: 'started' }),
  shot('routine-dark-fr.png', '/routine', { theme: 'dark', fullPage: true, onboarding: 'started' }),
  shot('lifestyle-light-fr.png', '/lifestyle', { fullPage: true, onboarding: 'started' }),
  shot('lifestyle-dark-fr.png', '/lifestyle', {
    theme: 'dark',
    fullPage: true,
    onboarding: 'started',
  }),
  shot('proof-light-fr.png', '/proof', { onboarding: 'started' }),
  shot('proof-dark-fr.png', '/proof', { theme: 'dark', onboarding: 'started' }),
  shot('consent-light-fr.png', '/consent', { fullPage: true, onboarding: 'started' }),
  shot('consent-dark-fr.png', '/consent', { theme: 'dark', fullPage: true, onboarding: 'started' }),
  shot('consent-light-en.png', '/consent', {
    language: 'en',
    fullPage: true,
    onboarding: 'started',
  }),
  shot('notifications-light-fr.png', '/notifications', { onboarding: 'started' }),
  shot('notifications-dark-fr.png', '/notifications', { theme: 'dark', onboarding: 'started' }),
  shot('capture-guide-light-fr.png', '/capture-guide', { fullPage: true, onboarding: 'started' }),
  shot('capture-guide-dark-fr.png', '/capture-guide', {
    theme: 'dark',
    fullPage: true,
    onboarding: 'started',
  }),
  shot('done-light-fr.png', '/done', { fullPage: true, onboarding: 'completed' }),
  shot('done-dark-fr.png', '/done', { theme: 'dark', fullPage: true, onboarding: 'completed' }),
  shot('too-young-light-fr.png', '/too-young', { onboarding: 'blocked' }),
  shot('too-young-dark-en.png', '/too-young', {
    theme: 'dark',
    language: 'en',
    onboarding: 'blocked',
  }),
  shot('home-light-fr.png', '/home', { fullPage: true, onboarding: 'completed' }),
  shot('home-dark-fr.png', '/home', { theme: 'dark', fullPage: true, onboarding: 'completed' }),
  shot('home-light-en.png', '/home', { language: 'en', fullPage: true, onboarding: 'completed' }),
  shot('sheet-privacy-light-fr.png', '/legal/privacy', { fullPage: true }),
  shot('sheet-photos-light-fr.png', '/settings/photos', {
    fullPage: true,
    onboarding: 'completed',
  }),
  shot('sheet-photos-missing-dark-fr.png', '/settings/photos', {
    theme: 'dark',
    fullPage: true,
    onboarding: 'started',
  }),
  shot('sheet-appearance-light-fr.png', '/settings/appearance'),
  shot('design-system-light-fr.png', '/dev/design-system', { fullPage: true }),
  shot('design-system-dark-fr.png', '/dev/design-system', { theme: 'dark', fullPage: true }),
];

async function main() {
  if (!existsSync(dist)) {
    throw new Error('dist/ not found. Run `npx expo export --platform web` first.');
  }
  await mkdir(outDir, { recursive: true });
  const server = await serve();
  const browser = await chromium.launch();
  try {
    for (const current of SHOTS) {
      const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 2,
        colorScheme: current.theme,
        locale: current.language === 'fr' ? 'fr-FR' : 'en-US',
      });
      // Persisted preferences and onboarding state, exactly as the app would store them.
      await context.addInitScript(
        ({ theme, language, onboarding }) => {
          window.localStorage.setItem(
            'lume.preferences.v1',
            JSON.stringify({
              state: { themeMode: theme, language, hapticsEnabled: true },
              version: 0,
            }),
          );
          if (onboarding) {
            window.localStorage.setItem(
              'lume.onboarding.v1',
              JSON.stringify({ state: onboarding, version: 0 }),
            );
          } else {
            window.localStorage.removeItem('lume.onboarding.v1');
          }
        },
        {
          theme: current.theme,
          language: current.language,
          onboarding: ONBOARDING_STATES[current.onboarding],
        },
      );
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text());
      });
      await page.goto(`http://localhost:${PORT}${current.route}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      // Let entering animations, the score ring and the shimmer settle.
      await page.waitForTimeout(2500);
      if (current.fullPage) {
        // React Native Web scrolls inside a 100vh container, so `fullPage` would only capture
        // the viewport. Grow the viewport by the hidden overflow instead, so a pinned footer
        // keeps its place under the fully expanded content.
        const overflow = await page.evaluate(() =>
          Math.max(
            0,
            ...Array.from(document.querySelectorAll('*')).map(
              (el) => el.scrollHeight - el.clientHeight,
            ),
          ),
        );
        const contentHeight = 844 + overflow;
        await page.setViewportSize({ width: 390, height: Math.min(contentHeight + 8, 12000) });
        await page.waitForTimeout(800);
        await page.screenshot({ path: path.join(outDir, current.file) });
        // Readable segments for review, 1690 px tall each, only when the page needs them.
        const segmentHeight = 1690;
        const segments = Math.ceil(contentHeight / segmentHeight);
        for (let index = 0; segments > 1 && index < segments; index += 1) {
          await page.screenshot({
            path: path.join(outDir, current.file.replace('.png', `-${index + 1}.png`)),
            clip: {
              x: 0,
              y: index * segmentHeight,
              width: 390,
              height: Math.min(segmentHeight, contentHeight - index * segmentHeight),
            },
          });
        }
      } else {
        await page.screenshot({ path: path.join(outDir, current.file) });
      }
      process.stdout.write(
        `wrote ${current.file}${errors.length ? ` (${errors.length} console errors)` : ''}\n`,
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
