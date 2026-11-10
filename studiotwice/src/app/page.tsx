import Hero from "@/components/hero/Hero";
import Build from "@/components/build/Build";
import { HERO_MODE } from "@/lib/heroMode";
import Realisations from "@/components/sections/Realisations";
import Services from "@/components/sections/Services";
import Configurator from "@/components/pricing/Configurator";
import Process from "@/components/process/Process";
import About from "@/components/sections/About";
import Faq from "@/components/sections/Faq";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";

export default function Home() {
  return (
    <>
      <main id="haut">
        <Hero />
        {HERO_MODE === "calm" && <Build />}
        <Realisations />
        <Services />
        <Configurator />
        <Process />
        <About />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <JsonLd />
    </>
  );
}
