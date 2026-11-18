import Image from "next/image";
import Link from "next/link";
import { nav } from "@/content";
import { ButtonLink } from "@/components/ui/Button";

export const metadata = { title: "Page introuvable", robots: { index: false } };

export default function NotFound() {
  return (
    <section data-surface="dark" className="surface-dark grain relative flex min-h-[100svh] items-center overflow-hidden pb-20 pt-32">
      <div className="pointer-events-none absolute right-[-20vw] top-1/2 aspect-square w-[90vw] -translate-y-1/2 opacity-90 md:right-[-6vw] md:w-[55vw]">
        <Image src="/images/sculpture/nova-ring-melt.webp" alt="" fill sizes="60vw" className="object-contain" priority />
      </div>
      <div className="wrap-wide relative">
        <p className="t-label text-muted">Erreur 404</p>
        <h1 className="t-h1 mt-8">
          <span className="block">Cette page</span>
          <span className="t-it block md:pl-[12%]">a fondu.</span>
        </h1>
        <p className="t-lead mt-8 max-w-[40ch] text-muted">
          L’adresse demandée n’existe pas ou a été déplacée. Voici quelques chemins pour reprendre la visite.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <ButtonLink href="/" variant="accent">
            Retour à l’accueil
          </ButtonLink>
          <ButtonLink href="/realisations" variant="ghost">
            Voir les réalisations
          </ButtonLink>
        </div>
        <ul className="mt-14 flex flex-wrap gap-x-8 gap-y-2">
          {nav.main.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="link-u inline-block py-2">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
