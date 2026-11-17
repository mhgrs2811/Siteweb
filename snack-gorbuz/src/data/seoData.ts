import type { Metadata } from "next";
import { siteConfig, isLegalComplete } from "./siteConfig";

/**
 * MÉTADONNÉES SEO PAR PAGE — SNACK GORBUZ
 *
 * Les titres et descriptions sont provisoires et ne contiennent aucune donnée
 * commerciale non confirmée. L'image Open Graph sera ajoutée avec les médias de
 * marque (/public/media/og-gorbuz.jpg, 1200×630).
 */

export interface PageSeo {
  title: string;
  description: string;
  path: string;
  /** false pour les pages incomplètes (légales) → noindex. */
  index?: boolean;
}

export const seoPages = {
  home: {
    title: "Snack Gorbuz — La street-food qui a du caractère",
    description:
      "Durums, kumpirs et mitraillettes : découvrez l'univers Snack Gorbuz, un snack contemporain et généreux en Belgique. Carte, concept, galerie et infos pratiques.",
    path: "/",
  },
  menu: {
    title: "La carte — Snack Gorbuz",
    description:
      "La carte Snack Gorbuz s'organise autour de trois familles : durums, kumpirs et mitraillettes. Le détail des produits et des prix sera publié prochainement.",
    path: "/carte",
  },
  concept: {
    title: "L'esprit Gorbuz — Le concept",
    description:
      "Snack Gorbuz, c'est la street-food avec du caractère : des produits généreux, une identité affirmée et un accueil chaleureux.",
    path: "/concept",
  },
  gallery: {
    title: "Galerie — L'univers Snack Gorbuz",
    description:
      "Produits, lieu, coulisses et équipe : la galerie Snack Gorbuz accueillera bientôt les photos du snack.",
    path: "/galerie",
  },
  contact: {
    title: "Nous trouver — Snack Gorbuz",
    description:
      "Adresse, horaires et contact de Snack Gorbuz. Les informations pratiques seront publiées dès leur validation.",
    path: "/contact",
  },
  legal: {
    title: "Mentions légales — Snack Gorbuz",
    description: "Mentions légales du site Snack Gorbuz.",
    path: "/mentions-legales",
    index: isLegalComplete(),
  },
  privacy: {
    title: "Politique de confidentialité — Snack Gorbuz",
    description: "Politique de confidentialité et traitement des données du site Snack Gorbuz.",
    path: "/confidentialite",
    index: isLegalComplete(),
  },
} satisfies Record<string, PageSeo>;

export function buildMetadata(page: PageSeo): Metadata {
  const index = page.index ?? true;
  return {
    title: page.title,
    description: page.description,
    alternates: siteConfig.siteUrl ? { canonical: page.path } : undefined,
    robots: index ? undefined : { index: false, follow: true },
    openGraph: {
      title: page.title,
      description: page.description,
      type: "website",
      locale: "fr_BE",
      siteName: siteConfig.name,
      url: siteConfig.siteUrl ? page.path : undefined,
    },
    twitter: {
      card: "summary",
      title: page.title,
      description: page.description,
    },
  };
}
