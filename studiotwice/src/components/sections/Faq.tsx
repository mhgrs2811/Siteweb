import SectionHead from "@/components/SectionHead";
import { faq as c } from "@/content/sections";

/** Section 07 : questions en accordéon natif, accessible sans JavaScript. */
export default function Faq() {
  return (
    <section id="questions" className="section faq" aria-labelledby="questions-title">
      <SectionHead id="questions" num={c.num} title={c.title} />
      <div className="faq__list">
        {c.items.map((it, i) => (
          <details key={it.q} className="faq__item" name="faq">
            <summary className="faq__q">
              <span className="faq__num t-caption">{String(i + 1).padStart(2, "0")}</span>
              <span className="faq__qt">{it.q}</span>
              <span className="faq__plus" aria-hidden="true">
                <i />
                <i />
              </span>
            </summary>
            <div className="faq__a">
              <p>{it.a}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
