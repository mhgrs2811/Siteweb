import { cn } from "@/lib/cn";

/**
 * Schéma typographique d’une automatisation : un brief entre, trois étapes
 * s’enchaînent, l’information arrive au bon endroit. Pas de robot, pas d’icône
 * générique : des flux et des mots.
 */
export function AutomationDiagram({ compact = false, className }: { compact?: boolean; className?: string }) {
  const nodes = [
    { k: "Entrée", v: "Formulaire de devis" },
    { k: "IA", v: "Résumé et qualification" },
    { k: "CRM", v: "Fiche client créée" },
    { k: "Vous", v: "Notification et brouillon de réponse" },
  ];
  return (
    <div className={cn("surface-dark relative h-full overflow-hidden", compact ? "p-6" : "p-8 md:p-12", className)}>
      <p className="t-label text-muted">Automatisation type</p>
      <ol className={cn("relative mt-6", compact ? "space-y-3" : "space-y-6 md:space-y-8")}>
        <span aria-hidden="true" className="absolute bottom-3 left-[5px] top-3 w-px bg-[var(--line)]" />
        <span aria-hidden="true" className="flow-pulse absolute left-[3px] top-3 h-6 w-[5px] rounded-full bg-nova" />
        {nodes.map((n, i) => (
          <li key={n.k} className="relative flex items-baseline gap-4 pl-7">
            <span aria-hidden="true" className="absolute left-0 top-[0.45em] h-[11px] w-[11px] rounded-full border border-current bg-[var(--bg)]" />
            <span className="t-label w-14 shrink-0 text-muted">{String(i + 1).padStart(2, "0")}</span>
            <span>
              <span className={cn("block font-medium", compact ? "text-base" : "text-xl")}>{n.k}</span>
              <span className={cn("t-it block text-muted", compact ? "text-lg leading-tight" : "text-2xl")}>{n.v}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
