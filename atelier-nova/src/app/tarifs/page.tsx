import type { Metadata } from "next";
import { Check, Minus } from "lucide-react";
import { addons, carePlans, comparison, plans } from "@/config/pricing";
import { pricingFaq } from "@/content";
import { PageHero } from "@/components/sections/PageHero";
import { PlanColumns } from "@/components/sections/PlanColumns";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { SectionLabel } from "@/components/ui/Label";
import { ButtonLink } from "@/components/ui/Button";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { absoluteUrl, site } from "@/config/site";

export const metadata: Metadata = pageMetadata({
  title: "Tarifs — formules Essential, Signature et E-commerce",
  description:
    "Prix indicatifs de nos formules de création de site (dès 2 900 € HTVA), options, forfaits de maintenance et comparatif détaillé. Devis gratuit après un appel de découverte.",
  path: "/tarifs",
});

export default function TarifsPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: "Accueil", path: "/" }, { name: "Tarifs", path: "/tarifs" }]),
          {
            "@context": "https://schema.org",
            "@type": "OfferCatalog",
            name: `Formules ${site.name}`,
            url: absoluteUrl("/tarifs"),
            itemListElement: plans.map((p) => ({
              "@type": "Offer",
              name: p.name,
              description: p.pitch,
              priceSpecification: { "@type": "PriceSpecification", minPrice: p.priceFrom, priceCurrency: "EUR", valueAddedTaxIncluded: false },
            })),
          },
        ]}
      />
      <PageHero label="Tarifs" lines={["Des prix clairs,", "avant même", "le premier appel."]} lead="Trois formules de départ, des options transparentes et des forfaits de maintenance sans surprise. Le devis final est toujours établi après avoir compris votre besoin." />

      <section data-surface="light" aria-labelledby="formules" className="surface-light section-y">
        <div className="wrap-wide">
          <h2 id="formules" className="sr-only">
            Formules
          </h2>
          <PlanColumns />
        </div>
      </section>

      {/* Comparatif */}
      <section data-surface="dark" aria-labelledby="comparatif" className="surface-dark section-y">
        <div className="wrap-wide">
          <SectionLabel index="01">Comparatif</SectionLabel>
          <h2 id="comparatif" className="t-h2 mt-8">
            Formule par formule, <span className="t-it">ligne par ligne.</span>
          </h2>
          <div className="relative mt-16 overflow-x-auto md:mt-20">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <caption className="sr-only">Comparatif détaillé des formules</caption>
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="w-[40%] py-4 font-normal">
                    <span className="sr-only">Critère</span>
                  </th>
                  {plans.map((p) => (
                    <th key={p.id} scope="col" className={`py-4 font-normal ${p.highlighted ? "text-accent" : ""}`}>
                      <span className="t-label">{p.name}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              {comparison.map((g) => (
                <tbody key={g.group}>
                  <tr>
                    <th scope="colgroup" colSpan={4} className="t-it pb-2 pt-10 text-2xl font-normal">
                      {g.group}
                    </th>
                  </tr>
                  {g.rows.map((r) => (
                    <tr key={r.label} className="border-t border-line">
                      <th scope="row" className="py-4 pr-6 font-normal text-[color-mix(in_srgb,var(--fg)_85%,transparent)]">
                        {r.label}
                      </th>
                      {plans.map((p) => {
                        const v = r.values[p.id];
                        return (
                          <td key={p.id} className="py-4 pr-4">
                            {v === true ? (
                              <>
                                <Check size={18} strokeWidth={1.5} className="text-accent" aria-hidden="true" />
                                <span className="sr-only">Inclus</span>
                              </>
                            ) : v === false ? (
                              <>
                                <Minus size={18} strokeWidth={1.5} className="text-muted" aria-hidden="true" />
                                <span className="sr-only">Non inclus</span>
                              </>
                            ) : (
                              <span>{v}</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
        </div>
      </section>

      {/* Options + maintenance */}
      <section data-surface="light" aria-labelledby="options" className="surface-paper section-y">
        <div className="wrap-wide grid-12 gap-y-16">
          <div className="col-span-4 md:col-span-7">
            <SectionLabel index="02">Options</SectionLabel>
            <h2 id="options" className="t-h2 mt-8">
              À la <span className="t-it">carte.</span>
            </h2>
            <ul className="mt-12">
              {addons.map((a) => (
                <li key={a.label} className="grid gap-2 border-t border-line py-5 sm:grid-cols-[1fr_auto] sm:gap-8">
                  <span>
                    <span className="block text-lg font-medium">{a.label}</span>
                    <span className="mt-1 block text-sm text-muted">{a.detail}</span>
                  </span>
                  <span className="t-it text-2xl sm:text-right">{a.price}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-4 md:col-span-4 md:col-start-9">
            <div className="md:sticky md:top-28">
              <SectionLabel index="03">Maintenance</SectionLabel>
              <h2 className="t-h3 mt-8">
                Après la mise en ligne, <span className="t-it">on reste là.</span>
              </h2>
              <div className="mt-10">
                {carePlans.map((c) => (
                  <div key={c.name} className="border-t border-line py-6">
                    <p className="flex items-baseline justify-between gap-4">
                      <span className="t-h4">{c.name}</span>
                      <span className="t-it text-2xl">{c.price}</span>
                    </p>
                    <ul className="mt-3 space-y-1 text-sm text-muted">
                      {c.includes.map((i) => (
                        <li key={i}>— {i}</li>
                      ))}
                    </ul>
                  </div>
                ))}
                <p className="t-label mt-4 text-muted">HTVA · sans engagement après 3 mois</p>
              </div>
              <div className="mt-10">
                <ButtonLink href="/contact?type=maintenance">Demander un devis</ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Faq items={pricingFaq} index="04" title={<>Questions <span className="t-it">de budget.</span></>} />
      <FinalCta title={["Demandez", "votre devis."]} text="Décrivez votre projet en quelques minutes : vous recevez une estimation détaillée et un créneau pour en parler." />
    </>
  );
}
