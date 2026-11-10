"use client";

import SectionHead from "@/components/SectionHead";
import Reveal from "@/components/Reveal";
import Arrow from "@/components/Arrow";
import { services as c } from "@/content/sections";
import { formatEuro, setSelection } from "@/lib/estimate";
import type { SiteId } from "@/content/pricing";
import { getLenis } from "@/lib/lenis";

/** Section 03 : trois résultats, trois formules. Chaque rangée a sa propre composition. */
export default function Services() {
  const estimate = (e: React.MouseEvent<HTMLAnchorElement>, id: SiteId) => {
    setSelection((s) => ({ ...s, site: id }));
    const t = document.querySelector<HTMLElement>("#tarifs");
    if (!t) return;
    e.preventDefault();
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(t, { duration: 1.4 });
    else t.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="formules" className="section svc" aria-labelledby="formules-title">
      <SectionHead id="formules" num={c.num} title={c.title} lead={c.lead} />
      <ol className="svc__list">
        {c.items.map((it, i) => (
          <li key={it.siteId} className={`svc__row svc__row--${i + 1}`}>
            <span className="svc__idx t-caption">{String(i + 1).padStart(2, "0")}</span>
            <Reveal as="h3" className="svc__outcome t-display" stagger={0.05}>
              {it.outcome}
            </Reveal>
            <div className="svc__body">
              <p className="svc__text">{it.text}</p>
              <ul className="svc__get">
                {it.get.map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ul>
            </div>
            <div className="svc__price">
              <span className="svc__from">à partir de</span>
              <span className="svc__amount">{formatEuro(it.from)}</span>
              <span className="svc__delay">
                {it.delay[0] === it.delay[1] ? `${it.delay[0]} semaine` : `${it.delay[0]} à ${it.delay[1]} semaines`}
              </span>
              <a className="link svc__cta" href="#tarifs" onClick={(e) => estimate(e, it.siteId as SiteId)}>
                {c.cta}
                <Arrow className="link__arrow" />
              </a>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
