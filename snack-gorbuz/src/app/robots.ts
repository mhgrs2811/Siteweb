import type { MetadataRoute } from "next";
import { isLegalComplete, siteConfig } from "@/data/siteConfig";

/**
 * robots.txt — les pages légales incomplètes sont exclues de l'indexation.
 * Le sitemap n'est référencé qu'une fois l'URL de production renseignée.
 */
export default function robots(): MetadataRoute.Robots {
  const disallow = isLegalComplete() ? [] : ["/mentions-legales", "/confidentialite"];
  return {
    rules: [{ userAgent: "*", allow: "/", disallow }],
    sitemap: siteConfig.siteUrl ? `${siteConfig.siteUrl.replace(/\/$/, "")}/sitemap.xml` : undefined,
  };
}
