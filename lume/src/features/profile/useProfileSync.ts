import { useEffect } from 'react';
import { AppState } from 'react-native';

import { resolveLanguage } from '@/i18n';
import { supabaseConfigured } from '@/lib/supabase';
import { usePreferences } from '@/store/preferences';

import { useOnboarding } from '../onboarding/store';
import { syncProfile } from './sync';

const RETRY_INTERVAL_MS = 60_000;

/**
 * Keeps the server copy of the profile fresh: syncs whenever local answers change, when the
 * app returns to the foreground, and on a slow retry loop while a sync is pending.
 * Mounted once in the root layout.
 */
export function useProfileSync(): void {
  const pendingSync = useOnboarding((state) => state.pendingSync);
  const hasHydrated = useOnboarding((state) => state.hasHydrated);
  const language = usePreferences((state) => state.language);

  useEffect(() => {
    if (!supabaseConfigured || !hasHydrated || !pendingSync) return;

    const locale = resolveLanguage(language);
    void syncProfile(locale);

    const interval = setInterval(() => void syncProfile(locale), RETRY_INTERVAL_MS);
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') void syncProfile(locale);
    });

    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, [hasHydrated, language, pendingSync]);
}
