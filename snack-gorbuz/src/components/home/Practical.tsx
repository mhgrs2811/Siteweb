import { PracticalInfo } from "@/components/practical/PracticalInfo";
import { Chapter } from "@/components/ui/Chapter";
import { Reveal } from "@/components/ui/Reveal";
import { copy } from "@/data/copy";
import s from "./Practical.module.css";

/** Section 07 — Informations pratiques (conditionnelles). */
export function Practical() {
  return (
    <section className={`tone-beige ${s.section}`} aria-labelledby="pratique-title">
      <div className="container">
        <Reveal className={s.head}>
          <Chapter number="07" label="Infos pratiques" />
          <h2 id="pratique-title" className="display display-xl">
            {copy.practical.title}
          </h2>
        </Reveal>
        <Reveal delay={1}>
          <PracticalInfo variant="compact" />
        </Reveal>
      </div>
    </section>
  );
}
