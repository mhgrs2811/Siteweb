import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createContext, useContext, useMemo, type PropsWithChildren } from 'react';

import { createRepositories } from './factory';
import type { Repositories } from './repositories';

const RepositoriesContext = createContext<Repositories | null>(null);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 10 * 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function DataProvider({
  children,
  repositories,
}: PropsWithChildren<{ repositories?: Repositories }>) {
  const value = useMemo(() => repositories ?? createRepositories(), [repositories]);
  return (
    <RepositoriesContext.Provider value={value}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </RepositoriesContext.Provider>
  );
}

export function useRepositories(): Repositories {
  const ctx = useContext(RepositoriesContext);
  if (!ctx) throw new Error('useRepositories doit être utilisé sous <DataProvider>');
  return ctx;
}
