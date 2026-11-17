import { restaurant, type DayHours, type DayKey } from '@/data/restaurant';

export const DAY_ORDER: DayKey[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

export const DAY_LABELS: Record<DayKey, string> = {
  monday: 'Lundi',
  tuesday: 'Mardi',
  wednesday: 'Mercredi',
  thursday: 'Jeudi',
  friday: 'Vendredi',
  saturday: 'Samedi',
  sunday: 'Dimanche',
};

export const DAY_LABELS_SHORT: Record<DayKey, string> = {
  monday: 'Lun',
  tuesday: 'Mar',
  wednesday: 'Mer',
  thursday: 'Jeu',
  friday: 'Ven',
  saturday: 'Sam',
  sunday: 'Dim',
};

/** "10:30–22:00" ou "Fermé". */
export function formatDayHours(h: DayHours): string {
  if (!h) return 'Fermé';
  return `${h.open}–${h.close}`;
}

export interface HoursRow {
  key: DayKey;
  label: string;
  value: string;
  closed: boolean;
}

export function hoursRows(): HoursRow[] {
  return DAY_ORDER.map((key) => ({
    key,
    label: DAY_LABELS[key],
    value: formatDayHours(restaurant.hours[key]),
    closed: restaurant.hours[key] === null,
  }));
}

/**
 * Regroupe les jours consécutifs ayant les mêmes horaires :
 * ex. « Lun–Ven 10:30–22:00 · Sam 12:00–22:30 · Dim fermé ».
 */
export function compactHours(): { days: string; value: string }[] {
  const groups: { from: DayKey; to: DayKey; value: string }[] = [];
  for (const key of DAY_ORDER) {
    const value = formatDayHours(restaurant.hours[key]);
    const last = groups[groups.length - 1];
    if (last && last.value === value) {
      last.to = key;
    } else {
      groups.push({ from: key, to: key, value });
    }
  }
  return groups.map((g) => ({
    days:
      g.from === g.to
        ? DAY_LABELS_SHORT[g.from]
        : `${DAY_LABELS_SHORT[g.from]}–${DAY_LABELS_SHORT[g.to]}`,
    value: g.value,
  }));
}

/** Adresse sur une ligne : « Leuvensesteenweg 241, 1932 Zaventem ». */
export function addressLine(withCountry = false): string {
  const a = restaurant.address;
  const base = `${a.street}, ${a.postalCode} ${a.city}`;
  return withCountry ? `${base}, ${a.country}` : base;
}

/** Lien d'itinéraire Google Maps construit à partir de l'adresse. */
export function directionsUrl(): string {
  const q = encodeURIComponent(`${restaurant.name}, ${addressLine(true)}`);
  return `https://www.google.com/maps/dir/?api=1&destination=${q}`;
}

/** Lien de recherche de la fiche sur Google Maps (à défaut d'URL fournie). */
export function listingUrl(): string {
  if (restaurant.googleListing.url) return restaurant.googleListing.url;
  const q = encodeURIComponent(`${restaurant.name}, ${addressLine(true)}`);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

export function telHref(): string {
  return `tel:${restaurant.phone.e164}`;
}

/** Spécifications d'horaires pour schema.org (OpeningHoursSpecification). */
export function openingHoursSpecification() {
  const dayName: Record<DayKey, string> = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
  };
  return DAY_ORDER.filter((k) => restaurant.hours[k] !== null).map((k) => {
    const h = restaurant.hours[k] as { open: string; close: string };
    return {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: dayName[k],
      opens: h.open,
      closes: h.close,
    };
  });
}
