import { env } from '@/core/config/env';

import { createMockRepositories } from './mock';
import type { Repositories } from './repositories';

/**
 * Fabrique des dépôts selon la configuration.
 * Le module Supabase est chargé paresseusement pour ne pas embarquer le client
 * (ni exiger de clés) en mode mock.
 */
export function createRepositories(): Repositories {
  if (env.EXPO_PUBLIC_DATA_SOURCE === 'supabase') {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getSupabaseClient } = require('@/core/supabase/client') as typeof import('@/core/supabase/client');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createSupabaseRepositories } = require('./supabase') as typeof import('./supabase');
    return createSupabaseRepositories(getSupabaseClient());
  }
  return createMockRepositories();
}
