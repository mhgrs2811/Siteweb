import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { PracticalInfo } from "@/components/practical/PracticalInfo";
import { Reveal } from "@/components/ui/Reveal";
import { copy } from "@/data/copy";
import { seo } from "@/data/seo";
import s from "./page.module.css";

export const metadata: Metadata = {
  title: { absolute: seo.contact.title },
  description: seo.contact.description,
  openGraph: { title: seo.contact.title, description: seo.contact.description },
};

export default function ContactPage() {
  const c = copy.contactPage;
  return (
    <>
      <PageHero tone="dark" number="05" label={copy.nav.contact} title={c.title} lead={c.lead} ghost="Infos" />
      <section className={`tone-light ${s.section}`} aria-labelledby="infos-title">
        <div className="container">
          <Reveal className={s.head}>
            <h2 id="infos-title" className="display display-l">
              {c.sectionTitle}
            </h2>
          </Reveal>
          <Reveal delay={1}>
            <PracticalInfo
              variant="full"
              titles={{ address: c.addressTitle, hours: c.hoursTitle, contact: c.contactTitle }}
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
