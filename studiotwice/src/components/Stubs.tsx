/** Sections à construire. Chacune garde son ancre pour la navigation. */
function Stub({ id, num, title, lead }: { id: string; num: string; title: string; lead: string }) {
  return (
    <section id={id} className="section" aria-labelledby={`${id}-title`}>
      <div className="section__head">
        <span className="section__num t-caption">{num}</span>
        <h2 id={`${id}-title`} className="t-display section__title">
          {title}
        </h2>
      </div>
      <p className="section__lead">{lead}</p>
    </section>
  );
}

export const Formules = () => (
  <Stub
    id="formules"
    num="03"
    title="Ce que nous faisons"
    lead="Trois formules, expliquées par ce que vous obtenez. Section en construction."
  />
);
export const Process = () => (
  <Stub
    id="comment"
    num="05"
    title="Comment ça se passe"
    lead="Rencontre sur place, maquette, mise en ligne, suivi. Section en construction."
  />
);
export const Contact = () => (
  <Stub
    id="contact"
    num="08"
    title="Contact"
    lead="Formulaire court, WhatsApp, appel direct. Section en construction."
  />
);
