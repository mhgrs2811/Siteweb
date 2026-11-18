import Link from "next/link";
import { Chapter } from "@/components/ui/Chapter";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { Reveal } from "@/components/ui/Reveal";
import { copy } from "@/data/copy";
import { backstageSlots } from "@/data/gallery";
import s from "./Backstage.module.css";

const areas = [s.a, s.b, s.c, s.d, s.e];

/** Section 06 — Coulisses : mosaïque asymétrique de médias remplaçables. */
export function Backstage() {
  return (
    <section className={`tone-light ${s.section}`} aria-labelledby="coulisses-title">
      <div className="container">
        <div className={s.head}>
          <Reveal className={s.title}>
            <Chapter number="06" label="Coulisses" />
            <h2 id="coulisses-title" className="display display-xl">
              {copy.backstage.title}
            </h2>
          </Reveal>
          <Reveal className={s.text} delay={1} as="p">
            {copy.backstage.text}
          </Reveal>
        </div>

        <Reveal className={s.mosaic} delay={1}>
          {backstageSlots.map((media, i) => (
            <MediaSlot
              key={media.id}
              media={media}
              className={areas[i]}
              sizes="(max-width: 768px) 100vw, 40vw"
              zoomable
            />
          ))}
        </Reveal>

        <div className={s.cta}>
          <Link href="/galerie" className="btn btn-solid btn-lg">
            {copy.backstage.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
