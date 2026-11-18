import type { Metadata } from "next";
import Link from "next/link";
import { services, servicesPage } from "@/content";
import { PageHero } from "@/components/sections/PageHero";
import { ServiceBlock } from "@/components/sections/ServiceBlock";
import { FinalCta } from "@/components/sections/FinalCta";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Services — sites vitrines, e-commerce, restaurants, IA",
  description:
    "Sites vitrines premium, boutiques e-commerce, sites pour restaurants et commerces, refonte, landing pages, direction artistique, intégrations IA et maintenance.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Accueil", path: "/" }, { name: "Services", path: "/services" }])} />
      <PageHero label={servicesPage.title} lines={["Huit savoir-faire,", "une seule", "exigence."]} lead={servicesPage.intro}>
        <nav aria-label="Sommaire des services" className="mt-16 md:mt-24">
          <ol className="grid border-t border-line sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <li key={s.slug} className="border-b border-line sm:[&:nth-child(odd)]:border-r lg:border-r lg:[&:nth-child(4n)]:border-r-0">
                <Link href={`#${s.slug}`} className="roll-host group flex min-h-16 items-baseline gap-4 px-1 py-4 sm:px-4">
                  <span className="t-label tabular-nums text-accent">{s.number}</span>
                  <span className="btn-roll">
                    <span>{s.short}</span>
                    <span aria-hidden="true" className="t-it">
                      {s.short}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      </PageHero>
      {services.map((s, i) => (
        <ServiceBlock key={s.slug} service={s} index={i} />
      ))}
      <FinalCta />
    </>
  );
}
