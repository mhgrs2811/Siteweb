import { Chapter } from "@/components/ui/Chapter";
import { Reveal } from "@/components/ui/Reveal";
import { copy } from "@/data/copy";
import s from "./Manifesto.module.css";

/** Section 02 — Manifeste : titre XXL à gauche, texte décalé à droite, signature. */
export function Manifesto() {
  const words = copy.manifesto.signature.split(". ").filter(Boolean);
  return (
    <section id="manifeste" className={`tone-light ${s.section}`} aria-labelledby="manifeste-title">
      <div className={`container ${s.grid}`}>
        <Reveal className={s.head}>
          <Chapter number="02" label="Manifeste" />
          <h2 id="manifeste-title" className="display display-xl">
            {copy.manifesto.title}
          </h2>
        </Reveal>
        <Reveal className={s.body} delay={1}>
          {copy.manifesto.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </Reveal>
        <Reveal className={s.signature} delay={2} as="p">
          {words.map((w, i) => (
            <span key={w} style={{ display: "contents" }}>
              <span>{w.replace(/\.$/, "")}.</span>
              {i < words.length - 1 && <span className={s.sep} aria-hidden="true" />}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
