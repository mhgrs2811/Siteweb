/**
 * Section 02, Réalisations. Pour l'instant un emplacement réservé :
 * aucune réalisation réelle n'a encore été fournie.
 */
export default function Realisations() {
  return (
    <section id="realisations" className="section" aria-labelledby="realisations-title">
      <div className="section__head">
        <span className="section__num">02</span>
        <h2 id="realisations-title" className="t-display section__title">
          Réalisations
        </h2>
      </div>
      <p className="section__lead">
        Nos premières réalisations arrivent ici, en grand format, avec le secteur du commerce, ce
        qui a été fait et un lien vers le site.
      </p>
      {/* TODO: remplacer par les réalisations réelles (capture, secteur, ce qui a été fait, lien). */}
      <div className="slot" role="img" aria-label="Emplacement réservé à la première réalisation">
        Emplacement : première réalisation, capture, secteur et lien
      </div>
    </section>
  );
}
