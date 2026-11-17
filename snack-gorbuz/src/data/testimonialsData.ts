/**
 * AVIS CLIENTS — SNACK GORBUZ
 *
 * Aucun avis, aucune note et aucun nombre d'avis ne doivent être affichés sans
 * source vérifiable (fiche Google Business Profile, autorisation écrite du client).
 * Tant que ce tableau est vide, aucune section « avis » n'est rendue sur le site.
 */

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  /** Source vérifiable, ex. "Google" + URL de la fiche. */
  source: { label: string; url: string | null };
  /** Date ISO de publication de l'avis d'origine. */
  date: string;
  rating?: 1 | 2 | 3 | 4 | 5;
}

export interface RatingSummary {
  /** Note moyenne actuelle, telle qu'affichée par la source. */
  value: number;
  count: number;
  source: { label: string; url: string };
  checkedAt: string;
}

export const testimonials: Testimonial[] = [];

export const ratingSummary: RatingSummary | null = null;

export const hasTestimonials = () => testimonials.length > 0;
