import { QueryClient } from '@tanstack/react-query';

/**
 * Single TanStack Query client for server state (Supabase data from Phase 1 onward).
 * Conservative defaults: data stays fresh for a minute, failed requests retry twice.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        gcTime: 5 * 60_000,
        retry: 2,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}
