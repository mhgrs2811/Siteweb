import type { ProfileRow, SkinProfileRow } from '@/lib/database.types';

import { EMPTY_ANSWERS, type OnboardingAnswers } from '../../onboarding/types';
import { fromRows, toProfileRow, toSkinProfileRow } from '../mapping';

const answers: OnboardingAnswers = {
  firstName: 'Léa',
  ageBand: '25_29',
  skinType: 'combination',
  goals: ['glow', 'pores'],
  sensitivities: ['fragrance'],
  routineLevel: 'basic',
  monthlyBudget: '20_50',
  lifestyle: { sleep: '7_8', water: '1_2', sun: 'sometimes', makeup: true },
  photoConsent: {
    acceptedAt: '2026-10-08T10:00:00.000Z',
    version: '2026-10-v1',
    keepPhotos: false,
  },
  notificationsOptIn: true,
};

const meta = { userId: 'user-1', locale: 'fr' as const, completedAt: '2026-10-08T10:05:00.000Z' };

describe('answers to rows', () => {
  it('builds the profiles row', () => {
    expect(toProfileRow(answers, meta)).toEqual({
      id: 'user-1',
      first_name: 'Léa',
      age_band: '25_29',
      locale: 'fr',
      photo_consent_at: '2026-10-08T10:00:00.000Z',
      photo_consent_version: '2026-10-v1',
      keep_photos: false,
      notifications_opt_in: true,
      onboarding_completed_at: '2026-10-08T10:05:00.000Z',
    });
  });

  it('builds the skin_profiles row with a plain lifestyle object', () => {
    expect(toSkinProfileRow(answers, 'user-1')).toEqual({
      user_id: 'user-1',
      skin_type: 'combination',
      goals: ['glow', 'pores'],
      sensitivities: ['fragrance'],
      routine_level: 'basic',
      monthly_budget: '20_50',
      lifestyle: { sleep: '7_8', water: '1_2', sun: 'sometimes', makeup: true },
    });
  });

  it('refuses to build rows from incomplete answers', () => {
    expect(() => toProfileRow(EMPTY_ANSWERS, meta)).toThrow('ageBand');
    expect(() => toSkinProfileRow({ ...answers, skinType: null }, 'user-1')).toThrow('skinType');
  });
});

describe('rows to answers', () => {
  const profile: ProfileRow = {
    id: 'user-1',
    first_name: 'Léa',
    age_band: '25_29',
    locale: 'fr',
    photo_consent_at: '2026-10-08T10:00:00.000Z',
    photo_consent_version: '2026-10-v1',
    keep_photos: false,
    notifications_opt_in: true,
    onboarding_completed_at: '2026-10-08T10:05:00.000Z',
    created_at: '2026-10-08T09:00:00.000Z',
    updated_at: '2026-10-08T10:05:00.000Z',
  };
  const skin: SkinProfileRow = {
    user_id: 'user-1',
    skin_type: 'combination',
    goals: ['glow', 'pores'],
    sensitivities: ['fragrance'],
    routine_level: 'basic',
    monthly_budget: '20_50',
    lifestyle: { sleep: '7_8', water: '1_2', sun: 'sometimes', makeup: true },
    updated_at: '2026-10-08T10:05:00.000Z',
  };

  it('round-trips the answers', () => {
    expect(fromRows(profile, skin)).toEqual(answers);
  });

  it('degrades unknown values to unanswered instead of crashing', () => {
    const tampered: SkinProfileRow = {
      ...skin,
      skin_type: 'mystery',
      goals: ['glow', 'teleportation'],
      lifestyle: 'not an object',
    };
    const result = fromRows({ ...profile, age_band: 'ancient' }, tampered);
    expect(result.ageBand).toBeNull();
    expect(result.skinType).toBeNull();
    expect(result.goals).toEqual(['glow']);
    expect(result.lifestyle).toEqual({ sleep: null, water: null, sun: null, makeup: null });
  });

  it('handles a profile without a skin profile yet', () => {
    const result = fromRows(profile, null);
    expect(result.firstName).toBe('Léa');
    expect(result.skinType).toBeNull();
    expect(result.goals).toEqual([]);
  });
});
