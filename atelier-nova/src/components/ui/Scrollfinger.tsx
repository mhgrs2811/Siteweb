import { cn } from "@/lib/cn";

/**
 * SCROLLFINGER — indicateur de défilement.
 * Mobile : un doigt glisse vers le haut sur un écran de téléphone dont le
 * contenu défile. Desktop : deux doigts sur un trackpad.
 * Purement décoratif (CSS), le lien reste un vrai lien d’ancre accessible.
 * En mouvement réduit, l’animation s’arrête sur une pose lisible.
 */
export function Scrollfinger({ href, label, className }: { href: string; label: string; className?: string }) {
  return (
    <a href={href} className={cn("scrollfinger group inline-flex items-center gap-4", className)}>
      {/* Variante mobile : téléphone + doigt */}
      <svg width="44" height="72" viewBox="0 0 44 72" fill="none" aria-hidden="true" className="sf-svg md:hidden">
        <defs>
          <clipPath id="sf-screen-clip">
            <rect x="5" y="7" width="26" height="50" rx="3" />
          </clipPath>
        </defs>
        <rect x="2" y="2" width="32" height="60" rx="8" stroke="currentColor" strokeOpacity=".55" strokeWidth="1.25" />
        <rect x="14" y="4.5" width="8" height="1.5" rx=".75" fill="currentColor" fillOpacity=".5" />
        <g clipPath="url(#sf-screen-clip)">
          <g className="sf-screen">
            <rect x="8" y="11" width="14" height="2" rx="1" fill="currentColor" fillOpacity=".8" />
            <rect x="8" y="16" width="20" height="10" rx="1.5" fill="currentColor" fillOpacity=".18" />
            <rect x="8" y="29" width="18" height="1.5" rx=".75" fill="currentColor" fillOpacity=".45" />
            <rect x="8" y="33" width="12" height="1.5" rx=".75" fill="currentColor" fillOpacity=".45" />
            <rect x="8" y="39" width="20" height="10" rx="1.5" fill="currentColor" fillOpacity=".18" />
            <rect x="8" y="52" width="16" height="1.5" rx=".75" fill="currentColor" fillOpacity=".45" />
            <rect x="8" y="56" width="10" height="1.5" rx=".75" fill="currentColor" fillOpacity=".45" />
            <rect x="8" y="62" width="20" height="10" rx="1.5" fill="currentColor" fillOpacity=".18" />
            <rect x="8" y="75" width="14" height="1.5" rx=".75" fill="currentColor" fillOpacity=".45" />
          </g>
        </g>
        <rect className="sf-trail" x="26.25" y="22" width="1.5" height="22" rx=".75" fill="var(--color-nova)" />
        <g className="sf-finger">
          <path
            d="M20 71V45.5a7 7 0 0 1 14 0V71"
            fill="var(--bg)"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
          <path d="M23.5 45a3.5 3.5 0 0 1 7 0v2.6a1.4 1.4 0 0 1-1.4 1.4h-4.2a1.4 1.4 0 0 1-1.4-1.4z" stroke="currentColor" strokeOpacity=".6" strokeWidth="1" />
          <circle cx="27" cy="41" r="1.6" fill="var(--color-nova)" />
        </g>
      </svg>

      {/* Variante desktop : trackpad + deux doigts */}
      <svg width="64" height="48" viewBox="0 0 64 48" fill="none" aria-hidden="true" className="sf-svg hidden md:block">
        <rect x="1.5" y="1.5" width="61" height="45" rx="7" stroke="currentColor" strokeOpacity=".5" strokeWidth="1.25" />
        <path d="M24 40h16" stroke="currentColor" strokeOpacity=".3" strokeWidth="1.25" strokeLinecap="round" />
        <g className="sf-tp">
          <circle cx="26" cy="24" r="5" fill="var(--bg)" stroke="currentColor" strokeWidth="1.25" />
          <circle cx="38" cy="24" r="5" fill="var(--bg)" stroke="currentColor" strokeWidth="1.25" />
          <circle cx="26" cy="24" r="1.4" fill="var(--color-nova)" />
          <circle cx="38" cy="24" r="1.4" fill="var(--color-nova)" />
        </g>
      </svg>

      <span className="flex flex-col">
        <span className="t-label">{label}</span>
        <span aria-hidden="true" className="relative mt-2 block h-px w-16 overflow-hidden bg-[var(--line)]">
          <span className="sf-line absolute inset-y-0 left-0 w-1/2 bg-current" />
        </span>
      </span>
    </a>
  );
}
