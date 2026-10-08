import type { Language } from '@/i18n';
import { createLogger } from '@/lib/logger';
import { supabase } from '@/lib/supabase';

import { ensureAnonymousSession } from '../auth/session';
import { isUnderage } from '../onboarding/rules';
import { useOnboarding } from '../onboarding/store';
import { toProfileRow, toSkinProfileRow } from './mapping';

const log = createLogger('profile-sync');

export type SyncResult = 'synced' | 'skipped' | 'failed';

let inFlight: Promise<SyncResult> | null = null;

/**
 * Pushes the local onboarding answers to Supabase. Idempotent upserts keyed by the user id,
 * safe to call often: it returns `skipped` when there is nothing to send or no backend, and
 * leaves `pendingSync` raised on failure so a later call retries.
 */
export function syncProfile(locale: Language): Promise<SyncResult> {
  if (!inFlight) {
    inFlight = run(locale).finally(() => {
      inFlight = null;
    });
  }
  return inFlight;
}

async function run(locale: Language): Promise<SyncResult> {
  const state = useOnboarding.getState();
  if (!supabase || !state.pendingSync) return 'skipped';

  const { answers } = state;
  // The server copy only starts once the identity questions are answered, and never for a
  // user under 16: no account is created and nothing leaves the device.
  if (!answers.ageBand || isUnderage(answers.ageBand) || answers.firstName.trim() === '') {
    return 'skipped';
  }

  // The anonymous session is created here, on first need, rather than at launch.
  const userId = await ensureAnonymousSession();
  if (!userId) return 'failed';

  try {
    const profile = toProfileRow(answers, { userId, locale, completedAt: state.completedAt });
    const { error: profileError } = await supabase.from('profiles').upsert(profile);
    if (profileError) throw profileError;

    if (answers.skinType && answers.routineLevel) {
      const skin = toSkinProfileRow(answers, userId);
      const { error: skinError } = await supabase.from('skin_profiles').upsert(skin);
      if (skinError) throw skinError;
    }

    // Only clear the flag if nothing changed while the request was in flight.
    if (useOnboarding.getState().answers === answers) {
      useOnboarding.getState().markSynced();
    }
    log.info('Profile synced');
    return 'synced';
  } catch (error) {
    log.warn('Profile sync failed', error instanceof Error ? error.message : error);
    return 'failed';
  }
}
