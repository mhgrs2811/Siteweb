"use client";

import { useEffect, useRef } from "react";
import { pricing, type OptionId, type SiteId } from "@/content/pricing";
import { computeEstimate, formatEuro, setSelection, siteById, useSelection } from "@/lib/estimate";
import { setupGsap } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";
import Arrow from "@/components/Arrow";
import Magnetic from "@/components/Magnetic";

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
      <button
        type="button"
        className="stepper__btn"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Moins"
      >
        <svg viewBox="0 0 12 12" aria-hidden="true">
          <path d="M1 6h10" />
        </svg>
      </button>
      <output className="stepper__value" aria-live="polite">
        {value}
      </output>
      <button
        type="button"
        className="stepper__btn"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Plus"
      >
        <svg viewBox="0 0 12 12" aria-hidden="true">
          <path d="M1 6h10M6 1v10" />
        </svg>
      </button>
    </div>
  );
}

/** Section 04 : le configurateur. Le prix et le délai suivent chaque choix. */
export default function Configurator() {
  const sel = useSelection();
  const est = computeEstimate(sel);
  const site = siteById(sel.site);
  const totalEl = useRef<HTMLSpanElement>(null);
  const shown = useRef(est.total);
  const first = useRef(true);

  useEffect(() => {
    const el = totalEl.current;
    if (!el) return;
    const gsap = setupGsap();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const proxy = { v: shown.current };
    if (first.current || reduce) {
      first.current = false;
      shown.current = est.total;
      el.textContent = formatEuro(est.total);
      return;
    }
    const tw = gsap.to(proxy, {
      v: est.total,
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
  }, [est.total]);

  const pickSite = (id: SiteId) =>
    setSelection((s) => {
      const next = siteById(id);
      return { ...s, site: id, pages: Math.min(next.pagesMax, Math.max(next.pagesMin, s.pages)) };
    });
  const toggle = (id: OptionId) => setSelection((s) => ({ ...s, options: { ...s.options, [id]: !s.options[id] } }));

  const goContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const t = document.querySelector<HTMLElement>("#contact");
    if (!t) return;
    e.preventDefault();
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(t, { duration: 1.4 });
    else t.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="tarifs" className="section conf" aria-labelledby="tarifs-title">
      <div className="section__head">
        <span className="section__num t-caption">04</span>
        <h2 id="tarifs-title" className="t-display section__title">
          Tarifs
        </h2>
      </div>
      <p className="section__lead">
        Choisissez ce qu’il vous faut, le prix et le délai se mettent à jour. Vous repartez avec une
        estimation claire, le devis définitif vient après un échange.
      </p>

      <div className="conf__grid">
        <div className="conf__choices">
          {/* Formule */}
          <fieldset className="conf__group">
            <legend className="conf__legend t-caption">Votre site</legend>
            <div role="radiogroup" aria-label="Type de site" className="conf__sites">
              {pricing.sites.map((s, i) => {
                const on = s.id === sel.site;
                return (
                  <button
                    key={s.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    className={`site-row${on ? " is-on" : ""}`}
                    onClick={() => pickSite(s.id)}
                    data-cursor
                  >
                    <span className="site-row__idx t-caption">{String(i + 1).padStart(2, "0")}</span>
                    <span className="site-row__body">
                      <span className="site-row__name t-display">{s.name}</span>
                      <span className="site-row__promise">{s.promise}</span>
                      <span className="site-row__detail">{s.detail}</span>
                    </span>
                    <span className="site-row__price">
                      <span className="site-row__from">à partir de</span>
                      <span className="site-row__amount">{formatEuro(s.from)}</span>
                      <span className="site-row__delay">{`${s.delayWeeks[0] === s.delayWeeks[1] ? s.delayWeeks[0] : `${s.delayWeeks[0]} à ${s.delayWeeks[1]}`} sem.`}</span>
                    </span>
                    <span className="site-row__mark" aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Pages */}
          {site.extraPages && (
            <div className="conf__group">
              <p className="conf__legend t-caption">Nombre de pages</p>
              <div className="opt-row opt-row--static">
                <div className="opt-row__body">
                  <span className="opt-row__name">{sel.pages} pages</span>
                  <span className="opt-row__note">
                    {site.pagesIncluded} comprises, puis {formatEuro(pricing.extraPage)} par page
                  </span>
                </div>
                <Stepper
                  value={sel.pages}
                  min={site.pagesMin}
                  max={site.pagesMax}
                  label="Nombre de pages"
                  onChange={(v) => setSelection((s) => ({ ...s, pages: v }))}
                />
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
                    ? `dès ${formatEuro(pricing.options.copy.base)}`
                    : id === "photo"
                      ? `${formatEuro(pricing.options.photo.perHalfDay)} / demi-j.`
                      : id === "language"
                        ? `+${pricing.options.language.percent} %`
                        : id === "logo"
                          ? formatEuro(pricing.options.logo.price)
                          : included
                            ? "comprise"
                            : formatEuro(pricing.options.googleBusiness.price);
                return (
                  <div key={id} className={`opt-row${on ? " is-on" : ""}${included ? " is-included" : ""}`}>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={on}
                      disabled={included}
                      className="opt-row__toggle"
                      onClick={() => toggle(id)}
                      data-cursor
                    >
                      <span className="opt-row__body">
                        <span className="opt-row__name">{o.name}</span>
                        <span className="opt-row__note">{o.note}</span>
                      </span>
                      <span className="opt-row__price">{priceLabel}</span>
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
              <button
                type="button"
                role="switch"
                aria-checked={sel.hosting}
                className="opt-row__toggle"
                onClick={() => setSelection((s) => ({ ...s, hosting: !s.hosting }))}
                data-cursor
              >
                <span className="opt-row__body">
                  <span className="opt-row__name">{pricing.hosting.name}</span>
                  <span className="opt-row__note">{pricing.hosting.note}</span>
                </span>
                <span className="opt-row__price">{formatEuro(pricing.hosting.monthly)} / mois</span>
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
            <p className="sheet__caption t-caption">Votre estimation</p>
            <p className="sheet__total t-display">
              <span ref={totalEl}>{formatEuro(est.total)}</span>
              <span className="sheet__vat">{pricing.vat}</span>
            </p>
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
                  <span className="sheet__line-amount">{l.included ? "comprise" : formatEuro(l.amount)}</span>
                </li>
              ))}
              {est.monthly > 0 && (
                <li className="sheet__line sheet__line--monthly">
                  <span className="sheet__line-label">
                    {pricing.hosting.name}
                    <small>après la mise en ligne</small>
                  </span>
                  <span className="sheet__line-amount">{formatEuro(est.monthly)} / mois</span>
                </li>
              )}
            </ul>
            <p className="sheet__small">{pricing.disclaimer}</p>
            <Magnetic strength={0.2}>
              <a className="btn btn--accent sheet__cta" href="#contact" onClick={goContact} data-cursor>
                Demander ce devis
                <Arrow />
              </a>
            </Magnetic>
          </div>
        </aside>
      </div>
    </section>
  );
}
