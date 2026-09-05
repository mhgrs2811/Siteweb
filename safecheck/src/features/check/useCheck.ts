import { useQuery } from '@tanstack/react-query';

import { track } from '@/core/analytics';
import { useRepositories } from '@/core/data';
import type { Identifier } from '@/domain';

export const checkQueryKey = (id: Identifier) => ['check', id.kind, id.value] as const;

export function useCheck(identifier: Identifier | null) {
  const { check } = useRepositories();
  return useQuery({
    queryKey: identifier ? checkQueryKey(identifier) : ['check', 'none'],
    enabled: Boolean(identifier),
    queryFn: async () => {
      if (!identifier) throw new Error('unreachable');
      const result = await check.check(identifier);
      track({ name: 'check_performed', props: { kind: identifier.kind, level: result.risk.level } });
      return result;
    },
    staleTime: 2 * 60_000,
  });
}
