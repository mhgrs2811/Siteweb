import type { Metadata } from "next";
import { realisationsPage, ui } from "@/content";
import { PageHero } from "@/components/sections/PageHero";
import { ProjectGrid } from "@/components/sections/ProjectGrid";
import { FinalCta } from "@/components/sections/FinalCta";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Réalisations — concepts de sites restaurant, beauté, design, architecture, e-commerce",
  description:
    "Cinq concepts de sites imaginés par Atelier Nova : restaurant gastronomique, institut esthétique, décoration Japandi, studio d’architecture et boutique de café.",
  path: "/realisations",
  image: "/images/projects/maison-ardoise/cover.webp",
});

export default function RealisationsPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Accueil", path: "/" }, { name: "Réalisations", path: "/realisations" }])} />
      <PageHero
        label={realisationsPage.title}
        lines={["Des univers,", "pas des", "gabarits."]}
        lead={realisationsPage.intro}
        aside={
          <p className="max-w-[40ch] border-l border-nova pl-5 text-sm text-muted">
            <span className="t-label mb-2 block text-accent">{ui.fictional}</span>
            {ui.fictionalLong}
          </p>
        }
      />
      <section data-surface="dark" aria-label="Liste des réalisations" className="surface-dark pb-[var(--space-section)] pt-4">
        <div className="wrap-wide">
          <ProjectGrid />
        </div>
      </section>
      <FinalCta />
    </>
  );
}
