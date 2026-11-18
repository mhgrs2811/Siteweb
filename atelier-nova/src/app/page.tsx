import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { Manifesto } from "@/components/home/Manifesto";
import { ServicesIndex } from "@/components/home/ServicesIndex";
import { PortfolioShowcase } from "@/components/home/PortfolioShowcase";
import { Method } from "@/components/home/Method";
import { Why } from "@/components/home/Why";
import { PlanColumns } from "@/components/sections/PlanColumns";
import { Testimonials } from "@/components/sections/Testimonials";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { SectionLabel } from "@/components/ui/Label";
import { ArrowLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Line } from "@/components/ui/Split";
import { home } from "@/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({ title: home.meta.title, description: home.meta.description, path: "/" });

export default function HomePage() {
  return (
    <>
      <Hero />
      <Manifesto />
      <ServicesIndex />
      <PortfolioShowcase />
      <Method />
      <Why />

      <section data-surface="light" aria-labelledby="offres-title" className="surface-light section-y">
        <div className="wrap-wide">
          <div className="grid-12 mb-16 gap-y-8 md:mb-24">
            <div className="col-span-4 md:col-span-7">
              <SectionLabel index="06">{home.pricing.label}</SectionLabel>
              <Reveal as="h2" mode="lines" id="offres-title" className="t-h2 mt-8">
                <Line>Trois formules,</Line>
                <Line>
                  <span className="t-it">une même exigence.</span>
                </Line>
              </Reveal>
            </div>
            <div className="col-span-4 self-end md:col-span-4 md:col-start-9 md:justify-self-end">
              <ArrowLink href="/tarifs">{home.pricing.cta}</ArrowLink>
            </div>
          </div>
          <PlanColumns limit={5} />
        </div>
      </section>

      <Testimonials />
      <Faq />
      <FinalCta />
    </>
  );
}
