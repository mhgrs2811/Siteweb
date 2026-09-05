import type { TFunction } from 'i18next';

/** Date relative en langage simple (« aujourd'hui », « il y a 3 jours »). */
export function formatRelativeDate(iso: string | null, t: TFunction, now: Date = new Date()): string {
  if (!iso) return t('common.unknownDate');
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return t('common.unknownDate');
  const days = Math.floor((startOfDay(now).getTime() - startOfDay(date).getTime()) / 86_400_000);
  if (days <= 0) return t('common.today');
  if (days === 1) return t('common.yesterday');
  if (days < 60) return t('common.daysAgo', { count: days });
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
