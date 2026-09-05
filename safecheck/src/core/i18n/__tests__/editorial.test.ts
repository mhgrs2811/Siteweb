import en from '../locales/en';
import fr from '../locales/fr';

/**
 * Garde-fou éditorial automatisé (docs/EDITORIAL_GUIDELINES.md).
 * Aucun texte visible ne doit qualifier catégoriquement un contact.
 */
const FORBIDDEN_FR = [
  /\bescroc(s)?\b/i,
  /\barnaqueur(s)?\b/i,
  /\bfraudeur(s)?\b/i,
  /\bcriminel(s)?\b/i,
  /\bcoupable(s)?\b/i,
  /\bfraude avérée\b/i,
  /\bconfirmé(e)? comme (une )?arnaque\b/i,
  /\best une arnaque\b/i,
  /\bc['’]est un(e)? (arnaque|fraude|escroquerie)\b/i,
  /\bce numéro est frauduleux\b/i,
  /\bnuméro (dangereux|frauduleux)\b/i,
  /\bcontact (dangereux|frauduleux)\b/i,
  /\bsite (dangereux|frauduleux)\b/i,
];

const FORBIDDEN_EN = [
  /\bscammer(s)?\b/i,
  /\bfraudster(s)?\b/i,
  /\bcriminal(s)?\b/i,
  /\bguilty\b/i,
  /\bconfirmed (scam|fraud)\b/i,
  /\bis a scam\b/i,
  /\bthis (number|contact|site) is (dangerous|fraudulent)\b/i,
];

function flatten(obj: unknown, prefix = ''): [string, string][] {
  if (typeof obj === 'string') return [[prefix, obj]];
  if (obj && typeof obj === 'object') {
    return Object.entries(obj).flatMap(([k, v]) => flatten(v, prefix ? `${prefix}.${k}` : k));
  }
  return [];
}

describe('charte éditoriale', () => {
  it.each(flatten(fr))('fr — %s ne contient aucune accusation définitive', (_key, text) => {
    for (const re of FORBIDDEN_FR) expect(text).not.toMatch(re);
  });

  it.each(flatten(en))('en — %s contains no definitive accusation', (_key, text) => {
    for (const re of FORBIDDEN_EN) expect(text).not.toMatch(re);
  });

  it('les deux langues ont exactement les mêmes clés', () => {
    const frKeys = flatten(fr).map(([k]) => k).sort();
    const enKeys = flatten(en).map(([k]) => k).sort();
    expect(enKeys).toEqual(frKeys);
  });
});
