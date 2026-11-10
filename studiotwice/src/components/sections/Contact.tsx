"use client";

import { useEffect, useRef, useState } from "react";
import SectionHead from "@/components/SectionHead";
import Arrow from "@/components/Arrow";
import Magnetic from "@/components/Magnetic";
import { contact as c } from "@/content/sections";
import { site } from "@/content/site";
import { computeEstimate, useSelection } from "@/lib/estimate";

type Status = "idle" | "sending" | "sent" | "error" | "unconfigured";

/** Section 08 : formulaire court, récapitulatif pré-rempli, WhatsApp et appel direct. */
export default function Contact() {
  const sel = useSelection();
  const est = computeEstimate(sel);
  const [status, setStatus] = useState<Status>("idle");
  const [summary, setSummary] = useState(est.summary);
  const touched = useRef(false);

  // Tant que le visiteur n'a pas modifié le récapitulatif, il suit le configurateur.
  useEffect(() => {
    if (!touched.current) setSummary(est.summary);
  }, [est.summary]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.status === 503) return setStatus("unconfigured");
      if (!res.ok) return setStatus("error");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  const wa = site.whatsapp ? `https://wa.me/${site.whatsapp}?text=${encodeURIComponent("Bonjour StudioTwice, je souhaite un site pour mon commerce.")}` : null;
  const tel = site.phone ? `tel:${site.phone.replace(/\s+/g, "")}` : null;

  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <SectionHead id="contact" num={c.num} title={c.title} lead={c.lead} big />

      <div className="contact__grid">
        <div className="contact__direct">
          <p className="t-caption contact__cap">Le plus rapide</p>
          {wa ? (
            <a className="direct" href={wa} target="_blank" rel="noopener">
              <span className="direct__label">{c.whatsapp}</span>
              <Arrow className="direct__arrow" />
            </a>
          ) : (
            <p className="direct direct--soon" aria-disabled="true">
              <span className="direct__label">{c.whatsapp}</span>
              {/* TODO: renseigner site.whatsapp dans src/content/site.ts */}
              <span className="direct__soon t-caption">numéro à venir</span>
            </p>
          )}
          {tel ? (
            <a className="direct" href={tel}>
              <span className="direct__label">{c.call}</span>
              <span className="direct__value">{site.phone}</span>
            </a>
          ) : (
            <p className="direct direct--soon" aria-disabled="true">
              <span className="direct__label">{c.call}</span>
              {/* TODO: renseigner site.phone dans src/content/site.ts */}
              <span className="direct__soon t-caption">numéro à venir</span>
            </p>
          )}
          {site.hours && <p className="contact__hours">{site.hours}</p>}
        </div>

        <form className="form" onSubmit={submit} action="/api/contact" method="post" noValidate={false}>
          {status === "sent" ? (
            <div className="form__done" role="status">
              <p className="form__done-title t-display">{c.success.title}</p>
              <p>{c.success.text}</p>
            </div>
          ) : (
            <>
              <div className="form__row form__row--2">
                <label className="field">
                  <span className="field__label">{c.fields.name}</span>
                  <input className="field__input" name="name" type="text" autoComplete="name" required />
                </label>
                <label className="field">
                  <span className="field__label">{c.fields.business}</span>
                  <input className="field__input" name="business" type="text" autoComplete="organization" required />
                </label>
              </div>
              <label className="field">
                <span className="field__label">{c.fields.reach}</span>
                <input className="field__input" name="reach" type="text" autoComplete="tel email" inputMode="email" required />
              </label>
              <label className="field">
                <span className="field__label">{c.fields.message}</span>
                <textarea className="field__input field__input--area" name="message" rows={4} placeholder={c.fields.messagePlaceholder} />
              </label>
              <label className="field">
                <span className="field__label">
                  {c.fields.summary}
                  <small>{c.fields.summaryHint}</small>
                </span>
                <textarea
                  className="field__input field__input--area field__input--summary"
                  name="summary"
                  rows={6}
                  value={summary}
                  onChange={(e) => {
                    touched.current = true;
                    setSummary(e.target.value);
                  }}
                />
              </label>
              {/* Champ piège : invisible pour les humains, rempli par les robots. */}
              <div className="form__trap" aria-hidden="true">
                <label>
                  Site web <input name="website" type="text" tabIndex={-1} autoComplete="off" />
                </label>
              </div>
              <div className="form__foot">
                <Magnetic>
                  <button className="btn btn--accent" type="submit" disabled={status === "sending"} data-cursor>
                    {status === "sending" ? c.fields.sending : c.fields.submit}
                    <Arrow />
                  </button>
                </Magnetic>
                {status === "error" && (
                  <p className="form__msg" role="alert">
                    {c.error}
                  </p>
                )}
                {status === "unconfigured" && (
                  <p className="form__msg" role="alert">
                    {c.notConfigured}
                  </p>
                )}
              </div>
            </>
          )}
        </form>
      </div>
    </section>
  );
}
