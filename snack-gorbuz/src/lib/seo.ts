import { restaurant } from '@/data/restaurant';
import { openingHoursSpecification, telHref } from '@/lib/hours';

/**
 * Données structurées schema.org (Restaurant / LocalBusiness).
 * Uniquement des informations vérifiées (capture fiche Google).
 * La note Google n'est volontairement PAS injectée en `aggregateRating` :
 * Google demande que cette donnée provienne d'avis réellement hébergés sur le site.
 */
export function restaurantJsonLd(siteUrl: string) {
  const a = restaurant.address;
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': `${siteUrl}/#restaurant`,
    name: restaurant.name,
    url: siteUrl,
    telephone: restaurant.phone.e164,
    priceRange: restaurant.priceRange.schema,
    address: {
      '@type': 'PostalAddress',
      streetAddress: a.street,
      postalCode: a.postalCode,
      addressLocality: a.city,
      addressCountry: a.countryCode,
    },
    openingHoursSpecification: openingHoursSpecification(),
    image: `${siteUrl}${restaurant.seo.ogImage}`,
  };
  if (restaurant.geo) {
    data.geo = {
      '@type': 'GeoCoordinates',
      latitude: restaurant.geo.lat,
      longitude: restaurant.geo.lng,
    };
  }
  if (restaurant.cta.order.enabled && restaurant.cta.order.url) {
    data.potentialAction = {
      '@type': 'OrderAction',
      target: restaurant.cta.order.url,
    };
  }
  const sameAs = Object.values(restaurant.social).filter((u): u is string => Boolean(u));
  if (sameAs.length) data.sameAs = sameAs;
  return data;
}

export { telHref };
