"use client";

import { useEffect, useRef, useState } from "react";
import { pricing, type OptionId, type SiteId } from "@/content/pricing";
import { computeEstimate, formatEuro, setSelection, siteById, useSelection } from "@/lib/estimate";
import { setupGsap } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";
import Arrow from "@/components/Arrow";
import Magnetic from "@/components/Magnetic";
import PlanSketch from "./PlanSketch";

const optionOrder: OptionId[] = ["copy", "photo", "language", "logo", "googleBusiness"];

function Stepper({
  value,
  min,
  max,
  onChange,
  label,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  label: string;
}) {
  return (
    <div className="stepper" role="group" aria-label={label}>
      <button type="button" className="stepper__btn" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label="Moins">
        <svg viewBox="0 0 12 12" aria-hidden="true">
          <path d="M1 6h10" />
        </svg>
      </button>
      <output className="stepper__value" aria-live="polite">
        {value}
      </output>
      <button type="button" className="stepper__btn" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label="Plus">
        <svg viewBox="0 0 12 12" aria-hidden="true">
          <path d="M1 6h10M6 1v10" />
        </svg>
      </button>
    </div>
  );
}

const delayText = ([a, b]: readonly [number, number] | readonly number[]) =>
  a === b ? `${a} semaine${a > 1 ? "s" : ""}` : `${a} à ${b} semaines`;

const scrollTo = (sel: string) => {
  const t = document.querySelector<HTMLElement>(sel);
  if (!t) return;
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(t, { duration: 1.3, offset: -110 });
  else t.scrollIntoView({ behavior: "smooth" });
};

/**
 * Section 04 : les trois formules en cartes, une bascule HTVA / TVAC, un bandeau pour
 * ceux qui hésitent, puis un panneau pour affiner (pages, options, entretien) avec
 * l'estimation qui se met à jour.
 */
export default function Configurator() {
  const sel = useSelection();
  const est = computeEstimate(sel);
  const site = siteById(sel.site);
  const show = pricing.showPrices;
  const [ttc, setTtc] = useState(false);
  const factor = ttc ? 1 + pricing.vatRate / 100 : 1;
  const vatLabel = ttc ? "TVAC" : pricing.vat;
  const money = (n: number) => formatEuro(n * factor);
  const totalEl = useRef<HTMLSpanElement>(null);
  const shown = useRef(est.total);
  const first = useRef(true);
  const shownTotal = est.total * factor;

  useEffect(() => {
    const el = totalEl.current;
    if (!el || !pricing.showPrices) return;
    const gsap = setupGsap();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const proxy = { v: shown.current };
    if (first.current || reduce) {
      first.current = false;
      shown.current = shownTotal;
      el.textContent = formatEuro(shownTotal);
      return;
    }
    const tw = gsap.to(proxy, {
      v: shownTotal,
      duration: 0.9,
      ease: "studio",
      onUpdate: () => {
        shown.current = proxy.v;
        el.textContent = formatEuro(proxy.v);
      },
    });
    gsap.fromTo(el, { y: -4, opacity: 0.6 }, { y: 0, opacity: 1, duration: 0.6, ease: "studio" });
    return () => {
      tw.kill();
    };
  }, [shownTotal]);

  const pickSite = (id: SiteId) =>
    setSelection((s) => {
      const next = siteById(id);
      return { ...s, site: id, pages: Math.min(next.pagesMax, Math.max(next.pagesMin, s.pages)) };
    });
  const toggle = (id: OptionId) => setSelection((s) => ({ ...s, options: { ...s.options, [id]: !s.options[id] } }));

  return (
    <section id="tarifs" className="section conf" aria-labelledby="tarifs-title">
      <div className="section__head">
        <span className="section__num t-caption">04</span>
        <h2 id="tarifs-title" className="t-display section__title">
          {show ? "Un site clair, à un prix clair." : "Trois formules, un devis clair."}
        </h2>
      </div>
      <div className="conf__intro">
        <p className="section__lead conf__lead">
          {show
            ? "Trois formules, un prix de départ pour chacune, et un panneau pour affiner selon votre commerce. Le devis définitif vient après un échange."
            : "Choisissez la formule qui vous ressemble, affinez vos options, et nous revenons vers vous avec un devis."}
        </p>
        {show && (
          <div className="vat" role="group" aria-label="Affichage des prix">
            <span className="t-caption vat__cap">Prix affichés</span>
            <button type="button" className={`vat__btn${!ttc ? " is-on" : ""}`} aria-pressed={!ttc} onClick={() => setTtc(false)}>
              hors TVA
            </button>
            <button type="button" className={`vat__btn${ttc ? " is-on" : ""}`} aria-pressed={ttc} onClick={() => setTtc(true)}>
              TVA comprise
            </button>
          </div>
        )}
      </div>

      {/* Les trois formules */}
      <ol className="cards">
        {pricing.sites.map((s) => {
          const on = s.id === sel.site;
          const rec = s.recommended && pricing.recommendedBadge;
          return (
            <li key={s.id} className={`card${s.recommended ? " card--rec" : ""}${on ? " is-on" : ""}`}>
              <div className="card__sketch">
                {rec && (
                  <svg className="card__filet" viewBox="0 0 320 190" preserveAspectRatio="none" aria-hidden="true">
                    <defs>
                      <linearGradient id="card-copper" x1="0" y1="1" x2="1" y2="0">
                        <stop offset="0" stopColor="#b98a63" />
                        <stop offset="0.45" stopColor="#f0d6bd" />
                        <stop offset="0.6" stopColor="#d9b08a" />
                        <stop offset="1" stopColor="#a97b57" />
                      </linearGradient>
                    </defs>
                    <path d="M-12 168C70 160 150 90 332 6" fill="none" stroke="rgba(120,78,56,0.14)" strokeWidth="7" strokeLinecap="round" />
                    <path d="M-12 168C70 160 150 90 332 6" fill="none" stroke="url(#card-copper)" strokeWidth="2.6" strokeLinecap="round" />
                  </svg>
                )}
                <PlanSketch plan={s.id} />
                {rec && (
                  <span className="card__note t-caption">
                    <i />
                    {pricing.recommendedBadge}
                  </span>
                )}
              </div>
              <h3 className="card__name t-display">{s.name}</h3>
              <p className="card__promise">{s.promise}</p>
              <p className="card__price">
                {show ? (
                  <>
                    <span className="card__from">à partir de</span>
                    <span className="card__amount">{money(s.from)}</span>
                    <span className="card__vat">{vatLabel}</span>
                  </>
                ) : (
                  <span className="card__amount card__amount--quote">{pricing.quoteLabel}</span>
                )}
              </p>
              <p className="card__delay">En ligne en {delayText(s.delayWeeks)}</p>
              <a
                className={`btn card__cta${s.recommended ? " btn--accent" : ""}`}
                href="#configurateur"
                onClick={(e) => {
                  e.preventDefault();
                  pickSite(s.id);
                  scrollTo("#configurateur");
                }}
                data-cursor
              >
                {show ? "Estimer ce site" : "Choisir cette formule"}
                <Arrow />
              </a>
              <p className="card__inc t-caption">Ce que vous obtenez</p>
              <ul className="card__list">
                {s.includes.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </li>
          );
        })}
      </ol>

      {/* Pour ceux qui hésitent */}
      <aside className="hesit">
        <div className="hesit__body">
          <p className="hesit__title t-display">Pas sûr de la formule qu’il vous faut ?</p>
          <p className="hesit__text">On passe vous voir, on regarde votre commerce ensemble, et le devis est gratuit.</p>
        </div>
        <Magnetic strength={0.2}>
          <a
            className="btn"
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("#contact");
            }}
            data-cursor
          >
            Demander une visite
            <Arrow />
          </a>
        </Magnetic>
      </aside>

      {/* Affiner */}
      <div id="configurateur" className="refine">
        <div className="refine__head">
          <p className="t-caption conf__cap">Affinez votre estimation</p>
          <p className="refine__site">
            Formule choisie : <b>{site.name}</b>
            <span className="refine__switch">
              {pricing.sites
                .filter((s) => s.id !== sel.site)
                .map((s) => (
                  <button key={s.id} type="button" className="link refine__alt" onClick={() => pickSite(s.id)}>
                    {s.name}
                  </button>
                ))}
            </span>
          </p>
        </div>

        <div className="conf__grid">
          <div className="conf__choices">
            {/* Pages */}
            {site.extraPages && (
              <div className="conf__group">
                <p className="conf__legend t-caption">Nombre de pages</p>
                <div className="opt-row opt-row--static">
                  <div className="opt-row__body">
                    <span className="opt-row__name">{sel.pages} pages</span>
                    <span className="opt-row__note">
                      {show ? `${site.pagesIncluded} comprises, puis ${money(pricing.extraPage)} par page` : `${site.pagesIncluded} comprises`}
                    </span>
                  </div>
                  <Stepper value={sel.pages} min={site.pagesMin} max={site.pagesMax} label="Nombre de pages" onChange={(v) => setSelection((s) => ({ ...s, pages: v }))} />
                </div>
              </div>
            )}

            {/* Options */}
            <div className="conf__group">
              <p className="conf__legend t-caption">Options</p>
              <div className="conf__options">
                {optionOrder.map((id) => {
                  const o = pricing.options[id];
                  const included = id === "googleBusiness" && site.googleBusinessIncluded;
                  const on = included || sel.options[id];
                  const priceLabel =
                    id === "copy"
                      ? `dès ${money(pricing.options.copy.base)}`
                      : id === "photo"
                        ? `${money(pricing.options.photo.perHalfDay)} / demi-j.`
                        : id === "language"
                          ? `+${pricing.options.language.percent} %`
                          : id === "logo"
                            ? money(pricing.options.logo.price)
                            : included
                              ? "comprise"
                              : money(pricing.options.googleBusiness.price);
                  return (
                    <div key={id} className={`opt-row${on ? " is-on" : ""}${included ? " is-included" : ""}`}>
                      <button type="button" role="switch" aria-checked={on} disabled={included} className="opt-row__toggle" onClick={() => toggle(id)} data-cursor>
                        <span className="opt-row__body">
                          <span className="opt-row__name">{o.name}</span>
                          <span className="opt-row__note">{show ? o.note : "noteQuote" in o ? o.noteQuote : o.note}</span>
                        </span>
                        {(show || included) && <span className="opt-row__price">{priceLabel}</span>}
                        <span className="switch" aria-hidden="true">
                          <i />
                        </span>
                      </button>
                      {id === "photo" && sel.options.photo && (
                        <div className="opt-row__extra">
                          <span>Demi-journées</span>
                          <Stepper
                            value={sel.photoHalfDays}
                            min={1}
                            max={pricing.options.photo.maxHalfDays}
                            label="Nombre de demi-journées"
                            onChange={(v) => setSelection((s) => ({ ...s, photoHalfDays: v }))}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ensuite */}
            <div className="conf__group">
              <p className="conf__legend t-caption">Ensuite</p>
              <div className={`opt-row${sel.hosting ? " is-on" : ""}`}>
                <button type="button" role="switch" aria-checked={sel.hosting} className="opt-row__toggle" onClick={() => setSelection((s) => ({ ...s, hosting: !s.hosting }))} data-cursor>
                  <span className="opt-row__body">
                    <span className="opt-row__name">{pricing.hosting.name}</span>
                    <span className="opt-row__note">{pricing.hosting.note}</span>
                  </span>
                  {show && <span className="opt-row__price">{money(pricing.hosting.monthly)} / mois</span>}
                  <span className="switch" aria-hidden="true">
                    <i />
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Estimation */}
          <aside className="conf__sheet" aria-live="polite" aria-label="Votre estimation">
            <div className="sheet">
              <p className="sheet__caption t-caption">{show ? "Votre estimation" : "Votre projet"}</p>
              {show ? (
                <p className="sheet__total t-display">
                  <span ref={totalEl}>{formatEuro(shownTotal)}</span>
                  <span className="sheet__vat">{vatLabel}</span>
                </p>
              ) : (
                <p className="sheet__total sheet__total--quote t-display">{pricing.quoteLabel}</p>
              )}
              <p className="sheet__delay">
                En ligne en <b>{est.delayLabel}</b>
              </p>
              <ul className="sheet__lines">
                {est.lines.map((l) => (
                  <li key={l.id} className={`sheet__line${l.included ? " is-included" : ""}`}>
                    <span className="sheet__line-label">
                      {l.label}
                      {l.note && <small>{l.note}</small>}
                    </span>
                    {(show || l.included) && <span className="sheet__line-amount">{l.included ? "comprise" : money(l.amount)}</span>}
                  </li>
                ))}
                {est.monthly > 0 && (
                  <li className="sheet__line sheet__line--monthly">
                    <span className="sheet__line-label">
                      {pricing.hosting.name}
                      <small>après la mise en ligne</small>
                    </span>
                    {show && <span className="sheet__line-amount">{money(est.monthly)} / mois</span>}
                  </li>
                )}
              </ul>
              <p className="sheet__small">{show ? pricing.disclaimer : pricing.quoteDisclaimer}</p>
              <Magnetic strength={0.2}>
                <a
                  className="btn btn--accent sheet__cta"
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo("#contact");
                  }}
                  data-cursor
                >
                  {show ? "Demander ce devis" : "Demander un devis"}
                  <Arrow />
                </a>
              </Magnetic>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
