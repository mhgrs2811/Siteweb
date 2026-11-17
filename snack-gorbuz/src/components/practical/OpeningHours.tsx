import { copy } from "@/data/copy";
import { siteConfig, weekdayOrder } from "@/data/siteConfig";
import styles from "./OpeningHours.module.css";

interface OpeningHoursProps {
  compact?: boolean;
}

/**
 * Tableau d'horaires piloté par siteConfig.openingHours.
 * Ne rend rien si aucun horaire n'est configuré (le parent gère l'état vide).
 */
export function OpeningHours({ compact }: OpeningHoursProps) {
  if (siteConfig.openingHours.length === 0) return null;

  const byDay = new Map(siteConfig.openingHours.map((d) => [d.day, d]));

  return (
    <div className={[styles.wrap, compact ? styles.compact : ""].filter(Boolean).join(" ")}>
      <dl className={styles.list}>
        {weekdayOrder.map((day) => {
          const entry = byDay.get(day);
          const closed = !entry || entry.slots.length === 0;
          return (
            <div key={day} className={styles.row}>
              <dt className={styles.day}>{day}</dt>
              <dd className={[styles.slots, closed ? styles.closed : ""].filter(Boolean).join(" ")}>
                {closed
                  ? copy.contact.closed
                  : entry.slots.map((s, i) => (
                      <span key={i} className={styles.slot}>
                        {s.from} – {s.to}
                      </span>
                    ))}
                {entry?.note && <span className={styles.note}>{entry.note}</span>}
              </dd>
            </div>
          );
        })}
      </dl>
      {siteConfig.openingNote && <p className={styles.footnote}>{siteConfig.openingNote}</p>}
    </div>
  );
}
