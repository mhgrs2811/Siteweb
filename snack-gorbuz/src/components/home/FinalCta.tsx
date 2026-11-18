import Link from "next/link";
import { Stamp } from "@/components/brand/Stamp";
import { Chapter } from "@/components/ui/Chapter";
import { Reveal } from "@/components/ui/Reveal";
import { copy } from "@/data/copy";
import { hasAddress, hasContact, siteConfig } from "@/data/site";
import s from "./FinalCta.module.css";

/** Section 08 — CTA final. Le second bouton n’apparaît qu’avec des données réelles. */
export function FinalCta() {
  const mapsUrl = hasAddress() ? siteConfig.address?.mapsUrl : null;
  return (
    <section className={`tone-dark ${s.section}`} aria-labelledby="final-title">
      <Stamp className={s.stamp} />
      <div className={`container ${s.inner}`}>
        <Reveal>
          <Chapter number="08" label="Et maintenant" />
        </Reveal>
        <Reveal delay={1}>
          <h2 id="final-title" className={`display display-xxl ${s.title}`}>
            {copy.finalCta.title}
          </h2>
        </Reveal>
        <Reveal delay={2} className="lead">
          <p className={s.text}>{copy.finalCta.text}</p>
        </Reveal>
        <Reveal delay={3} className={s.actions}>
          <Link href="/carte" className="btn btn-primary btn-lg">
            {copy.finalCta.cta}
          </Link>
          {mapsUrl ? (
            <a href={mapsUrl} className="btn btn-ghost btn-lg" target="_blank" rel="noopener noreferrer">
              {copy.common.directions}
            </a>
          ) : hasContact() ? (
            <Link href="/contact" className="btn btn-ghost btn-lg">
              {copy.common.contactUs}
            </Link>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
