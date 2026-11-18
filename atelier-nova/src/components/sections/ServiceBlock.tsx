import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Service } from "@/content/fr/services";
import { getProject } from "@/content";
import { BrowserFrame, PhoneFrame } from "@/components/ui/Frames";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { AutomationDiagram } from "./AutomationDiagram";
import { carePlans } from "@/config/pricing";
import { cn } from "@/lib/cn";
import { getMedia } from "@/lib/media";

/**
 * Un service = une composition. La mise en page est choisie par
 * `service.layout` (données) : split, fullbleed, columns, index, diagram, stack.
 */
export function ServiceBlock({ service: s, index }: { service: Service; index: number }) {
  const surface = index % 2 === 0 ? "surface-light" : "surface-dark";
  const project = s.example ? getProject(s.example) : undefined;
  const cta = (
    <ButtonLink href={`/contact?type=${s.contactType}`} variant={index % 2 === 0 ? "solid" : "accent"}>
      Parlons de votre projet
    </ButtonLink>
  );
  const example = project ? (
    <Link href={`/realisations/${project.slug}`} className="roll-host group inline-flex items-center gap-2 text-sm">
      <span className="t-label text-muted">Exemple</span>
      <span className="btn-roll">
        <span>Concept {project.name}</span>
        <span aria-hidden="true">Concept {project.name}</span>
      </span>
      <ArrowRight size={14} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
    </Link>
  ) : null;

  const header = (
    <>
      <p className="t-label flex items-center gap-3 text-muted">
        <span className="text-accent tabular-nums">{s.number}</span>
        <span aria-hidden="true" className="h-px w-8 bg-current opacity-50" />
        {s.kicker}
      </p>
      <Reveal as="h2" className="t-h2 mt-6">
        {s.title}
      </Reveal>
    </>
  );

  const benefits = (
    <div>
      <h3 className="t-label text-muted">Bénéfices</h3>
      <ul className="mt-5 space-y-4">
        {s.benefits.map((b) => (
          <li key={b} className="t-it flex gap-4 text-[clamp(1.35rem,1.1rem+0.7vw,1.85rem)] leading-[1.15]">
            <span aria-hidden="true" className="text-accent not-italic">
              →
            </span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  const features = (cols = false) => (
    <div>
      <h3 className="t-label text-muted">Fonctionnalités</h3>
      <ul className={cn("mt-5", cols ? "grid gap-x-8 sm:grid-cols-2" : "")}>
        {s.features.map((f, i) => (
          <li key={f} className="flex gap-4 border-t border-line py-3">
            <span className="t-label pt-1 tabular-nums text-muted">{String(i + 1).padStart(2, "0")}</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  const desc = <p className="t-lead measure text-[color-mix(in_srgb,var(--fg)_85%,transparent)]">{s.description}</p>;

  let body: React.ReactNode;
  switch (s.layout) {
    case "fullbleed":
      body = (
        <>
          <div className="wrap-wide">{header}</div>
          <div className="mt-14 px-[var(--gutter)] lg:mt-20" style={project ? { background: project.theme.bg } : undefined}>
            <Reveal mode="clip" className="mx-auto max-w-[1180px] py-10 lg:py-20">
              <BrowserFrame src={s.image!} alt={s.imageAlt} url={`concept.ateliernova.be/${project?.slug ?? s.slug}`} scrollOnHover tone="light" sizes="(min-width: 1280px) 1180px, 92vw" />
            </Reveal>
          </div>
          <div className="wrap-wide mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12">
            <div className="lg:col-span-5">{desc}</div>
            <div className="lg:col-span-3 lg:col-start-7">{benefits}</div>
            <div className="lg:col-span-3 lg:col-start-10">{features()}</div>
          </div>
          <div className="wrap-wide mt-12 flex flex-wrap items-center gap-8">
            {cta}
            {example}
          </div>
        </>
      );
      break;
    case "columns":
      body = (
        <div className="wrap-wide grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">{header}</div>
          <div className="lg:col-span-4 lg:col-start-9 lg:pt-16">{desc}</div>
          <Reveal mode="clip" className="lg:col-span-8">
            <BrowserFrame src={s.image!} alt={s.imageAlt} url={`concept.ateliernova.be/${project?.slug ?? s.slug}`} scrollOnHover sizes="(min-width: 768px) 60vw, 92vw" />
          </Reveal>
          <div className="flex flex-col gap-12 lg:col-span-4">
            {project ? <PhoneFrame src={project.images.mobile[1]} alt={`Écran mobile du concept ${project.name}`} className="w-1/2 max-w-[220px] lg:w-2/3" /> : null}
            {benefits}
          </div>
          <div className="lg:col-span-8">{features(true)}</div>
          <div className="flex flex-col items-start gap-6 lg:col-span-4 lg:justify-end">
            {cta}
            {example}
          </div>
        </div>
      );
      break;
    case "index":
      body = (
        <div className="wrap-wide grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            {header}
            <div className="mt-10">{desc}</div>
            <div className="mt-12">{features()}</div>
            <div className="mt-12 flex flex-wrap items-center gap-8">
              {cta}
              {example}
            </div>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <div className="lg:sticky lg:top-28">
              {s.image ? (
                <Reveal mode="clip">
                  <BrowserFrame src={s.image} alt={s.imageAlt} url={`concept.ateliernova.be/${project?.slug ?? s.slug}`} aspect="4 / 5" scrollOnHover sizes="(min-width: 768px) 40vw, 92vw" />
                </Reveal>
              ) : (
                <CareTable />
              )}
              <div className="mt-12">{benefits}</div>
            </div>
          </div>
        </div>
      );
      break;
    case "diagram":
      body = (
        <div className="wrap-wide grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-12">{header}</div>
          <Reveal mode="scale" className="lg:col-span-6">
            <AutomationDiagram className="rounded-[4px] border border-line" />
          </Reveal>
          <div className="lg:col-span-5 lg:col-start-8">
            {desc}
            <div className="mt-12">{benefits}</div>
          </div>
          <div className="lg:col-span-6">{features(true)}</div>
          <div className="flex flex-col items-start gap-6 lg:col-span-5 lg:col-start-8 lg:justify-end">
            <p className="text-sm text-muted">
              Nous définissons avec vous ce que l’assistant a le droit de dire, ce qu’il doit transmettre à un humain, et où vos données sont traitées.
            </p>
            {cta}
          </div>
        </div>
      );
      break;
    case "stack":
      body = (
        <div className="wrap-wide grid items-center gap-12 lg:grid-cols-12">
          <div className="relative order-2 flex justify-center gap-4 lg:order-1 lg:col-span-6 lg:block lg:h-[620px]">
            {project ? (
              <>
                <PhoneFrame src={project.images.mobile[0]} alt={`Page mobile du concept ${project.name}`} className="w-[46%] max-w-[240px] lg:absolute lg:left-[4%] lg:top-0 lg:w-[44%] lg:max-w-[260px] lg:-rotate-[4deg]" />
                <PhoneFrame src={project.images.mobile[1]} alt={`Fiche produit mobile du concept ${project.name}`} className="mt-12 w-[46%] max-w-[240px] lg:absolute lg:left-[40%] lg:top-[12%] lg:mt-0 lg:w-[44%] lg:max-w-[260px] lg:rotate-[3deg]" />
              </>
            ) : null}
          </div>
          <div className="order-1 lg:order-2 lg:col-span-5 lg:col-start-8">
            {header}
            <div className="mt-10">{desc}</div>
            <div className="mt-12">{benefits}</div>
            <div className="mt-12">{features()}</div>
            <div className="mt-12 flex flex-wrap items-center gap-8">
              {cta}
              {example}
            </div>
          </div>
        </div>
      );
      break;
    default: {
      // split — l’image change de côté selon la position
      const flip = index % 4 === 2;
      const m = s.image ? getMedia(s.image) : null;
      body = (
        <div className="wrap-wide grid gap-12 lg:grid-cols-12">
          {/* Texte d’abord dans le DOM (ordre des titres), image placée à gauche ou à droite visuellement */}
          <div className={cn("lg:col-span-4 lg:row-start-1", flip ? "lg:col-start-1" : "lg:col-start-9")}>
            {header}
            <div className="mt-10">{desc}</div>
            <div className="mt-12">{benefits}</div>
            <div className="mt-12 lg:hidden">{features()}</div>
            <div className="mt-12 flex flex-col items-start gap-6">
              {cta}
              {example}
            </div>
          </div>
          <div className={cn("lg:col-span-7 lg:row-start-1", flip ? "lg:col-start-6" : "lg:col-start-1")}>
            {s.image && s.image.includes("desktop") ? (
              <Reveal mode="clip">
                <BrowserFrame src={s.image} alt={s.imageAlt} url={`concept.ateliernova.be/${project?.slug ?? s.slug}`} scrollOnHover sizes="(min-width: 768px) 55vw, 92vw" />
              </Reveal>
            ) : s.image && m ? (
              <Reveal mode="clip" className="relative overflow-hidden">
                <Image src={m.src} alt={s.imageAlt} width={m.width} height={m.height} sizes="(min-width: 768px) 55vw, 92vw" placeholder={m.blurDataURL ? "blur" : "empty"} blurDataURL={m.blurDataURL || undefined} className="h-auto w-full" />
              </Reveal>
            ) : null}
            <div className="mt-12 hidden lg:block">{features(true)}</div>
          </div>
        </div>
      );
    }
  }

  return (
    <section id={s.slug} data-surface={surface === "surface-light" ? "light" : "dark"} aria-label={s.title} className={cn(surface, "section-y scroll-mt-16")}>
      {body}
    </section>
  );
}

function CareTable() {
  return (
    <div className="border-t border-line">
      {carePlans.map((p) => (
        <div key={p.name} className="border-b border-line py-6">
          <p className="flex items-baseline justify-between gap-4">
            <span className="t-h4">{p.name}</span>
            <span className="t-it text-2xl">{p.price}</span>
          </p>
          <p className="mt-2 text-sm text-muted">{p.includes.join(" · ")}</p>
        </div>
      ))}
      <p className="t-label mt-4 text-muted">Prix HTVA, voir la page Tarifs</p>
    </div>
  );
}
