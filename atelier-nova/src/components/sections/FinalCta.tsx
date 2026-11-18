import Image from "next/image";
import Link from "next/link";
import { home } from "@/content";
import { site } from "@/config/site";
import { Magnetic } from "@/components/ui/Magnetic";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Dernier acte : bandeau typographique en mouvement, l’anneau Nova en
 * écho au hero, et un grand bouton rond magnétique.
 */
export function FinalCta({ title = home.finalCta.title, text = home.finalCta.text }: { title?: string[]; text?: string }) {
  const c = home.finalCta;
  const phrase = `${title.join(" ")} — `;
  return (
    <section data-surface="dark" aria-labelledby="cta-title" className="surface-dark grain relative isolate overflow-hidden pb-24 pt-28 md:pb-36 md:pt-40">
      <h2 id="cta-title" className="sr-only">
        {title.join(" ")}
      </h2>
      <div aria-hidden="true" className="marquee [--marquee-dur:30s]">
        {[0, 1].map((k) => (
          <div key={k} className="marquee__track">
            {[0, 1, 2].map((j) => (
              <span key={j} className="whitespace-nowrap pr-[0.3em] text-[clamp(4.5rem,2rem+12vw,15rem)] leading-[1] tracking-[-0.045em]">
                <span className="font-medium">{title[0]}</span> <span className="t-it">{title[1]}</span>
                <span className="px-[0.2em] text-nova">—</span>
              </span>
            ))}
          </div>
        ))}
      </div>
      <span className="sr-only">{phrase}</span>

      <div className="wrap-wide relative mt-10 grid-12 items-center gap-y-12 md:mt-6">
        <Reveal mode="scale" className="relative col-span-4 aspect-square w-full max-w-[560px] md:col-span-6 md:col-start-1">
          <Image
            src="/images/sculpture/nova-ring-alt.webp"
            alt=""
            fill
            sizes="(min-width: 768px) 45vw, 90vw"
            className="scale-[1.35] object-contain"
          />
        </Reveal>
        <div className="col-span-4 md:col-span-5 md:col-start-8">
          <p className="t-label text-muted">{c.kicker}</p>
          <p className="t-lead mt-6 max-w-[34ch]">{text}</p>
          <div className="mt-12 flex flex-wrap items-center gap-8">
            <Magnetic strength={0.4}>
              <Link
                href="/contact"
                className="group relative grid h-40 w-40 place-items-center overflow-hidden rounded-full bg-nova text-center font-medium text-graphite md:h-48 md:w-48"
              >
                <span aria-hidden="true" className="absolute inset-0 translate-y-full rounded-full bg-ivory transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-y-0" />
                <span className="relative max-w-[8ch] text-lg leading-tight">{c.button}</span>
              </Link>
            </Magnetic>
            <div className="text-sm">
              <p className="text-muted">ou directement</p>
              <a href={`mailto:${site.contact.email}`} className="link-u mt-1 inline-block text-lg">
                {site.contact.email}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
