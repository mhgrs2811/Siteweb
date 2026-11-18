import { SectionLabel } from "@/components/ui/Label";

/** Mise en page des pages juridiques : sommaire collant + texte lisible. */
export function LegalPage({ label, title, updated, sections }: { label: string; title: string; updated: string; sections: { id: string; title: string; body: React.ReactNode }[] }) {
  return (
    <section data-surface="light" className="surface-light pb-[var(--space-section)] pt-36 md:pt-48">
      <div className="wrap-wide grid-12 gap-y-12">
        <div className="col-span-4 md:col-span-4">
          <div className="md:sticky md:top-28">
            <SectionLabel>{label}</SectionLabel>
            <h1 className="t-h2 mt-8">{title}</h1>
            <p className="mt-6 text-sm text-muted">Dernière mise à jour : {updated}</p>
            <nav aria-label="Sommaire" className="mt-10 hidden md:block">
              <ol className="space-y-2 text-sm">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="link-u inline-block py-1">
                      {String(i + 1).padStart(2, "0")} — {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>
        <div className="legal col-span-4 md:col-span-7 md:col-start-6">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-28 border-t border-line py-10">
              <h2 className="t-h4">
                <span className="t-label mr-3 text-accent">{String(i + 1).padStart(2, "0")}</span>
                {s.title}
              </h2>
              <div className="mt-5 space-y-4 text-[color-mix(in_srgb,var(--fg)_85%,transparent)]">{s.body}</div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
