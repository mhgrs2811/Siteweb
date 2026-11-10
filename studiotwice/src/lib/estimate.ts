import { pricing, type OptionId, type SiteId } from "@/content/pricing";
import { useSyncExternalStore } from "react";

export interface Selection {
  site: SiteId;
  pages: number;
  options: Record<OptionId, boolean>;
  photoHalfDays: number;
  hosting: boolean;
}

export interface Line {
  id: string;
  label: string;
  note?: string;
  amount: number;
  /** Ligne comprise dans la formule : affichée, mais à 0 €. */
  included?: boolean;
}

export interface Estimate {
  total: number;
  lines: Line[];
  monthly: number;
  delayWeeks: [number, number];
  delayLabel: string;
  summary: string;
}

export const defaultSelection: Selection = {
  site: "vitrine",
  pages: 6,
  options: { copy: false, photo: false, language: false, logo: false, googleBusiness: false },
  photoHalfDays: 1,
  hosting: true,
};

export const siteById = (id: SiteId) => pricing.sites.find((s) => s.id === id) ?? pricing.sites[0];

/** 1 890 € avec une espace fine insécable, sans dépendre de l'ICU du serveur. */
export const formatEuro = (n: number) =>
  `${Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ")} €`;

export const delayLabel = ([a, b]: [number, number]) =>
  a === b ? `${a} semaine${a > 1 ? "s" : ""}` : `${a} à ${b} semaines`;

export function computeEstimate(sel: Selection): Estimate {
  const site = siteById(sel.site);
  const o = pricing.options;
  const lines: Line[] = [];
  let min = site.delayWeeks[0];
  let max = site.delayWeeks[1];

  lines.push({ id: "site", label: site.name, note: site.promise, amount: site.from });

  const pages = site.extraPages ? Math.min(site.pagesMax, Math.max(site.pagesMin, sel.pages)) : site.pagesIncluded;
  const extra = Math.max(0, pages - site.pagesIncluded);
  if (extra > 0) {
    lines.push({
      id: "pages",
      label: `${extra} page${extra > 1 ? "s" : ""} supplémentaire${extra > 1 ? "s" : ""}`,
      note: `${formatEuro(pricing.extraPage)} par page au-delà de ${site.pagesIncluded}`,
      amount: extra * pricing.extraPage,
    });
  }
  const siteTotal = site.from + extra * pricing.extraPage;

  if (sel.options.copy) {
    const over = Math.max(0, pages - o.copy.basePages);
    lines.push({
      id: "copy",
      label: o.copy.name,
      note: over > 0 ? `${pages} pages` : undefined,
      amount: o.copy.base + over * o.copy.perExtraPage,
    });
    min += o.copy.delayWeeks;
    max += o.copy.delayWeeks;
  }
  if (sel.options.photo) {
    const n = Math.min(o.photo.maxHalfDays, Math.max(1, sel.photoHalfDays));
    lines.push({
      id: "photo",
      label: o.photo.name,
      note: `${n} demi-journée${n > 1 ? "s" : ""}`,
      amount: n * o.photo.perHalfDay,
    });
  }
  if (sel.options.language) {
    lines.push({
      id: "language",
      label: o.language.name,
      note: `${o.language.percent} % du site`,
      amount: Math.max(o.language.minimum, Math.round((siteTotal * o.language.percent) / 100)),
    });
    min += o.language.delayWeeks;
    max += o.language.delayWeeks;
  }
  if (sel.options.logo) {
    lines.push({ id: "logo", label: o.logo.name, amount: o.logo.price });
    min += o.logo.delayWeeks;
    max += o.logo.delayWeeks;
  }
  if (site.googleBusinessIncluded) {
    lines.push({ id: "googleBusiness", label: o.googleBusiness.name, note: "comprise", amount: 0, included: true });
  } else if (sel.options.googleBusiness) {
    lines.push({ id: "googleBusiness", label: o.googleBusiness.name, amount: o.googleBusiness.price });
  }

  const total = lines.reduce((s, l) => s + l.amount, 0);
  const monthly = sel.hosting ? pricing.hosting.monthly : 0;
  const delay: [number, number] = [min, max];

  const summary = [
    ...lines.map((l) => `${l.label}${l.note ? ` (${l.note})` : ""} : ${l.included ? "comprise" : formatEuro(l.amount)}`),
    `Total estimé : ${formatEuro(total)} ${pricing.vat}`,
    monthly ? `${pricing.hosting.name} : ${formatEuro(monthly)} par mois` : null,
    `Délai indicatif : ${delayLabel(delay)}`,
  ]
    .filter(Boolean)
    .join("\n");

  return { total, lines, monthly, delayWeeks: delay, delayLabel: delayLabel(delay), summary };
}

/* ------------------------------------------------------------------ */
/* Petit magasin partagé entre le configurateur et le formulaire       */
/* ------------------------------------------------------------------ */
let state: Selection = defaultSelection;
const listeners = new Set<() => void>();

export const getSelection = () => state;
export const setSelection = (next: Selection | ((s: Selection) => Selection)) => {
  state = typeof next === "function" ? next(state) : next;
  listeners.forEach((l) => l());
};
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
export const useSelection = () => useSyncExternalStore(subscribe, getSelection, () => defaultSelection);
