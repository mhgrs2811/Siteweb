import 'react-native-get-random-values';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { AppState, type AppStateStatus } from 'react-native';

import type { Database } from './database.types';
import { env } from './env';
import { createLogger } from './logger';
import { createSessionStorage } from './secure-storage';

const log = createLogger('supabase');

export type LumeSupabaseClient = SupabaseClient<Database>;

function buildClient(): LumeSupabaseClient | null {
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    log.info('Supabase not configured: running in local-only mode');
    return null;
  }
  return createClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
    auth: {
      storage: createSessionStorage(),
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
}

/**
 * The Supabase client, or null when the project is not configured yet. Every caller must
 * handle null so the app stays fully usable offline and before the backend exists.
 */
export const supabase: LumeSupabaseClient | null = buildClient();

export const supabaseConfigured = supabase !== null;

let refreshBound = false;

/**
 * Supabase refreshes tokens on a timer that must only run while the app is in the foreground.
 * Called once from the root layout.
 */
export function bindSessionRefreshToAppState(): void {
  if (!supabase || refreshBound) return;
  refreshBound = true;
  const apply = (state: AppStateStatus) => {
    if (state === 'active') {
      supabase?.auth.startAutoRefresh();
    } else {
      supabase?.auth.stopAutoRefresh();
    }
  };
  apply(AppState.currentState);
  AppState.addEventListener('change', apply);
}
