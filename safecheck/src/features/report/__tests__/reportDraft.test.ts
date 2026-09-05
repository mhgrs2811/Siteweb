import { canProceed, DescriptionSchema, EMPTY_DRAFT } from '../reportDraft';

describe('brouillon de signalement', () => {
  const identifier = { kind: 'phone', value: '+33612345678', display: '06 12 34 56 78' } as const;

  it("bloque l'étape identifiant sans contact", () => {
    expect(canProceed('identifier', EMPTY_DRAFT)).toBe(false);
    expect(canProceed('identifier', { ...EMPTY_DRAFT, identifier })).toBe(true);
  });

  it('bloque la confirmation sans catégorie', () => {
    expect(canProceed('confirm', { ...EMPTY_DRAFT, identifier })).toBe(false);
    expect(canProceed('confirm', { ...EMPTY_DRAFT, identifier, category: 'phishing' })).toBe(true);
  });

  it('refuse une description contenant un numéro de carte probable', () => {
    expect(DescriptionSchema.safeParse('Ma carte 4970 1234 5678 9012 a été débitée').success).toBe(false);
    expect(DescriptionSchema.safeParse('On m’a demandé de valider une opération.').success).toBe(true);
  });
});
