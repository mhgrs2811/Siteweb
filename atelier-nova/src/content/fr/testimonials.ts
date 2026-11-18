import { deepTypo } from "@/lib/typo";

/**
 * TÉMOIGNAGES
 * Ne jamais inventer de témoignage. Tant que `placeholder: true`, le composant
 * affiche clairement un emplacement réservé.
 * Pour publier un vrai témoignage (avec l’accord écrit du client) :
 * remplacer quote/author/role/company et passer `placeholder` à false.
 */
export type Testimonial = {
  placeholder: boolean;
  quote: string;
  author: string;
  role: string;
  company: string;
  project?: string;
};

export const testimonials: Testimonial[] = deepTypo([
  {
    placeholder: true,
    quote: "Emplacement réservé au témoignage de l’un de nos premiers clients.",
    author: "Prénom Nom",
    role: "Fonction",
    company: "Entreprise",
  },
  {
    placeholder: true,
    quote: "Emplacement réservé : nous publierons ici uniquement des avis réels, avec l’accord de leurs auteurs.",
    author: "Prénom Nom",
    role: "Fonction",
    company: "Entreprise",
  },
]);

export const testimonialsNote = deepTypo({
  label: "Emplacement réservé",
  text: "Atelier Nova publiera ici les retours de ses clients, tels quels et avec leur accord. Nous ne publions jamais de témoignages inventés.",
});
