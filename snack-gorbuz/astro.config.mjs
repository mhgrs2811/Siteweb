// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * URL publique du site.
 * À renseigner une fois le nom de domaine connu : `SITE_URL=https://www.exemple.be npm run build`
 * ou en remplaçant directement la valeur de repli ci-dessous.
 * Elle sert au sitemap, aux balises canonical et aux URLs Open Graph.
 */
const site = process.env.SITE_URL ?? 'https://snack-gorbuz.example';

export default defineConfig({
  site,
  integrations: [sitemap()],
  build: {
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
});
