import { faq, home } from "@/content";
import type { FaqItem } from "@/content/fr/faq";
import { SectionLabel } from "@/components/ui/Label";
import { Accordion } from "@/components/ui/Accordion";
import { ArrowLink } from "@/components/ui/Button";
import { JsonLd, faqJsonLd } from "@/lib/seo";

export function Faq({ items = faq, index = "08", title }: { items?: FaqItem[]; index?: string; title?: React.ReactNode }) {
  return (
    <section data-surface="light" aria-labelledby="faq-title" className="surface-light section-y">
      <JsonLd data={faqJsonLd(items)} />
      <div className="wrap-wide grid-12 gap-y-12">
        <div className="col-span-4 md:col-span-4">
          <div className="md:sticky md:top-28">
            <SectionLabel index={index}>{home.faq.label}</SectionLabel>
            <h2 id="faq-title" className="t-h2 mt-8 max-w-[10ch]">
              {title ?? (
                <>
                  Avant de <span className="t-it">commencer.</span>
                </>
              )}
            </h2>
            <p className="mt-10 text-muted">{home.faq.more}</p>
            <ArrowLink href="/contact" className="mt-1">
              {home.faq.moreCta}
            </ArrowLink>
          </div>
        </div>
        <div className="col-span-4 md:col-span-7 md:col-start-6">
          <Accordion items={items} />
        </div>
      </div>
    </section>
  );
}
