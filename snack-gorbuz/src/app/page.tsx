import type { Metadata } from "next";
import { Hero } from "@/components/hero/Hero";
import { Backstage } from "@/components/home/Backstage";
import { Families } from "@/components/home/Families";
import { Featured } from "@/components/home/Featured";
import { FinalCta } from "@/components/home/FinalCta";
import { Manifesto } from "@/components/home/Manifesto";
import { Practical } from "@/components/home/Practical";
import { Universe } from "@/components/home/Universe";
import { Marquee } from "@/components/ui/Marquee";
import { copy } from "@/data/copy";
import { seo } from "@/data/seo";

export const metadata: Metadata = {
  title: { absolute: seo.home.title },
  description: seo.home.description,
  openGraph: { title: seo.home.title, description: seo.home.description },
};

/**
 * Accueil — rythme de lecture : impact / respiration / produit / humain / action.
 * 01 Hero · 02 Manifeste · 03 Envies · 04 Vedette · 05 Univers · 06 Coulisses · 07 Pratique · 08 CTA
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <div className="tone-beige">
        <Marquee words={copy.marquee} />
      </div>
      <Manifesto />
      <Families />
      <Featured />
      <Universe />
      <Backstage />
      <Practical />
      <FinalCta />
    </>
  );
}
