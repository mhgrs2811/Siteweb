import { SectionLabel } from "@/components/ui/Label";
import { Reveal } from "@/components/ui/Reveal";
import { Line } from "@/components/ui/Split";
import { cn } from "@/lib/cn";

/**
 * En-tête des pages intérieures : titre monumental sur plusieurs lignes,
 * une ligne en italique, décalages asymétriques.
 */
export function PageHero({
  label,
  lines,
  italic = 1,
  lead,
  aside,
  surface = "dark",
  className,
  children,
}: {
  label: string;
  lines: string[];
  italic?: number;
  lead?: string;
  aside?: React.ReactNode;
  surface?: "dark" | "light";
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <section
      data-surface={surface}
      className={cn(surface === "dark" ? "surface-dark grain" : "surface-light", "relative overflow-hidden pb-16 pt-36 md:pb-24 md:pt-48", className)}
    >
      <div className="wrap-wide">
        <SectionLabel>{label}</SectionLabel>
        <Reveal as="h1" mode="lines" stagger={0.1} start="top 95%" className="t-h1 mt-10 md:mt-14">
          {lines.map((l, i) => (
            <Line key={l} className={cn(i === italic && "t-it", i % 2 === 1 && "md:pl-[12%]", i === 2 && "md:pl-[4%]")}>
              {l}
            </Line>
          ))}
        </Reveal>
        {lead || aside ? (
          <div className="mt-12 grid-12 gap-y-8 md:mt-20">
            {lead ? (
              <Reveal className="col-span-4 md:col-span-6 md:col-start-7">
                <p className="t-lead measure text-[color-mix(in_srgb,var(--fg)_82%,transparent)]">{lead}</p>
              </Reveal>
            ) : null}
            {aside ? <div className="col-span-4 md:col-span-5 md:row-start-1">{aside}</div> : null}
          </div>
        ) : null}
        {children}
      </div>
    </section>
  );
}
