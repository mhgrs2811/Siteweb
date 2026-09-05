/**
 * Identifiants vérifiables par SafeCheck.
 *
 * Logique pure : aucune dépendance React / Supabase. Toute la normalisation
 * se fait ici, côté client ET côté serveur (la même règle est répliquée en SQL
 * dans `supabase/migrations`), afin qu'un même contact saisi de plusieurs
 * façons (« 06 12 34 56 78 », « +33612345678 ») corresponde à une seule entité.
 */

export type IdentifierKind = 'phone' | 'email' | 'website';

export interface Identifier {
  readonly kind: IdentifierKind;
  /** Valeur canonique : E.164 pour phone, minuscule pour email, hostname pour website. */
  readonly value: string;
  /** Valeur affichable pour l'utilisateur. */
  readonly display: string;
}

export type ParseIdentifierError =
  | { ok: false; reason: 'empty' }
  | { ok: false; reason: 'too_short' }
  | { ok: false; reason: 'unrecognized' };

export type ParseIdentifierResult = { ok: true; identifier: Identifier } | ParseIdentifierError;

/** Indicatifs nationaux gérés pour la normalisation locale (extensible). */
const NATIONAL_PREFIXES: Record<string, { countryCode: string; trunk: string; nsnLength: number[] }> = {
  FR: { countryCode: '33', trunk: '0', nsnLength: [9] },
  BE: { countryCode: '32', trunk: '0', nsnLength: [8, 9] },
  CH: { countryCode: '41', trunk: '0', nsnLength: [9] },
  ES: { countryCode: '34', trunk: '', nsnLength: [9] },
  IT: { countryCode: '39', trunk: '', nsnLength: [9, 10] },
  DE: { countryCode: '49', trunk: '0', nsnLength: [10, 11] },
  GB: { countryCode: '44', trunk: '0', nsnLength: [10] },
  US: { countryCode: '1', trunk: '1', nsnLength: [10] },
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

/** Détecte le type d'identifiant de manière tolérante aux saisies imparfaites. */
export function detectKind(raw: string): IdentifierKind | null {
  const s = raw.trim();
  if (!s) return null;
  if (s.includes('@')) return 'email';
  // Un numéro : chiffres, espaces, points, tirets, parenthèses, + en tête
  if (/^\+?[\d\s().-]{6,}$/.test(s)) return 'phone';
  // Un site : contient un point et pas d'espace, ou commence par http
  if (/^(https?:\/\/)?[^\s/]+\.[^\s]+$/i.test(s) || /^https?:\/\//i.test(s)) return 'website';
  return null;
}

export function normalizePhone(raw: string, region = 'FR'): string | null {
  // « +33 (0)6 … » : le (0) est un indicatif national redondant en notation internationale.
  let digits = raw.replace(/\(0\)/g, '').replace(/[^\d+]/g, '');
  if (digits.startsWith('00')) digits = `+${digits.slice(2)}`;
  if (digits.startsWith('+')) {
    const body = digits.slice(1);
    if (body.length < 8 || body.length > 15) return null;
    return `+${body}`;
  }
  const rule = NATIONAL_PREFIXES[region.toUpperCase()];
  if (!rule) return null;
  let nsn = digits;
  if (rule.trunk && nsn.startsWith(rule.trunk)) nsn = nsn.slice(rule.trunk.length);
  if (!rule.nsnLength.includes(nsn.length)) return null;
  return `+${rule.countryCode}${nsn}`;
}

export function normalizeEmail(raw: string): string | null {
  const s = raw.trim().toLowerCase();
  return EMAIL_RE.test(s) ? s : null;
}

export function normalizeWebsite(raw: string): string | null {
  let s = raw.trim().toLowerCase();
  if (!/^[a-z][a-z0-9+.-]*:\/\//.test(s)) s = `https://${s}`;
  try {
    const url = new URL(s);
    let host = url.hostname;
    if (host.startsWith('www.')) host = host.slice(4);
    if (!host.includes('.') || host.length < 4) return null;
    return host;
  } catch {
    return null;
  }
}

/** Formatage lisible d'un numéro E.164 (groupes de 2 pour la France). */
export function formatPhoneForDisplay(e164: string): string {
  if (e164.startsWith('+33') && e164.length === 12) {
    const nsn = `0${e164.slice(3)}`;
    return nsn.replace(/(\d{2})(?=\d)/g, '$1 ');
  }
  return e164;
}

export function parseIdentifier(raw: string, region = 'FR'): ParseIdentifierResult {
  const trimmed = raw.trim();
  if (!trimmed) return { ok: false, reason: 'empty' };
  if (trimmed.length < 3) return { ok: false, reason: 'too_short' };

  const kind = detectKind(trimmed);
  if (kind === 'phone') {
    const value = normalizePhone(trimmed, region);
    if (!value) return { ok: false, reason: 'unrecognized' };
    return { ok: true, identifier: { kind, value, display: formatPhoneForDisplay(value) } };
  }
  if (kind === 'email') {
    const value = normalizeEmail(trimmed);
    if (!value) return { ok: false, reason: 'unrecognized' };
    return { ok: true, identifier: { kind, value, display: value } };
  }
  if (kind === 'website') {
    const value = normalizeWebsite(trimmed);
    if (!value) return { ok: false, reason: 'unrecognized' };
    return { ok: true, identifier: { kind, value, display: value } };
  }
  return { ok: false, reason: 'unrecognized' };
}

/** Encode un identifiant pour l'utiliser dans une route Expo Router. */
export function identifierToRouteParams(id: Identifier): { kind: IdentifierKind; value: string } {
  return { kind: id.kind, value: encodeURIComponent(id.value) };
}

export function identifierFromRouteParams(kind: string, value: string): Identifier | null {
  if (kind !== 'phone' && kind !== 'email' && kind !== 'website') return null;
  const decoded = decodeURIComponent(value);
  const display = kind === 'phone' ? formatPhoneForDisplay(decoded) : decoded;
  return { kind, value: decoded, display };
}
