import { useQuery } from '@tanstack/react-query';

import { env } from '@/core/config/env';
import { useRepositories } from '@/core/data';

export function useAlerts() {
  const { alert } = useRepositories();
  return useQuery({
    queryKey: ['alerts', env.EXPO_PUBLIC_DEFAULT_REGION],
    queryFn: () => alert.list({ region: env.EXPO_PUBLIC_DEFAULT_REGION }),
  });
}

export function useAlert(id: string | undefined) {
  const { alert } = useRepositories();
  return useQuery({
    queryKey: ['alert', id],
    queryFn: () => (id ? alert.getById(id) : Promise.resolve(null)),
    enabled: Boolean(id),
  });
}
