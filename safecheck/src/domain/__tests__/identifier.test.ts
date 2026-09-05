import { detectKind, normalizeWebsite, parseIdentifier } from '../identifier';

describe('detectKind', () => {
  it.each([
    ['06 12 34 56 78', 'phone'],
    ['+33 6 12 34 56 78', 'phone'],
    ['contact@banque-securite.fr', 'email'],
    ['www.colis-suivi-fr.com', 'website'],
    ['https://impots.gouv.fr/remboursement', 'website'],
    ['bonjour', null],
    ['', null],
  ])('%s → %s', (input, expected) => {
    expect(detectKind(input)).toBe(expected);
  });
});

describe('parseIdentifier — téléphone', () => {
  it('normalise un numéro français national en E.164', () => {
    const r = parseIdentifier('06 12 34 56 78');
    expect(r.ok && r.identifier.value).toBe('+33612345678');
    expect(r.ok && r.identifier.display).toBe('06 12 34 56 78');
  });
  it('accepte les formats international et 00', () => {
    const intl = parseIdentifier('+33612345678');
    expect(intl.ok && intl.identifier.value).toBe('+33612345678');
    const zeros = parseIdentifier('0033 6 12 34 56 78');
    expect(zeros.ok && zeros.identifier.value).toBe('+33612345678');
  });
  it('fait converger plusieurs saisies vers la même entité', () => {
    const inputs = ['06.12.34.56.78', '+33 (0)6 12 34 56 78', '06-12-34-56-78', '+33612345678'];
    const values = inputs.map((i) => {
      const r = parseIdentifier(i);
      return r.ok ? r.identifier.value : r.reason;
    });
    expect(new Set(values)).toEqual(new Set(['+33612345678']));
  });
  it('rejette un numéro trop court', () => {
    expect(parseIdentifier('06 12').ok).toBe(false);
  });
});

describe('parseIdentifier — email', () => {
  it('met en minuscules', () => {
    const r = parseIdentifier('Service.Client@Banque.FR');
    expect(r.ok && r.identifier.value).toBe('service.client@banque.fr');
  });
  it('rejette un email invalide', () => {
    expect(parseIdentifier('service@banque').ok).toBe(false);
  });
});

describe('parseIdentifier — site web', () => {
  it('réduit au nom de domaine sans www', () => {
    const r = parseIdentifier('https://www.Colis-Suivi.com/track?id=42');
    expect(r.ok && r.identifier.value).toBe('colis-suivi.com');
  });
  it('accepte un domaine nu', () => {
    expect(normalizeWebsite('mabanque-verif.net')).toBe('mabanque-verif.net');
  });
  it('rejette une entrée non reconnue', () => {
    expect(parseIdentifier('juste du texte').ok).toBe(false);
  });
});
