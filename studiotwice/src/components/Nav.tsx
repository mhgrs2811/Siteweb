"use client";

import { useRouter } from "next/navigation";
import { getLenis } from "@/lib/lenis";

const items = [
  { label: "Réalisations", href: "#realisations" },
  { label: "Formules", href: "#formules" },
  { label: "Comment", href: "#comment", hideOnSmall: true },
  { label: "Contact", href: "#contact" },
];

/** Navigation flottante en bas d'écran, à portée de pouce. */
export default function Nav() {
  const router = useRouter();
  const go = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute("href");
    if (!href || !href.startsWith("#")) return;
    const target = document.querySelector<HTMLElement>(href);
    if (!target) {
      // Depuis une autre page : retour à l'accueil, à l'ancre demandée.
      e.preventDefault();
      router.push(`/${href}`);
      return;
    }
    e.preventDefault();
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(target, { duration: 1.4 });
    else target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="nav" aria-label="Navigation principale">
      <ul className="nav__pill">
        {items.map((it) => (
          <li key={it.href} className={"hideOnSmall" in it ? "nav__item--wide" : undefined}>
            <a className="nav__link" href={it.href} onClick={go}>
              {it.label}
            </a>
          </li>
        ))}
        <li>
          <a className="nav__link nav__link--cta" href="#tarifs" onClick={go}>
            Tarifs
          </a>
        </li>
      </ul>
    </nav>
  );
}
