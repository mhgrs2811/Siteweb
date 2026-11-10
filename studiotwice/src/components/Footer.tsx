import Link from "next/link";
import { footer as c } from "@/content/sections";
import { orSoon, site } from "@/content/site";

export default function Footer() {
  return (
    <footer className="foot" aria-label="Pied de page">
      <div className="foot__inner">
        <div className="foot__brand">
          <span className="wordmark">{site.name}</span>
          <p className="foot__tag">{site.tagline}</p>
        </div>
        <dl className="foot__meta">
          <div>
            <dt className="t-caption">{c.area}</dt>
            <dd>{site.area}</dd>
          </div>
          <div>
            <dt className="t-caption">{c.bce}</dt>
            {/* TODO: numéro BCE dans src/content/site.ts */}
            <dd>{orSoon(site.bce)}</dd>
          </div>
          <div>
            <dt className="t-caption">E-mail</dt>
            {/* TODO: adresse e-mail dans src/content/site.ts */}
            <dd>{site.email ? <a className="link" href={`mailto:${site.email}`}>{site.email}</a> : "à venir"}</dd>
          </div>
        </dl>
        <nav className="foot__nav" aria-label="Pages légales">
          <Link className="link" href="/mentions-legales">
            {c.legal}
          </Link>
          <Link className="link" href="/confidentialite">
            {c.privacy}
          </Link>
          {/* Structure prête pour la version néerlandaise : route /nl à créer. */}
          <span className="foot__nl" aria-disabled="true" title="Version néerlandaise à venir">
            {c.nl} <small className="t-caption">{c.nlSoon}</small>
          </span>
        </nav>
      </div>
      <p className="foot__line">
        <span>
          © 2026 {site.name}
        </span>
        <span>Site dessiné et construit par nous, sans traceur ni cookie.</span>
      </p>
    </footer>
  );
}
