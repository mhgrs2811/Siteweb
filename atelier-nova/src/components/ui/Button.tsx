import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Magnetic } from "./Magnetic";
import { cn } from "@/lib/cn";

type Variant = "solid" | "accent" | "ghost";

type Props = {
  href: string;
  children: string;
  variant?: Variant;
  icon?: boolean;
  magnetic?: boolean;
  className?: string;
  external?: boolean;
};

/** Bouton-lien avec libellé qui roule et icône qui pivote. */
export function ButtonLink({ href, children, variant = "solid", icon = true, magnetic = true, className, external }: Props) {
  const cls = cn("btn", variant === "accent" && "btn-accent", variant === "ghost" && "btn-ghost", className);
  const inner = (
    <>
      <span className="btn-roll">
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
      {icon ? (
        <span className="btn-icon" aria-hidden="true">
          <ArrowUpRight size={16} strokeWidth={1.75} />
        </span>
      ) : null}
    </>
  );
  const el = external ? (
    <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
  return magnetic ? <Magnetic>{el}</Magnetic> : el;
}

/** Libellé + flèche, sans fond : pour les liens secondaires. */
export function ArrowLink({ href, children, className }: { href: string; children: string; className?: string }) {
  return (
    <Link href={href} className={cn("roll-host group inline-flex items-center gap-2 py-2 font-medium", className)}>
      <span className="btn-roll">
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
      <ArrowUpRight
        size={18}
        strokeWidth={1.5}
        aria-hidden="true"
        className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:rotate-45"
      />
    </Link>
  );
}
