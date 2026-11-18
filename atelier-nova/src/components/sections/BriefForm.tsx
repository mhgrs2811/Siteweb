"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { contact } from "@/content";
import { site } from "@/config/site";
import { plans } from "@/config/pricing";
import { validateBrief, type Brief, type BriefErrors } from "@/lib/brief";
import { cn } from "@/lib/cn";

type Status = "idle" | "sending" | "success" | "error" | "not_configured";

const f = contact.form;

export function BriefForm() {
  const params = useSearchParams();
  const startedAt = useRef(0);
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<BriefErrors>({});
  const [showErrors, setShowErrors] = useState(false);
  // Pré-remplissage depuis ?type= (pages services) et ?formule= (tarifs)
  const [data, setData] = useState<Brief>(() => {
    const type = params.get("type") ?? "";
    const plan = params.get("formule") ?? "";
    return {
      firstName: "",
      lastName: "",
      email: "",
      company: "",
      projectType: contact.projectTypes.some((o) => o.value === type) ? type : plan === "ecommerce" ? "e-commerce" : "",
      budget: "",
      timeline: "",
      description: "",
      website: "",
      consent: false,
      plan: plans.some((p) => p.id === plan) ? plan : "",
    };
  });

  // Horodatage du début de saisie (anti-spam : délai minimal côté serveur).
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const allowed = {
    projectTypes: contact.projectTypes.map((o) => o.value),
    budgets: contact.budgets.map((o) => o.value),
    timelines: contact.timelines.map((o) => o.value),
  };

  const set = <K extends keyof Brief>(k: K, v: Brief[K]) => {
    const next = { ...data, [k]: v };
    setData(next);
    if (showErrors) setErrors(validateBrief(next, allowed));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = validateBrief(data, allowed);
    setErrors(errs);
    setShowErrors(true);
    if (Object.keys(errs).length) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setStatus("sending");
    const nickname = (e.currentTarget.elements.namedItem("nickname") as HTMLInputElement | null)?.value ?? "";
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, nickname, startedAt: startedAt.current }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        setStatus("success");
        requestAnimationFrame(() => successRef.current?.focus());
      } else if (json.code === "not_configured") {
        setStatus("not_configured");
      } else if (json.code === "invalid" && json.errors) {
        setErrors(json.errors);
        setStatus("idle");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const mailto = () => {
    const lab = (l: { value: string; label: string }[], v: string) => l.find((o) => o.value === v)?.label ?? "";
    const body = [
      `Nom : ${data.firstName} ${data.lastName}`,
      `Entreprise : ${data.company}`,
      `Type de projet : ${lab(contact.projectTypes, data.projectType)}`,
      `Budget : ${lab(contact.budgets, data.budget)}`,
      `Délai : ${lab(contact.timelines, data.timeline)}`,
      `Site existant : ${data.website}`,
      "",
      data.description,
    ].join("\n");
    return `mailto:${site.contact.email}?subject=${encodeURIComponent("Brief projet")}&body=${encodeURIComponent(body)}`;
  };

  if (status === "success") {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="border-t border-line pt-10 outline-none">
        <p className="t-label text-accent">Merci {data.firstName}</p>
        <p className="t-h2 mt-6">
          Brief <span className="t-it">bien reçu.</span>
        </p>
        <p className="t-lead mt-6 max-w-[44ch] text-muted">{f.successText}</p>
        <p className="mt-4 text-muted">{site.responseTime}</p>
        <Link href="/realisations" className="link-u mt-10 inline-block">
          En attendant, parcourir nos réalisations
        </Link>
      </div>
    );
  }

  const errCount = Object.keys(errors).length;
  const err = (k: keyof Brief) => (showErrors && errors[k] ? true : undefined);

  return (
    <form noValidate onSubmit={onSubmit} aria-describedby="form-note" className="relative">
      <div ref={summaryRef} tabIndex={-1} aria-live="assertive" className="outline-none">
        {showErrors && errCount > 0 ? (
          <p className="mb-10 border-l-2 border-[var(--accent-text)] pl-4 text-[var(--accent-text)]">
            {f.errorSummary} ({errCount})
          </p>
        ) : null}
      </div>

      {/* Champ piège anti-spam : masqué aux humains et aux lecteurs d’écran */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="nickname">Ne pas remplir</label>
        <input id="nickname" name="nickname" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <fieldset>
        <legend className="t-label flex items-center gap-3 text-muted">
          <span className="text-accent">01</span> {f.sections[0]}
        </legend>
        <div className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <Field id="firstName" label={f.firstName} error={err("firstName") && f.errors.firstName} required>
            <input id="firstName" className="field" autoComplete="given-name" value={data.firstName} onChange={(e) => set("firstName", e.target.value)} aria-invalid={err("firstName")} aria-describedby={err("firstName") ? "firstName-err" : undefined} required />
          </Field>
          <Field id="lastName" label={f.lastName} error={err("lastName") && f.errors.lastName} required>
            <input id="lastName" className="field" autoComplete="family-name" value={data.lastName} onChange={(e) => set("lastName", e.target.value)} aria-invalid={err("lastName")} aria-describedby={err("lastName") ? "lastName-err" : undefined} required />
          </Field>
          <Field id="email" label={f.email} error={err("email") && f.errors.email} required>
            <input id="email" type="email" inputMode="email" className="field" autoComplete="email" value={data.email} onChange={(e) => set("email", e.target.value)} aria-invalid={err("email")} aria-describedby={err("email") ? "email-err" : undefined} required />
          </Field>
          <Field id="company" label={f.company} hint={f.companyHint}>
            <input id="company" className="field" autoComplete="organization" value={data.company} onChange={(e) => set("company", e.target.value)} />
          </Field>
        </div>
      </fieldset>

      <fieldset className="mt-16">
        <legend className="t-label flex items-center gap-3 text-muted">
          <span className="text-accent">02</span> {f.sections[1]}
        </legend>
        <ChipGroup name="projectType" label={f.projectType} options={contact.projectTypes} value={data.projectType} onChange={(v) => set("projectType", v)} error={err("projectType") && f.errors.projectType} />
        <ChipGroup name="budget" label={f.budget} options={contact.budgets} value={data.budget} onChange={(v) => set("budget", v)} error={err("budget") && f.errors.budget} />
        <ChipGroup name="timeline" label={f.timeline} options={contact.timelines} value={data.timeline} onChange={(v) => set("timeline", v)} error={err("timeline") && f.errors.timeline} />
        {data.plan ? (
          <p className="mt-6 text-sm text-muted">
            Formule envisagée : <strong className="text-[var(--fg)]">{plans.find((p) => p.id === data.plan)?.name}</strong>{" "}
            <button type="button" className="link-u-static ml-2" onClick={() => set("plan", "")}>
              retirer
            </button>
          </p>
        ) : null}
      </fieldset>

      <fieldset className="mt-16">
        <legend className="t-label flex items-center gap-3 text-muted">
          <span className="text-accent">03</span> {f.sections[2]}
        </legend>
        <div className="mt-6 grid gap-y-6">
          <Field id="description" label={f.description} error={err("description") && f.errors.description} required>
            <textarea id="description" className="field" rows={6} placeholder={f.descriptionPlaceholder} value={data.description} onChange={(e) => set("description", e.target.value)} aria-invalid={err("description")} aria-describedby={err("description") ? "description-err" : "description-count"} required />
            <span id="description-count" className="mt-2 block text-right text-xs tabular-nums text-muted">
              {data.description.trim().length} / 30 min.
            </span>
          </Field>
          <Field id="website" label={f.website} hint={f.websiteHint} error={err("website") && f.errors.website}>
            <input id="website" type="url" inputMode="url" className="field" placeholder="https://" autoComplete="url" value={data.website} onChange={(e) => set("website", e.target.value)} aria-invalid={err("website")} aria-describedby={err("website") ? "website-err" : undefined} />
          </Field>
        </div>
      </fieldset>

      <div className="mt-12">
        <label className="flex cursor-pointer items-start gap-4">
          <input
            type="checkbox"
            className="peer sr-only"
            checked={data.consent}
            onChange={(e) => set("consent", e.target.checked)}
            aria-invalid={err("consent")}
            aria-describedby={err("consent") ? "consent-err" : undefined}
          />
          <span
            aria-hidden="true"
            className={cn(
              "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-[4px] border transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-nova",
              data.consent ? "border-[var(--fg)] bg-[var(--fg)] text-[var(--bg)]" : "border-[color-mix(in_srgb,var(--fg)_40%,transparent)]",
            )}
          >
            {data.consent ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="m3 7 3 3 5-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : null}
          </span>
          <span className="text-sm leading-relaxed text-[color-mix(in_srgb,var(--fg)_85%,transparent)]">
            {f.consent}{" "}
            <Link href="/confidentialite" className="link-u-static">
              {f.privacyLink}
            </Link>
            .
          </span>
        </label>
        {err("consent") ? (
          <p id="consent-err" className="mt-2 pl-10 text-sm text-[var(--accent-text)]">
            {f.errors.consent}
          </p>
        ) : null}
      </div>

      {status === "error" || status === "not_configured" ? (
        <div role="alert" className="mt-10 border-l-2 border-[var(--accent-text)] pl-4">
          <p>
            {status === "not_configured"
              ? "L’envoi automatique du formulaire n’est pas encore activé sur ce site."
              : f.errorGeneric}
          </p>
          <a href={mailto()} className="link-u-static mt-2 inline-block font-medium">
            Envoyer ce brief par e-mail à {site.contact.email}
          </a>
        </div>
      ) : null}

      <div className="mt-12 flex flex-wrap items-center gap-6">
        <button type="submit" disabled={status === "sending"} className="btn btn-accent min-w-[14rem] justify-between disabled:opacity-70" aria-busy={status === "sending"}>
          {status === "sending" ? (
            <>
              <span>{f.sending}</span>
              <Loader2 size={18} className="animate-spin" aria-hidden="true" />
            </>
          ) : (
            <>
              <span className="btn-roll">
                <span>{f.submit}</span>
                <span aria-hidden="true">{f.submit}</span>
              </span>
              <span className="btn-icon" aria-hidden="true">
                <ArrowUpRight size={16} strokeWidth={1.75} />
              </span>
            </>
          )}
        </button>
        <p id="form-note" className="max-w-[36ch] text-sm text-muted">
          Les champs marqués * sont {f.required}s. {site.responseTime}
        </p>
      </div>
    </form>
  );
}

function Field({ id, label, hint, error, required, children }: { id: string; label: string; hint?: string; error?: string | false | undefined; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="flex items-baseline gap-2 text-sm">
        <span className="font-medium">
          {label}
          {required ? <span aria-hidden="true"> *</span> : null}
        </span>
        {hint ? <span className="text-muted">({hint})</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-err`} className="mt-2 text-sm text-[var(--accent-text)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function ChipGroup({
  name,
  label,
  options,
  value,
  onChange,
  error,
}: {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  error?: string | false;
}) {
  return (
    <div className="mt-8" role="radiogroup" aria-labelledby={`${name}-label`} aria-describedby={error ? `${name}-err` : undefined}>
      <p id={`${name}-label`} className="text-sm font-medium">
        {label} <span aria-hidden="true">*</span>
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o.value}>
            <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} className="peer sr-only" />
            <span className="chip cursor-pointer">{o.label}</span>
          </label>
        ))}
      </div>
      {error ? (
        <p id={`${name}-err`} className="mt-2 text-sm text-[var(--accent-text)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
