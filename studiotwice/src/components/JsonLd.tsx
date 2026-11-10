import { faq } from "@/content/sections";
import { pricing } from "@/content/pricing";
import { site } from "@/content/site";

/** Données structurées : l'entreprise locale et la foire aux questions. */
export default function JsonLd() {
  const business: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
    description: site.tagline,
    url: site.url,
    image: `${site.url}/og.png`,
    areaServed: site.area,
    knowsLanguage: ["fr-BE"],
    makesOffer: pricing.sites.map((s) => ({
      "@type": "Offer",
      name: s.name,
      description: s.promise,
      ...(pricing.showPrices
        ? {
            price: s.from,
            priceCurrency: "EUR",
            priceSpecification: { "@type": "PriceSpecification", price: s.from, priceCurrency: "EUR", valueAddedTaxIncluded: false },
          }
        : {}),
    })),
  };
  if (pricing.showPrices) business.priceRange = `${pricing.sites[0].from} € - ${pricing.sites[2].from} €`;
  // TODO: ces champs s'affichent dès qu'ils sont renseignés dans src/content/site.ts
  if (site.phone) business.telephone = site.phone;
  if (site.email) business.email = site.email;
  if (site.bce) business.vatID = site.bce;
  if (site.address.city) {
    business.address = {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      postalCode: site.address.postal,
      addressLocality: site.address.city,
      addressCountry: "BE",
    };
  }

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(business) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
    </>
  );
}
