import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { env } from '@/core/config/env';

import type { Database } from './database.types';
import { secureSessionStorage } from './secure-storage';

export type SafeCheckSupabaseClient = SupabaseClient<Database>;

let client: SafeCheckSupabaseClient | null = null;

/** Client Supabase paresseux : n'est instancié que si la source de données est `supabase`. */
export function getSupabaseClient(): SafeCheckSupabaseClient {
  if (client) return client;
  const url = env.EXPO_PUBLIC_SUPABASE_URL;
  const anonKey = env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error('Supabase non configuré : voir .env.example');
  }
  client = createClient<Database>(url, anonKey, {
    auth: {
      storage: secureSessionStorage,
      autoRefreshToken: true,
      persistSession: true,
      // Pas de deep-link OAuth pour l'instant : l'OTP email suffit.
      detectSessionInUrl: false,
    },
    global: {
      headers: { 'x-safecheck-client': 'mobile' },
    },
  });
  return client;
}
