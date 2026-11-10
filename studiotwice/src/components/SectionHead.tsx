import Reveal from "./Reveal";

interface Props {
  num: string;
  title: string;
  lead?: string;
  id: string;
  /** Titre très grand, pour les sections qui portent une phrase. */
  big?: boolean;
}

export default function SectionHead({ num, title, lead, id, big }: Props) {
  return (
    <>
      <div className="section__head">
        <span className="section__num t-caption">{num}</span>
        <Reveal as="h2" id={`${id}-title`} className={`t-display section__title${big ? " section__title--big" : ""}`}>
          {title}
        </Reveal>
      </div>
      {lead && <Reveal className="section__lead">{lead}</Reveal>}
    </>
  );
}
