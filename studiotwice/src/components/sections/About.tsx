import SectionHead from "@/components/SectionHead";
import Reveal from "@/components/Reveal";
import Parallax from "@/components/Parallax";
import { about as c } from "@/content/sections";

/** Section 06 : le duo, en deux colonnes qui se répondent, sans photo. */
export default function About() {
  return (
    <section id="qui" className="section about" aria-labelledby="qui-title">
      <SectionHead id="qui" num={c.num} title={c.title} />
      <Parallax speed={0.05}>
        <Reveal as="p" className="about__statement t-display" stagger={0.08}>
          {c.statement}
        </Reveal>
      </Parallax>
      <div className="about__duo">
        {c.people.map((p, i) => (
          <div key={p.role} className={`about__person about__person--${i + 1}`}>
            <span className="about__num t-caption">{i === 0 ? "Atelier" : "Sur la route"}</span>
            <h3 className="about__role t-display">{p.role}</h3>
            {/* TODO: afficher le prénom quand il est renseigné dans sections.ts */}
            {p.name && <p className="about__name">{p.name}</p>}
            <p className="about__text">{p.text}</p>
          </div>
        ))}
      </div>
      <p className="about__footer">{c.footer}</p>
    </section>
  );
}
