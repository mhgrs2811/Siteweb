import Hero from "@/components/hero/Hero";
import Realisations from "@/components/Realisations";
import Configurator from "@/components/pricing/Configurator";
import { Contact, Formules, Process } from "@/components/Stubs";

export default function Home() {
  return (
    <main>
      <Hero />
      <Realisations />
      <Formules />
      <Configurator />
      <Process />
      <Contact />
    </main>
  );
}
