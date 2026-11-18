import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects, ui } from "@/content";
import { FictionalBadge } from "@/components/ui/Label";
import { BrowserFrame, PhoneFrame } from "@/components/ui/Frames";
import { Reveal } from "@/components/ui/Reveal";
import { Line } from "@/components/ui/Split";
import { ScrollingScreen } from "@/components/sections/ScrollingScreen";
import { CartDemo } from "@/components/sections/CartDemo";
import { FinalCta } from "@/components/sections/FinalCta";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { absoluteUrl, site } from "@/config/site";
import { getMedia } from "@/lib/media";

type Params = { slug: string };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return pageMetadata({
    title: `${p.name} — concept de site ${p.categoryLabel.toLowerCase()}`,
    description: `${p.tagline} Concept fictif imaginé par ${site.name} : direction artistique, maquettes et choix de conception.`,
    path: `/realisations/${p.slug}`,
    image: p.images.cover,
  });
}

function Img({ src, alt, sizes, className, priority }: { src: string; alt: string; sizes: string; className?: string; priority?: boolean }) {
  const m = getMedia(src);
  return (
    <Image
      src={m.src}
      alt={alt}
      width={m.width}
      height={m.height}
      sizes={sizes}
      priority={priority}
      placeholder={m.blurDataURL ? "blur" : "empty"}
      blurDataURL={m.blurDataURL || undefined}
      className={className}
    />
  );
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const idx = projects.findIndex((x) => x.slug === p.slug);
  const next = projects[(idx + 1) % projects.length];
  const isLight = luminance(p.theme.bg) > 0.4;

  const themeVars = {
    "--bg": p.theme.bg,
    "--fg": p.theme.fg,
    "--muted": p.theme.muted,
    "--line": `color-mix(in srgb, ${p.theme.fg} 16%, transparent)`,
    "--accent-text": p.theme.accent,
    backgroundColor: p.theme.bg,
    color: p.theme.fg,
  } as React.CSSProperties;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            { name: "Réalisations", path: "/realisations" },
            { name: p.name, path: `/realisations/${p.slug}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: `${p.name} (concept)`,
            description: p.tagline,
            image: absoluteUrl(p.images.cover),
            creator: { "@id": absoluteUrl("/#organisation") },
            genre: p.categoryLabel,
            isFamilyFriendly: true,
          },
        ]}
      />

      <article style={themeVars} className="relative">
        {/* En-tête */}
        <header data-surface={isLight ? "light" : "dark"} className="relative pb-12 pt-32 md:pb-20 md:pt-44">
          <div className="wrap-wide">
            <nav aria-label="Fil d’Ariane" className="t-label flex flex-wrap items-center gap-3 text-muted">
              <Link href="/realisations" className="link-u">
                Réalisations
              </Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{p.number}</span>
            </nav>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <FictionalBadge />
              <span className="t-label text-muted">{p.categoryLabel}</span>
            </div>
            <Reveal as="h1" mode="lines" start="top 95%" className="mt-8 text-[clamp(3.2rem,1rem+10vw,13rem)] font-medium leading-[0.86] tracking-[-0.05em]">
              <Line>{p.name}</Line>
            </Reveal>
            <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-12">
              <p className="t-it text-[clamp(1.6rem,1.1rem+1.8vw,3rem)] leading-[1.1] md:col-span-7">{p.tagline}</p>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-5 text-sm md:col-span-4 md:col-start-9">
                {[
                  ["Statut", ui.fictional],
                  ["Secteur", p.categoryLabel],
                  ["Lieu imaginé", p.place],
                  ["Année", p.year],
                  ["Typographies", `${p.fonts.display}, ${p.fonts.text}`],
                  ["Réalisé par", site.name],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="t-label text-muted">{k}</dt>
                    <dd className="mt-1.5">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </header>

        {/* Image d’ouverture */}
        <div className="wrap-wide" data-surface={isLight ? "light" : "dark"}>
          <Reveal mode="clip" className="overflow-hidden">
            <Img src={p.images.cover} alt={p.alt.cover} sizes="100vw" priority className="h-auto w-full" />
          </Reveal>
          <p className="mt-4 text-sm text-muted">Image de synthèse réalisée pour le concept.</p>
        </div>

        {/* Problématique */}
        <section data-surface={isLight ? "light" : "dark"} aria-labelledby="probleme" className="section-y">
          <div className="wrap-wide grid gap-12 md:grid-cols-12">
            <div className="md:col-span-4">
              <p className="t-label text-accent">01</p>
              <h2 id="probleme" className="t-h3 mt-4">
                Problématique <span className="t-it">(scénario fictif)</span>
              </h2>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <Reveal as="p" className="t-lead">
                {p.problem}
              </Reveal>
              <h3 className="t-label mt-14 text-muted">Objectifs du concept</h3>
              <ol className="mt-6">
                {p.goals.map((g, i) => (
                  <li key={g} className="flex gap-6 border-t border-line py-5 text-lg">
                    <span className="t-label pt-1.5 tabular-nums text-muted">{String(i + 1).padStart(2, "0")}</span>
                    {g}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* Direction artistique */}
        <section data-surface={isLight ? "light" : "dark"} aria-labelledby="direction" className="pb-[var(--space-section)]">
          <div className="wrap-wide grid gap-12 md:grid-cols-12">
            <div className="md:col-span-6">
              <p className="t-label text-accent">02</p>
              <h2 id="direction" className="t-h3 mt-4">
                Direction <span className="t-it">artistique</span>
              </h2>
              <p className="t-lead mt-8 measure">{p.direction}</p>
              <ul className="mt-12 grid grid-cols-2 gap-px border border-line bg-[var(--line)] sm:grid-cols-4" aria-label="Palette">
                {p.palette.map((c) => (
                  <li key={c.hex} className="bg-[var(--bg)]">
                    <span aria-hidden="true" className="block aspect-[3/4] border-b border-line" style={{ backgroundColor: c.hex }} />
                    <span className="block p-3">
                      <span className="block font-medium">{c.name}</span>
                      <span className="t-label block text-muted">{c.hex}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-10 grid grid-cols-2 gap-6 border-t border-line pt-6">
                <p>
                  <span className="t-label block text-muted">Titres</span>
                  <span className="t-it mt-2 block text-3xl">{p.fonts.display}</span>
                </p>
                <p>
                  <span className="t-label block text-muted">Textes</span>
                  <span className="mt-2 block text-3xl font-medium tracking-tight">{p.fonts.text}</span>
                </p>
              </div>
            </div>
            <Reveal mode="clip" className="overflow-hidden md:col-span-5 md:col-start-8">
              <Img src={p.images.renders[1]} alt={p.alt.renders[1]} sizes="(min-width: 768px) 40vw, 92vw" className="h-auto w-full" />
            </Reveal>
          </div>
        </section>
      </article>

      {/* Visite du site : la capture défile dans le navigateur */}
      <section data-surface="dark" aria-labelledby="maquettes" className="surface-dark relative">
        <div className="wrap-wide pt-[var(--space-section)]">
          <p className="t-label text-accent">03</p>
          <h2 id="maquettes" className="t-h2 mt-4 max-w-[14ch]">
            Le site, <span className="t-it">écran par écran.</span>
          </h2>
          <p className="mt-6 max-w-[48ch] text-muted">Faites défiler : la page d’accueil du concept se parcourt dans le navigateur.</p>
        </div>
        <div className="wrap-wide">
          <ScrollingScreen src={p.images.desktopFull} alt={`Page d’accueil complète du concept ${p.name}`} url={`concept.ateliernova.be/${p.slug}`} />
        </div>
        <div className="wrap-wide grid items-end gap-10 pb-[var(--space-section)] md:grid-cols-12">
          <div className="grid grid-cols-2 gap-4 md:col-span-5 md:gap-6">
            <Reveal className="min-w-0">
              <PhoneFrame src={p.images.mobile[0]} alt={`Accueil mobile du concept ${p.name}`} />
            </Reveal>
            <Reveal className="mt-16 min-w-0" delay={0.15}>
              <PhoneFrame src={p.images.mobile[1]} alt={`Section mobile du concept ${p.name}`} />
            </Reveal>
          </div>
          <div className="md:col-span-7">
            <Reveal mode="clip">
              <BrowserFrame src={p.images.details[0]} alt={p.alt.details[0]} url={`concept.ateliernova.be/${p.slug}`} sizes="(min-width: 768px) 55vw, 92vw" />
            </Reveal>
            <p className="mt-4 text-sm text-muted">{p.alt.details[0]}.</p>
          </div>
        </div>
      </section>

      {p.slug === "orbe-cafe" ? (
        <section data-surface="light" aria-labelledby="demo" className="surface-paper section-y">
          <div className="wrap-wide">
            <div className="grid gap-8 md:grid-cols-12">
              <div className="md:col-span-5">
                <p className="t-label text-accent">Démo interactive</p>
                <h2 id="demo" className="t-h2 mt-4">
                  Essayez <span className="t-it">le panier.</span>
                </h2>
              </div>
              <p className="self-end text-muted md:col-span-5 md:col-start-8">
                Choisissez un café, une mouture, ajoutez-le au panier : le parcours d’achat du concept fonctionne réellement dans votre navigateur. Aucune commande n’est passée.
              </p>
            </div>
            <div className="mt-14">
              <CartDemo />
            </div>
            {p.images.details[1] ? (
              <div className="mt-14 md:w-2/3">
                <BrowserFrame src={p.images.details[1]} alt={p.alt.details[1]} url="concept.ateliernova.be/orbe-cafe/panier" tone="light" sizes="(min-width: 768px) 60vw, 92vw" />
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <section style={themeVars} data-surface={isLight ? "light" : "dark"} aria-labelledby="fonctionnalites" className="section-y">
        <div className="wrap-wide grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="t-label text-accent">04</p>
            <h2 id="fonctionnalites" className="t-h3 mt-4">
              Fonctionnalités
            </h2>
          </div>
          <ol className="grid gap-x-10 md:col-span-8 md:grid-cols-2">
            {p.features.map((f, i) => (
              <li key={f.title} className="border-t border-line py-7">
                <p className="t-label tabular-nums text-muted">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="t-h4 mt-3">{f.title}</h3>
                <p className="mt-3 text-[color-mix(in_srgb,var(--fg)_78%,transparent)]">{f.text}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-[var(--space-section)]">
          <Reveal mode="clip" className="overflow-hidden">
            <Img src={p.images.renders[0]} alt={p.alt.renders[0]} sizes="100vw" className="h-[70vh] w-full object-cover md:h-auto" />
          </Reveal>
        </div>

        <div className="wrap-wide mt-[var(--space-section)] grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="t-label text-accent">05</p>
            <h2 className="t-h3 mt-4">
              Choix de <span className="t-it">conception</span>
            </h2>
          </div>
          <div className="space-y-14 md:col-span-7 md:col-start-6">
            {p.choices.map((c, i) => (
              <Reveal key={c.title} className={i === 1 ? "md:pl-[16%]" : undefined}>
                <h3 className="t-it text-[clamp(1.75rem,1.2rem+1.6vw,2.75rem)] leading-[1.05]">{c.title}</h3>
                <p className="mt-4 measure text-[color-mix(in_srgb,var(--fg)_80%,transparent)]">{c.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Concept suivant */}
      <section data-surface="dark" aria-label={ui.nextProject} className="surface-dark">
        <Link href={`/realisations/${next.slug}`} data-cursor={ui.viewProject} className="group relative block overflow-hidden">
          <div className="absolute inset-0 opacity-40 transition-opacity duration-700 group-hover:opacity-60">
            <Img src={next.images.cover} alt="" sizes="100vw" className="h-full w-full object-cover transition-transform duration-[1.6s] ease-[var(--ease-out-expo)] group-hover:scale-105" />
          </div>
          <div className="wrap-wide relative py-28 md:py-44">
            <p className="t-label text-ivory/80">{ui.nextProject} — {next.number}</p>
            <p className="mt-6 text-[clamp(3rem,1rem+9vw,11rem)] font-medium leading-[0.88] tracking-[-0.05em] text-ivory">
              {next.name}
              <span aria-hidden="true" className="ml-4 inline-block transition-transform duration-700 group-hover:translate-x-4">
                →
              </span>
            </p>
            <p className="t-it mt-4 text-2xl text-ivory/85">{next.tagline}</p>
          </div>
        </Link>
      </section>

      <FinalCta />
    </>
  );
}

function luminance(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16);
  return (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
}
