import type { Metadata } from "next";
import Image from "next/image";
import { about } from "@/content";
import { PageHero } from "@/components/sections/PageHero";
import { Method } from "@/components/home/Method";
import { FinalCta } from "@/components/sections/FinalCta";
import { SectionLabel } from "@/components/ui/Label";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({ title: about.meta.title, description: about.meta.description, path: "/a-propos" });

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Accueil", path: "/" }, { name: "À propos", path: "/a-propos" }])} />
      <PageHero label={about.hero.label} lines={about.hero.title} italic={2} lead={about.hero.lead} />

      {/* Vision : une phrase, une image */}
      <section data-surface="light" aria-labelledby="vision" className="surface-light section-y">
        <div className="wrap-wide grid-12 gap-y-12">
          <div className="col-span-4 md:col-span-3">
            <SectionLabel index="01">{about.vision.label}</SectionLabel>
            <h2 id="vision" className="sr-only">
              {about.vision.label}
            </h2>
          </div>
          <Reveal as="p" className="t-serif col-span-4 text-[clamp(1.9rem,1rem+3vw,4.25rem)] leading-[1.08] md:col-span-9">
            {about.vision.text}
          </Reveal>
          <Reveal mode="scale" className="relative col-span-4 mt-10 aspect-square w-full max-w-[420px] md:col-span-4 md:col-start-9">
            <Image src="/images/sculpture/nova-ring-melt.webp" alt="" fill sizes="(min-width: 768px) 30vw, 80vw" className="object-contain" />
          </Reveal>
        </div>
      </section>

      {/* Humain + IA : qui fait quoi */}
      <section data-surface="dark" aria-labelledby="hybride" className="surface-dark section-y">
        <div className="wrap-wide">
          <SectionLabel index="02">{about.hybrid.label}</SectionLabel>
          <h2 id="hybride" className="t-h2 mt-8 max-w-[14ch]">
            Qui fait quoi, <span className="t-it">exactement.</span>
          </h2>
          <p className="mt-6 max-w-[52ch] text-muted">{about.hybrid.intro}</p>
          <div className="mt-16 grid border-t border-line md:mt-24 md:grid-cols-2">
            {[about.hybrid.human, about.hybrid.ai].map((col, k) => (
              <div key={col.title} className={k === 1 ? "border-line pt-12 md:border-l md:pl-12 md:pt-10" : "pt-10 md:pr-12"}>
                <h3 className="flex items-baseline justify-between gap-4">
                  <span className={k === 0 ? "t-h3" : "t-h3 t-it"}>{col.title}</span>
                  <span className="t-label text-accent">{k === 0 ? "Décide" : "Accélère"}</span>
                </h3>
                <ol className="mt-8">
                  {col.items.map((it, i) => (
                    <li key={it} className="flex gap-5 border-t border-line py-4">
                      <span className="t-label pt-1 tabular-nums text-muted">{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-lg">{it}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Valeurs : quatre mots monumentaux */}
      <section data-surface="light" aria-labelledby="valeurs" className="surface-paper section-y">
        <div className="wrap-wide">
          <SectionLabel index="03">{about.values.label}</SectionLabel>
          <h2 id="valeurs" className="sr-only">
            {about.values.label}
          </h2>
          <ul className="mt-12">
            {about.values.items.map((v, i) => (
              <Reveal as="li" key={v.title} className="grid items-baseline gap-4 border-t border-line py-8 md:grid-cols-12 md:py-10">
                <span className="t-label tabular-nums text-muted md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
                <span className={`text-[clamp(2.75rem,1.4rem+5.5vw,7.5rem)] leading-[0.9] tracking-[-0.045em] md:col-span-6 ${i % 2 ? "t-it" : "font-medium"}`}>
                  {v.title}
                </span>
                <span className="max-w-[44ch] text-[color-mix(in_srgb,var(--fg)_80%,transparent)] md:col-span-4 md:col-start-9">{v.text}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Philosophie de conception */}
      <section data-surface="dark" aria-labelledby="philosophie" className="surface-dark-2 section-y">
        <div className="wrap-wide grid-12 gap-y-12">
          <div className="col-span-4 md:col-span-4">
            <div className="md:sticky md:top-28">
              <SectionLabel index="04">{about.philosophy.label}</SectionLabel>
              <h2 id="philosophie" className="t-h2 mt-8">
                Cinq <span className="t-it">principes.</span>
              </h2>
            </div>
          </div>
          <ol className="col-span-4 space-y-16 md:col-span-7 md:col-start-6 md:space-y-24">
            {about.philosophy.principles.map((pr, i) => (
              <Reveal as="li" key={pr.title} className={i % 2 ? "md:pl-[18%]" : undefined}>
                <p className="t-serif text-6xl leading-none text-accent">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="t-h3 mt-6">{pr.title}</h3>
                <p className="mt-4 measure text-muted">{pr.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <Method index="05" compact />
      <FinalCta />
    </>
  );
}
