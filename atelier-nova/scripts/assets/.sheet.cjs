// dev helper: contact sheet of a slug's renders → scratchpad/sheet.png
const sharp = require('sharp');
(async () => {
  const d = `public/images/projects/${process.argv[2]}/`;
  const a = await sharp(d + 'cover.webp').resize(800).toBuffer();
  const c = await sharp(d + 'render-1.webp').resize(800).toBuffer();
  const b = await sharp(d + 'render-2.webp').resize(null, 560).toBuffer();
  await sharp({ create: { width: 2058, height: 560, channels: 3, background: '#000' } }).composite([{ input: a, left: 0, top: 0 }, { input: c, left: 805, top: 0 }, { input: b, left: 1610, top: 0 }]).png().toFile(process.argv[3]);
})();
