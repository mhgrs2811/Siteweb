/** Flèche des boutons et liens, un seul dessin pour tout le site. */
export default function Arrow({ className = "btn__arrow" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 12 12 2M4 2h8v8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
