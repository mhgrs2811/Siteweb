import Image from "next/image";
import SectionHead from "@/components/SectionHead";
import Arrow from "@/components/Arrow";
import { realisations as c } from "@/content/sections";

/** Section 02. Vide tant qu'aucun projet réel n'est fourni : on le dit, sans faux visuel. */
export default function Realisations() {
  const projects = c.projects;
  return (
    <section id="realisations" className="section work" aria-labelledby="realisations-title">
      <SectionHead id="realisations" num={c.num} title={c.title} lead={c.lead} />

      {projects.length === 0 ? (
        <div className="work__empty">
          <div className="work__frame" aria-hidden="true">
            <div className="work__bar">
              <i />
              <i />
              <i />
              <span>votre-commerce.be</span>
            </div>
            <div className="work__screen">
              <span className="t-caption">Emplacement : capture de la première réalisation</span>
            </div>
          </div>
          <div className="work__text">
            <p className="work__title t-display">{c.emptyTitle}</p>
            <p className="work__p">{c.emptyText}</p>
            <a className="link" href="#contact">
              Parlons-en
            </a>
          </div>
        </div>
      ) : (
        <ol className="work__list">
          {projects.map((p, i) => (
            <li key={p.url} className="project">
              <div className="project__media">
                <div className="work__frame">
                  <div className="work__bar">
                    <i />
                    <i />
                    <i />
                    <span>{p.url.replace(/^https?:\/\//, "")}</span>
                  </div>
                  <Image src={p.image} alt={`Page d’accueil du site de ${p.name}`} width={1600} height={1000} sizes="(min-width: 1024px) 60vw, 100vw" />
                </div>
              </div>
              <div className="project__body">
                <span className="t-caption">
                  {String(i + 1).padStart(2, "0")} · {p.sector}, {p.city}
                </span>
                <h3 className="project__name t-display">{p.name}</h3>
                <ul className="project__what">
                  {p.what.map((w) => (
                    <li key={w}>{w}</li>
                  ))}
                </ul>
                <a className="btn" href={p.url} target="_blank" rel="noopener">
                  Voir le site
                  <Arrow />
                </a>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
