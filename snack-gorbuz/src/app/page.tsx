import type { Metadata } from "next";
import { buildMetadata, seoPages } from "@/data/seoData";
import { Hero } from "@/components/hero/Hero";
import { Manifesto } from "@/components/home/Manifesto";
import { Families } from "@/components/home/Families";
import { Spotlight } from "@/components/home/Spotlight";
import { Universe } from "@/components/home/Universe";
import { Backstage } from "@/components/home/Backstage";
import { Practical } from "@/components/home/Practical";
import { FinalCta } from "@/components/home/FinalCta";

export const metadata: Metadata = {
  ...buildMetadata(seoPages.home),
  title: { absolute: seoPages.home.title },
};

/**
 * ACCUEIL — huit chapitres : hero 3D, manifeste, envies, vedette, univers,
 * coulisses, pratique, CTA final. Rythme : impact / respiration / produit /
 * humain / action, alternance charbon · crème · beige · rouge.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Manifesto />
      <Families />
      <Spotlight />
      <Universe />
      <Backstage />
      <Practical />
      <FinalCta />
    </>
  );
}
