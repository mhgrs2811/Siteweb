import { home, reasons } from "@/content";
import { PaletteDemo, TypeDemo, TimelineDemo, GaugeDemo, StackDemo } from "./WhyDemos";
import { SectionLabel } from "@/components/ui/Label";
import { Reveal } from "@/components/ui/Reveal";
import { Line } from "@/components/ui/Split";
import { cn } from "@/lib/cn";

/**
 * « Pourquoi Atelier Nova » : six arguments, six démonstrations différentes
 * dans une composition éditoriale asymétrique (pas de grille de cartes identiques).
 */
export function Why() {
  const r = Object.fromEntries(reasons.map((x) => [x.id, x]));
  return (
    <section data-surface="dark" aria-labelledby="why-title" className="surface-dark relative section-y">
      <div className="wrap-wide">
        <div className="grid-12 gap-y-8">
          <div className="col-span-4 md:col-span-8">
            <SectionLabel index="05">{home.why.label}</SectionLabel>
            <Reveal as="h2" mode="lines" id="why-title" className="t-h2 mt-8">
              <Line>Ce qui change quand</Line>
              <Line>
                vous travaillez <span className="t-it">avec nous.</span>
              </Line>
            </Reveal>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 border-l border-t border-line md:mt-24 md:grid-cols-12">
          <Cell className="md:col-span-5 md:row-span-2" title={r.personnalisation.title} text={r.personnalisation.text} n="01">
            <PaletteDemo />
          </Cell>
          <Cell className="md:col-span-7" title={r.direction.title} text={r.direction.text} n="02">
            <TypeDemo />
          </Cell>
          <Cell className="md:col-span-4" title={r.rapidite.title} text={r.rapidite.text} n="03">
            <TimelineDemo />
          </Cell>
          <Cell className="md:col-span-3" title={r.performance.title} text={r.performance.text} n="04">
            <GaugeDemo />
          </Cell>
          <Cell className="md:col-span-7" title={r.expertise.title} text={r.expertise.text} n="05">
            <StackDemo />
          </Cell>
          <Cell className="md:col-span-5" title={r.humain.title} text={r.humain.text} n="06">
            <p className="t-it text-[clamp(1.8rem,1.2rem+1.8vw,3rem)] leading-[1.05]">
              « Vous parlez toujours à la même personne. »
            </p>
          </Cell>
        </div>
      </div>
    </section>
  );
}

function Cell({ className, title, text, n, children }: { className?: string; title: string; text: string; n: string; children: React.ReactNode }) {
  return (
    <Reveal className={cn("flex flex-col justify-between gap-10 border-b border-r border-line p-6 md:p-10", className)}>
      <div className="min-h-[7rem]">{children}</div>
      <div>
        <p className="t-label text-accent tabular-nums">{n}</p>
        <h3 className="t-h4 mt-3">{title}</h3>
        <p className="mt-3 max-w-[44ch] text-muted">{text}</p>
      </div>
    </Reveal>
  );
}

