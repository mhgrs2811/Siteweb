import { dayNames } from "@/data/site";
import type { OpeningSlot } from "@/data/types";

/** Prix en euros, format belge francophone (ex. « 9,50 € »). */
export const formatPrice = (value: number): string =>
  new Intl.NumberFormat("fr-BE", { style: "currency", currency: "EUR", minimumFractionDigits: 2 }).format(value);

/** « 11:30-14:00 » → « 11h30 – 14h00 » */
export const formatRange = (range: string): string => {
  const [start, end] = range.split("-");
  const h = (t: string) => t.replace(":", "h");
  return `${h(start)} – ${h(end)}`;
};

export interface HoursRow {
  day: string;
  value: string;
  closed: boolean;
}

/** Transforme les créneaux en lignes affichables, lundi en premier. */
export const hoursRows = (slots: OpeningSlot[], closedLabel: string): HoursRow[] => {
  const order: OpeningSlot["day"][] = [1, 2, 3, 4, 5, 6, 0];
  return order
    .map((day) => slots.find((s) => s.day === day))
    .filter((s): s is OpeningSlot => Boolean(s))
    .map((s) => ({
      day: dayNames[s.day],
      value: s.ranges.length ? s.ranges.map(formatRange).join(" / ") : closedLabel,
      closed: s.ranges.length === 0,
    }));
};

/** Numéro affiché → href tel: (chiffres et + uniquement). */
export const telHref = (phone: string): string => `tel:${phone.replace(/[^\d+]/g, "")}`;

export const formatAddressLines = (a: {
  street: string;
  postalCode: string;
  city: string;
  country: string;
}): string[] => [a.street, `${a.postalCode} ${a.city}`, a.country];
