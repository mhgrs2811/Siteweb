import { createLogger } from '@/lib/logger';
import { supabase } from '@/lib/supabase';

const log = createLogger('auth');

let pending: Promise<string | null> | null = null;

/**
 * Returns the current user id, creating an anonymous Supabase session on first use.
 * Concurrent callers share one in-flight request. Resolves to null when Supabase is not
 * configured or unreachable: the caller keeps working locally and retries later.
 */
export function ensureAnonymousSession(): Promise<string | null> {
  if (!supabase) return Promise.resolve(null);
  if (!pending) {
    pending = signIn().finally(() => {
      pending = null;
    });
  }
  return pending;
}

async function signIn(): Promise<string | null> {
  if (!supabase) return null;
  try {
    const { data } = await supabase.auth.getSession();
    if (data.session?.user) return data.session.user.id;

    const { data: anonymous, error } = await supabase.auth.signInAnonymously();
    if (error) {
      log.warn('Anonymous sign-in failed', error.message);
      return null;
    }
    log.info('Anonymous session created');
    return anonymous.user?.id ?? null;
  } catch (error) {
    log.warn('Session check failed', error instanceof Error ? error.message : error);
    return null;
  }
}

/** Current user id without triggering a sign-in. */
export async function getCurrentUserId(): Promise<string | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.user.id ?? null;
}
