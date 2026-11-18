import Link from "next/link";
import type { CSSProperties } from "react";
import { StampMark } from "@/components/brand/Stamp";
import { ArrowDown } from "@/components/ui/Icons";
import { copy } from "@/data/copy";
import { HeroVisual } from "./HeroVisual";
import s from "./Hero.module.css";

/** Section 01 — Hero : H1 typographique + scène 3D (poster SVG en secours). */
export function Hero() {
  return (
    <section className={`tone-dark ${s.hero}`} aria-labelledby="hero-title">
      <div className={`ghost ${s.ghost}`} aria-hidden="true">
        Gorbuz
      </div>

      <div className={`container ${s.inner}`}>
        <div className={s.copy}>
          <p className={s.marker}>
            <StampMark className={s.markerIcon} />
            <span>{copy.hero.markerBrand}</span>
            <span className={s.markerSep} aria-hidden="true" />
            <span>{copy.hero.markerPlace}</span>
          </p>

          <h1 id="hero-title" className={`display display-xxl ${s.title}`}>
            {copy.hero.titleLines.map((line, i) => (
              <span key={line} className={s.line}>
                <span className={s.lineInner} style={{ ["--i" as string]: i } as CSSProperties}>
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <p className={`lead ${s.lead}`}>{copy.hero.lead}</p>

          <div className={s.ctas}>
            <Link href="/carte" className="btn btn-primary btn-lg">
              {copy.hero.ctaPrimary}
            </Link>
            <Link href="/concept" className="btn btn-ghost btn-lg">
              {copy.hero.ctaSecondary}
            </Link>
          </div>
        </div>

        <div className={s.visual}>
          <HeroVisual label={copy.hero.sceneLabel} />
        </div>
      </div>

      <div className={`container ${s.foot}`}>
        <a href="#manifeste" className={s.scroll}>
          {copy.hero.scrollHint}
          <ArrowDown />
        </a>
        <p className={s.note}>{copy.hero.sceneNote}</p>
      </div>
    </section>
  );
}
