import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";
import { projects } from "@/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = [
    { path: "/", priority: 1 },
    { path: "/services", priority: 0.9 },
    { path: "/realisations", priority: 0.9 },
    { path: "/tarifs", priority: 0.8 },
    { path: "/a-propos", priority: 0.7 },
    { path: "/contact", priority: 0.8 },
    { path: "/mentions-legales", priority: 0.2 },
    { path: "/confidentialite", priority: 0.2 },
  ];
  return [
    ...pages.map((p) => ({ url: absoluteUrl(p.path), lastModified: now, changeFrequency: "monthly" as const, priority: p.priority })),
    ...projects.map((p) => ({ url: absoluteUrl(`/realisations/${p.slug}`), lastModified: now, changeFrequency: "yearly" as const, priority: 0.6 })),
  ];
}
