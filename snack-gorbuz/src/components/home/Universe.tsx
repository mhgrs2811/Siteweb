import Link from "next/link";
import { Stamp } from "@/components/brand/Stamp";
import { Chapter } from "@/components/ui/Chapter";
import { Reveal } from "@/components/ui/Reveal";
import { copy } from "@/data/copy";
import { hasAddress, siteConfig } from "@/data/site";
import { formatAddressLines } from "@/lib/format";
import s from "./Universe.module.css";

/** Section 05 — L’univers Gorbuz : identité de marque (planche de spécimens). */
export function Universe() {
  const { motifs } = copy.universe;
  const address = siteConfig.address;

  return (
    <section className={`tone-dark ${s.section}`} aria-labelledby="univers-title">
      <div className={`container ${s.grid}`}>
        <Reveal className={s.head}>
          <Chapter number="05" label="L’univers" />
          <h2 id="univers-title" className="display display-xl">
            {copy.universe.title}
          </h2>
        </Reveal>

        <Reveal className={s.intro} delay={1}>
          {hasAddress() && address && (
            <div className={s.address}>
              <h3>{copy.universe.addressTitle}</h3>
              <p>{formatAddressLines(address).slice(0, 2).join(", ")}</p>
            </div>
          )}
          <h3>{copy.universe.identityTitle}</h3>
          {copy.universe.identityText.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </Reveal>

        <Reveal className={s.sheet} delay={1}>
          <div className={`${s.spec} ${s.specLettering}`}>
            <span className={s.lettering} aria-hidden="true">
              Gorbuz
            </span>
            <span className={s.specLabel}>{motifs[0].label}</span>
            <p className={s.specText}>{motifs[0].text}</p>
          </div>
          <div className={`${s.spec} ${s.specStamp}`}>
            <Stamp className={s.stamp} />
            <span className={s.specLabel}>{motifs[1].label}</span>
            <p className={s.specText}>{motifs[1].text}</p>
          </div>
          <div className={`${s.spec} ${s.specTicket}`}>
            <p className={`ticket ${s.miniTicket}`} aria-hidden="true">
              <span>Snack Gorbuz</span>
              <b>Belgique</b>
            </p>
            <span className={s.specLabel}>{motifs[2].label}</span>
            <p className={s.specText}>{motifs[2].text}</p>
          </div>
          <div className={`${s.spec} ${s.specCut}`}>
            <div className={s.cutInner} aria-hidden="true" />
            <span className={s.specLabel}>{motifs[3].label}</span>
            <p className={s.specText}>{motifs[3].text}</p>
          </div>
        </Reveal>

        <div className={s.cta}>
          <Link href="/concept" className="btn btn-ghost btn-lg">
            {copy.universe.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
