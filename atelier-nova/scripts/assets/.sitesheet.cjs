// dev helper: contact sheet of a slug's site screenshots
const sharp = require('sharp');
(async () => {
  const d = `public/images/projects/${process.argv[2]}/`;
  const a = await sharp(d + 'desktop-hero.webp').resize(960).toBuffer();
  const b = await sharp(d + 'detail-1.webp').resize(960).toBuffer();
  const f = await sharp(d + 'desktop-full.webp').resize(320).toBuffer();
  const fm = await sharp(f).metadata();
  const m = await sharp(d + 'mobile-1.webp').resize(null, 600).toBuffer();
  const m2 = await sharp(d + 'mobile-2.webp').resize(null, 600).toBuffer();
  await sharp({ create: { width: 1930, height: Math.max(1210, 605 + Math.min(fm.height, 1400)), channels: 3, background: '#888' } })
    .composite([{ input: a, left: 0, top: 0 }, { input: b, left: 970, top: 0 }, { input: m, left: 0, top: 605 }, { input: m2, left: 290, top: 605 }, { input: await sharp(f).extract({ left: 0, top: 0, width: 320, height: Math.min(fm.height, 1400) }).toBuffer(), left: 1600, top: 605 }])
    .png().toFile(process.argv[3]);
})();
