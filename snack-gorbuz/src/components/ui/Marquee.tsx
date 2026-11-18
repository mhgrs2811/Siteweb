import s from "./Marquee.module.css";

interface MarqueeProps {
  words: readonly string[];
  className?: string;
}

/** Bandeau typographique lent. Le contenu est dupliqué pour une boucle continue. */
export function Marquee({ words, className }: MarqueeProps) {
  const sequence = [...words, ...words];
  return (
    <div className={[s.band, className].filter(Boolean).join(" ")} aria-hidden="true">
      <div className={s.track}>
        {sequence.map((word, i) => (
          <span key={`${word}-${i}`} className={s.item}>
            {word}
            <span className={s.sep} />
          </span>
        ))}
      </div>
    </div>
  );
}
