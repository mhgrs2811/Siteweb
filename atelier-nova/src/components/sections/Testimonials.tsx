import { testimonials, testimonialsNote, home } from "@/content";
import type { Testimonial } from "@/content/fr/testimonials";
import { SectionLabel } from "@/components/ui/Label";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

/** Témoignage réutilisable. En mode placeholder, il s’affiche comme un emplacement réservé. */
export function TestimonialCard({ t, size = "lg" }: { t: Testimonial; size?: "lg" | "md" }) {
  return (
    <figure
      className={cn(
        "relative",
        t.placeholder && "rounded-[4px] border border-dashed border-[color-mix(in_srgb,var(--fg)_30%,transparent)] p-6 md:p-10",
      )}
    >
      {t.placeholder ? (
        <span className="t-label absolute -top-3 left-6 bg-[var(--bg)] px-2 text-accent md:left-10">{testimonialsNote.label}</span>
      ) : null}
      <span aria-hidden="true" className="t-serif block text-[5rem] leading-[0.6] text-accent">
        “
      </span>
      <blockquote
        className={cn(
          "t-serif mt-4",
          size === "lg" ? "text-[clamp(1.75rem,1.1rem+2.4vw,3.6rem)] leading-[1.1]" : "text-2xl leading-snug",
          t.placeholder && "text-muted",
        )}
      >
        <p>{t.quote}</p>
      </blockquote>
      <figcaption className="mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className={cn("font-medium", t.placeholder && "text-muted")}>{t.author}</span>
        <span className="text-muted">
          {t.role}, {t.company}
        </span>
      </figcaption>
    </figure>
  );
}

export function Testimonials({ index = "07" }: { index?: string }) {
  const [first, ...rest] = testimonials;
  return (
    <section data-surface="dark" aria-labelledby="temoignages-title" className="surface-dark-2 section-y">
      <div className="wrap-wide grid-12 gap-y-12">
        <div className="col-span-4 md:col-span-4">
          <SectionLabel index={index}>{home.testimonials.label}</SectionLabel>
          <h2 id="temoignages-title" className="t-h3 mt-8 max-w-[14ch]">
            La parole <span className="t-it">à nos clients</span>, bientôt.
          </h2>
          <p className="mt-6 max-w-[38ch] text-muted">{testimonialsNote.text}</p>
        </div>
        <Reveal className="col-span-4 md:col-span-7 md:col-start-6">
          <TestimonialCard t={first} />
          {rest.length ? (
            <div className="mt-10 grid gap-10 md:ml-[20%]">
              {rest.map((t, i) => (
                <TestimonialCard key={i} t={t} size="md" />
              ))}
            </div>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
