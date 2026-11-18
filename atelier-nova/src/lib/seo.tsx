import type { Metadata } from "next";
import { site, absoluteUrl } from "@/config/site";
import { services } from "@/content";
import type { FaqItem } from "@/content/fr/faq";

/** Métadonnées d’une page : titre, description, canonical et Open Graph uniques. */
export function pageMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} · ${site.name}`,
      description,
      url: path,
      images: [{ url: image ?? "/og.jpg", width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title: `${title} · ${site.name}`, description },
  };
}

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // Échappement de « < » pour éviter toute injection dans la balise script.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": absoluteUrl("/#organisation"),
    name: site.name,
    description: site.description,
    url: site.url,
    email: site.contact.email,
    ...(site.contact.phone ? { telephone: site.contact.phone } : {}),
    image: absoluteUrl("/og.jpg"),
    logo: absoluteUrl("/icon.svg"),
    areaServed: [{ "@type": "Country", name: "Belgique" }],
    address: { "@type": "PostalAddress", addressLocality: site.city, addressCountry: "BE" },
    sameAs: site.socials.map((s) => s.href),
    knowsLanguage: ["fr"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.title, description: s.summary },
      })),
    },
  };
}

export function faqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}
