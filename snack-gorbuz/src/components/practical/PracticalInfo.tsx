import { ArrowUpRight, Clock, Mail, Phone, Pin } from "@/components/ui/Icons";
import { copy } from "@/data/copy";
import { hasAddress, hasContact, hasHours, siteConfig } from "@/data/site";
import { formatAddressLines, hoursRows, telHref } from "@/lib/format";
import s from "./PracticalInfo.module.css";

interface PracticalInfoProps {
  variant?: "compact" | "full";
  titles?: { address: string; hours: string; contact: string };
  className?: string;
}

function Soon({ text }: { text: string }) {
  return (
    <div className={`ticket ${s.soon}`}>
      <span className={s.soonLabel}>{copy.common.soon}</span>
      <p className={s.soonText}>{text}</p>
    </div>
  );
}

/**
 * Blocs Adresse / Horaires / Contact (H3), alimentés uniquement par siteConfig.
 * Les champs vides affichent un état provisoire sobre, jamais une donnée inventée.
 */
export function PracticalInfo({ variant = "compact", titles, className }: PracticalInfoProps) {
  const { address, phone, email, openingHours, hoursNote } = siteConfig;
  const t = titles ?? {
    address: copy.practical.addressTitle,
    hours: copy.practical.hoursTitle,
    contact: copy.practical.contactTitle,
  };
  const full = variant === "full";

  return (
    <div className={[s.grid, full ? s.full : "", className].filter(Boolean).join(" ")}>
      <div className={s.block}>
        <div className={s.head}>
          <Pin />
          <h3 className={s.title}>{t.address}</h3>
        </div>
        {hasAddress() && address ? (
          <>
            <p className={s.lines}>
              {formatAddressLines(address).map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>
            {address.mapsUrl && (
              <p className={s.actions}>
                <a className="btn btn-solid" href={address.mapsUrl} target="_blank" rel="noopener noreferrer">
                  {copy.common.directions}
                  <ArrowUpRight />
                </a>
              </p>
            )}
          </>
        ) : (
          <Soon text={copy.practical.addressSoon} />
        )}
      </div>

      <div className={s.block}>
        <div className={s.head}>
          <Clock />
          <h3 className={s.title}>{t.hours}</h3>
        </div>
        {hasHours() ? (
          <>
            <dl className={s.hours}>
              {hoursRows(openingHours, copy.practical.closed).map((row) => (
                <div key={row.day} style={{ display: "contents" }}>
                  <dt>{row.day}</dt>
                  <dd className={row.closed ? s.closed : undefined}>{row.value}</dd>
                </div>
              ))}
            </dl>
            {hoursNote && <p className="small muted">{hoursNote}</p>}
          </>
        ) : (
          <Soon text={copy.practical.hoursSoon} />
        )}
      </div>

      <div className={s.block}>
        <div className={s.head}>
          <Phone />
          <h3 className={s.title}>{t.contact}</h3>
        </div>
        {hasContact() ? (
          <ul className={s.contactList}>
            {phone && (
              <li>
                <a href={telHref(phone)}>
                  <Phone />
                  {phone}
                </a>
              </li>
            )}
            {email && (
              <li>
                <a href={`mailto:${email}`}>
                  <Mail />
                  {email}
                </a>
              </li>
            )}
          </ul>
        ) : (
          <Soon text={copy.practical.contactSoon} />
        )}
      </div>

      {full && address?.mapEmbedUrl && (
        <iframe
          className={s.map}
          src={address.mapEmbedUrl}
          title={`Plan d’accès — ${siteConfig.brand.name}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      )}
      {full && !address && <p className={`small muted ${s.mapSoon}`}>{copy.contactPage.mapSoon}</p>}
      {full && !hasContact() && <p className={s.noForm}>{copy.contactPage.noForm}</p>}
    </div>
  );
}
