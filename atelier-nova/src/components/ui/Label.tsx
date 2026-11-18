import { cn } from "@/lib/cn";

/** Étiquette de section : numéro + libellé en capitales espacées. */
export function SectionLabel({ index, children, className }: { index?: string; children: string; className?: string }) {
  return (
    <p className={cn("t-label text-muted flex items-center gap-3", className)}>
      {index ? <span className="text-accent tabular-nums">{index}</span> : null}
      <span aria-hidden="true" className="inline-block h-px w-8 bg-current opacity-50" />
      <span>{children}</span>
    </p>
  );
}

/** Badge « Concept fictif » utilisé partout où un projet du portfolio apparaît. */
export function FictionalBadge({ className, label = "Concept fictif" }: { className?: string; label?: string }) {
  return (
    <span
      className={cn(
        "t-label inline-flex items-center gap-2 rounded-full border px-3 py-1.5 backdrop-blur-[2px]",
        "border-current/30",
        className,
      )}
    >
      <span aria-hidden="true" className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
