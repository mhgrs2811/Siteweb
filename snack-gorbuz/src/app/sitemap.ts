import type { MetadataRoute } from "next";
import { isLegalComplete, siteConfig } from "@/data/siteConfig";
import { routes } from "@/lib/routes";

/**
 * sitemap.xml — généré uniquement avec une URL de production configurée.
 * Sans siteUrl, retourne une liste vide plutôt qu'un domaine inventé.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteConfig.siteUrl) return [];
  const base = siteConfig.siteUrl.replace(/\/$/, "");
  const now = new Date();
  const main = [routes.home, routes.menu, routes.concept, routes.gallery, routes.contact];
  const legal = isLegalComplete() ? [routes.legal, routes.privacy] : [];
  return [...main, ...legal].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === routes.menu ? "weekly" : "monthly",
    priority: path === routes.home ? 1 : path === routes.menu ? 0.9 : 0.6,
  }));
}
