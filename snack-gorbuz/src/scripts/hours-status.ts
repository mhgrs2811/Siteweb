/**
 * Met en évidence le jour courant et calcule « Ouvert / Fermé » dans le
 * fuseau Europe/Brussels, uniquement à partir des horaires fournis.
 */
type DayKey = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
type DayHours = { open: string; close: string } | null;
type Hours = Record<DayKey, DayHours>;

const DAYS: DayKey[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const LABELS: Record<DayKey, string> = {
  monday: 'lundi',
  tuesday: 'mardi',
  wednesday: 'mercredi',
  thursday: 'jeudi',
  friday: 'vendredi',
  saturday: 'samedi',
  sunday: 'dimanche',
};

function brusselsNow(): { day: DayKey; minutes: number } {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Brussels',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const parts = fmt.formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  const weekdayIndex = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  const hour = Number(get('hour')) % 24;
  const minute = Number(get('minute'));
  return { day: DAYS[weekdayIndex === -1 ? 0 : weekdayIndex], minutes: hour * 60 + minute };
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function nextOpening(hours: Hours, fromDay: DayKey, fromMinutes: number): string {
  const start = DAYS.indexOf(fromDay);
  for (let offset = 0; offset < 7; offset++) {
    const day = DAYS[(start + offset) % 7];
    const h = hours[day];
    if (!h) continue;
    if (offset === 0 && fromMinutes >= toMinutes(h.open)) continue;
    const when = offset === 0 ? 'aujourd’hui' : offset === 1 ? 'demain' : LABELS[day];
    return `ouvre ${when} à ${h.open}`;
  }
  return '';
}

function initHours(): void {
  const blocks = document.querySelectorAll<HTMLElement>('[data-hours]');
  if (!blocks.length) return;
  const { day, minutes } = brusselsNow();

  blocks.forEach((block) => {
    let hours: Hours;
    try {
      hours = JSON.parse(block.dataset.hours ?? '{}') as Hours;
    } catch {
      return;
    }

    block.querySelector(`[data-day="${day}"]`)?.classList.add('is-today');

    const status = block.querySelector<HTMLElement>('[data-hours-status]');
    const text = block.querySelector<HTMLElement>('[data-hours-status-text]');
    if (!status || !text) return;

    const today = hours[day];
    const isOpen = Boolean(today && minutes >= toMinutes(today.open) && minutes < toMinutes(today.close));

    status.classList.toggle('is-open', isOpen);
    status.classList.toggle('is-closed', !isOpen);
    if (isOpen && today) {
      text.textContent = `Ouvert actuellement · ferme à ${today.close}`;
    } else {
      const next = nextOpening(hours, day, minutes);
      text.textContent = next ? `Fermé actuellement · ${next}` : 'Fermé actuellement';
    }
  });
}

initHours();
