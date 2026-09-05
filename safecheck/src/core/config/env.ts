import { z } from 'zod';

/**
 * Variables d'environnement publiques (préfixe EXPO_PUBLIC_ obligatoire pour
 * qu'Expo les injecte au bundle). Validées au démarrage : une configuration
 * invalide échoue vite et clairement plutôt qu'en production.
 */
const EnvSchema = z.object({
  EXPO_PUBLIC_DATA_SOURCE: z.enum(['mock', 'supabase']).default('mock'),
  EXPO_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  EXPO_PUBLIC_SUPABASE_ANON_KEY: z.string().min(10).optional(),
  EXPO_PUBLIC_APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  EXPO_PUBLIC_DEFAULT_REGION: z.string().length(2).default('FR'),
});

export type Env = z.infer<typeof EnvSchema>;

function loadEnv(): Env {
  const parsed = EnvSchema.safeParse({
    EXPO_PUBLIC_DATA_SOURCE: process.env.EXPO_PUBLIC_DATA_SOURCE,
    EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
    EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    EXPO_PUBLIC_APP_ENV: process.env.EXPO_PUBLIC_APP_ENV,
    EXPO_PUBLIC_DEFAULT_REGION: process.env.EXPO_PUBLIC_DEFAULT_REGION,
  });
  if (!parsed.success) {
    throw new Error(`Configuration invalide (.env) : ${parsed.error.message}`);
  }
  const env = parsed.data;
  if (env.EXPO_PUBLIC_DATA_SOURCE === 'supabase') {
    if (!env.EXPO_PUBLIC_SUPABASE_URL || !env.EXPO_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error(
        'EXPO_PUBLIC_DATA_SOURCE=supabase requiert EXPO_PUBLIC_SUPABASE_URL et EXPO_PUBLIC_SUPABASE_ANON_KEY.',
      );
    }
  }
  return env;
}

export const env: Env = loadEnv();

export const isProduction = env.EXPO_PUBLIC_APP_ENV === 'production';
