import { copy } from "@/data/copy";

export const routes = {
  home: "/",
  menu: "/carte",
  concept: "/concept",
  gallery: "/galerie",
  contact: "/contact",
  legal: "/mentions-legales",
  privacy: "/confidentialite",
} as const;

export interface NavItem {
  href: string;
  label: string;
  index: string;
}

export const mainNav: NavItem[] = [
  { href: routes.home, label: copy.nav.home, index: "00" },
  { href: routes.menu, label: copy.nav.menu, index: "01" },
  { href: routes.concept, label: copy.nav.concept, index: "02" },
  { href: routes.gallery, label: copy.nav.gallery, index: "03" },
  { href: routes.contact, label: copy.nav.contact, index: "04" },
];
