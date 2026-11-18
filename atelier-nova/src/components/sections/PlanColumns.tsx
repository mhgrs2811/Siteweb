import Link from "next/link";
import { Check } from "lucide-react";
import { plans, priceNote, formatPrice } from "@/config/pricing";
import { ui } from "@/content";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Les trois formules, lues depuis src/config/pricing.ts.
 * Colonnes séparées par des filets ; la formule recommandée est inversée.
 */
export function PlanColumns({ limit }: { limit?: number }) {
  return (
    <div>
      <Reveal mode="stagger" stagger={0.1} className="grid border-t border-line lg:grid-cols-3">
        {plans.map((p) => (
          <article
            key={p.id}
            aria-labelledby={`plan-${p.id}`}
            className={cn(
              "relative flex flex-col border-b border-line px-6 py-10 md:px-10 lg:border-b-0 lg:px-8 lg:py-12 [&+&]:lg:border-l",
              p.highlighted && "surface-dark lg:-my-6 lg:py-[4.5rem]",
            )}
          >
            <div className="flex items-baseline justify-between gap-4">
              <h3 id={`plan-${p.id}`} className="t-label">
                {p.name}
              </h3>
              {p.highlighted ? <span className="t-label text-accent">Notre recommandation</span> : null}
            </div>
            <p className="mt-10">
              <span className="t-label block text-muted">{ui.priceFrom}</span>
              <span className="t-serif mt-1 block text-[clamp(3rem,2rem+2.6vw,4.75rem)] leading-none tracking-[-0.03em] tabular-nums">
                {formatPrice(p.priceFrom)}
              </span>
              <span className="mt-2 block text-sm text-muted">
                {ui.vatExcl} · {p.timeline}
              </span>
            </p>
            <p className="mt-8 text-[1.05rem]">{p.pitch}</p>
            <p className="t-label mt-4 text-muted">{p.idealFor}</p>
            <ul className="mt-8 space-y-3 border-t border-line pt-8">
              {(limit ? p.includes.slice(0, limit) : p.includes).map((f) => (
                <li key={f} className="flex gap-3">
                  <Check size={18} strokeWidth={1.5} aria-hidden="true" className="mt-1 shrink-0 text-accent" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-10">
              <Link
                href={`/contact?formule=${p.id}`}
                className={cn("btn w-full justify-between", p.highlighted ? "btn-accent" : "btn-ghost")}
              >
                <span className="btn-roll">
                  <span>Demander un devis {p.name}</span>
                  <span aria-hidden="true">Demander un devis {p.name}</span>
                </span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>
        ))}
      </Reveal>
      <p className="mt-10 max-w-[70ch] text-sm text-muted">{priceNote}</p>
    </div>
  );
}
