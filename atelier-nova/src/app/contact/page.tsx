import type { Metadata } from "next";
import { Suspense } from "react";
import { contact } from "@/content";
import { site } from "@/config/site";
import { BriefForm } from "@/components/sections/BriefForm";
import { SectionLabel } from "@/components/ui/Label";
import { Reveal } from "@/components/ui/Reveal";
import { Line } from "@/components/ui/Split";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({ title: contact.meta.title, description: contact.meta.description, path: "/contact" });

export default function ContactPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Accueil", path: "/" }, { name: "Contact", path: "/contact" }])} />
      <section data-surface="dark" className="surface-dark grain relative pb-[var(--space-section)] pt-36 md:pt-48">
        <div className="wrap-wide grid-12 gap-y-16">
          <div className="col-span-4 md:col-span-5">
            <div className="md:sticky md:top-32">
              <SectionLabel>{contact.hero.label}</SectionLabel>
              <Reveal as="h1" mode="lines" start="top 95%" className="mt-10 text-[clamp(3rem,1rem+5.4vw,7.25rem)] font-medium leading-[0.92] tracking-[-0.045em]">
                <Line>{contact.hero.title[0]}</Line>
                <Line className="t-it">{contact.hero.title[1]}</Line>
              </Reveal>
              <p className="t-lead mt-10 max-w-[38ch] text-[color-mix(in_srgb,var(--fg)_82%,transparent)]">{contact.hero.lead}</p>

              <div className="mt-14 border-t border-line pt-8">
                <p className="t-label text-muted">{contact.aside.direct}</p>
                <a href={`mailto:${site.contact.email}`} className="link-u mt-3 inline-block text-xl">
                  {site.contact.email}
                </a>
                {site.contact.phone ? (
                  <a href={`tel:${site.contact.phone}`} className="link-u mt-2 block w-fit text-xl">
                    {site.contact.phoneDisplay}
                  </a>
                ) : null}
                <p className="mt-6 flex items-center gap-3 text-sm text-muted">
                  <span aria-hidden="true" className="pulse-dot inline-block h-2 w-2 rounded-full bg-nova" />
                  {site.availability}
                </p>
              </div>

              <div className="mt-12 hidden md:block">
                <p className="t-label text-muted">{contact.aside.next}</p>
                <ol className="mt-4 space-y-3">
                  {contact.aside.steps.map((s, i) => (
                    <li key={s} className="flex gap-4">
                      <span className="t-it text-2xl leading-none text-accent">{i + 1}</span>
                      <span className="text-[color-mix(in_srgb,var(--fg)_80%,transparent)]">{s}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
          <div className="col-span-4 md:col-span-6 md:col-start-7 md:pt-4">
            <Suspense fallback={<p className="text-muted">Chargement du formulaire…</p>}>
              <BriefForm />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
