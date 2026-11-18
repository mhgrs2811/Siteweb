import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { home, services } from "@/content";
import { SectionLabel } from "@/components/ui/Label";
import { ArrowLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Line } from "@/components/ui/Split";
import { AutomationDiagram } from "@/components/sections/AutomationDiagram";
import { ServicesPreviewController } from "./ServicesPreviewController";

/**
 * Services en index éditorial : de grandes lignes typographiques.
 * Au survol (desktop), un aperçu visuel du service suit le curseur.
 */
export function ServicesIndex() {
  const list = services.filter((s) => s.onHome);
  return (
    <section id="services-index" data-surface="dark" aria-labelledby="services-title" className="surface-dark-2 relative section-y">
      <ServicesPreviewController id="services-index" />
      <div className="wrap-wide">
        <div className="grid-12 gap-y-8">
          <div className="col-span-4 md:col-span-7">
            <SectionLabel index="02">{home.services.label}</SectionLabel>
            <Reveal as="h2" mode="lines" id="services-title" className="t-h2 mt-8 max-w-[14ch]">
              <Line>Ce que nous faisons,</Line>
              <Line>
                <span className="t-it">et pour qui.</span>
              </Line>
            </Reveal>
          </div>
          <Reveal className="col-span-4 self-end md:col-span-4 md:col-start-9">
            <p className="text-muted measure">{home.services.intro}</p>
          </Reveal>
        </div>

        <ul data-list className="mt-16 border-b border-line md:mt-24">
          {list.map((s, i) => (
            <li key={s.slug} data-index={i} className="border-t border-line">
              <Link
                href={`/services#${s.slug}`}
                data-cursor="Découvrir"
                className="roll-host group grid grid-cols-[2.5rem_1fr_auto] items-start gap-x-4 py-7 md:grid-cols-12 md:items-center md:gap-x-6 md:py-9"
              >
                <span className="t-label pt-2 tabular-nums text-muted md:col-span-1 md:pt-0">{s.number}</span>
                <span className="md:col-span-6">
                  <span className="btn-roll block text-[clamp(1.9rem,1rem+3.4vw,4.6rem)] font-medium leading-[1] tracking-[-0.04em]">
                    <span>{s.short}</span>
                    <span aria-hidden="true" className="t-it text-accent">
                      {s.short}
                    </span>
                  </span>
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  strokeWidth={1.25}
                  className="mt-2 h-7 w-7 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:rotate-45 md:order-last md:col-span-1 md:mt-0 md:h-10 md:w-10 md:justify-self-end"
                />
                <span className="col-span-2 col-start-2 mt-3 md:col-span-4 md:col-start-auto md:mt-0">
                  <span className="block text-[color-mix(in_srgb,var(--fg)_80%,transparent)]">{s.summary}</span>
                  <span className="t-label mt-3 block text-muted">{s.benefits[0]}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex justify-end">
          <ArrowLink href="/services">{home.services.cta}</ArrowLink>
        </div>
      </div>

      {/* Aperçu flottant (desktop) */}
      <div
        data-preview
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-30 hidden h-[260px] w-[380px] -translate-x-1/2 -translate-y-1/2 md:block"
      >
        {list.map((s, i) => (
          <div
            key={s.slug}
            className="absolute inset-0 overflow-hidden bg-graphite-3 transition-[clip-path,opacity] duration-700 ease-[var(--ease-out-expo)]"
            data-preview-item={i}
            style={{ clipPath: "inset(50% 50% 50% 50%)", opacity: 0 }}
          >
            {s.image ? (
              <Image src={s.image} alt="" fill sizes="380px" className="object-cover object-top" />
            ) : s.slug === "ia-automatisations" ? (
              <AutomationDiagram compact />
            ) : (
              <MaintenanceTile />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function MaintenanceTile() {
  return (
    <div className="surface-dark flex h-full flex-col justify-between p-6">
      <p className="t-label text-muted">Rapport mensuel</p>
      <div className="space-y-3">
        {[
          ["Disponibilité", "surveillée 24/7"],
          ["Sauvegardes", "quotidiennes"],
          ["Mises à jour", "appliquées"],
        ].map(([k, v]) => (
          <p key={k} className="flex items-baseline justify-between border-b border-line pb-2">
            <span>{k}</span>
            <span className="t-it text-xl text-accent">{v}</span>
          </p>
        ))}
      </div>
    </div>
  );
}
