import { useQuery } from '@tanstack/react-query';

import { useRepositories } from '@/core/data';

export function useArticles() {
  const { learn } = useRepositories();
  return useQuery({ queryKey: ['articles'], queryFn: () => learn.list(), staleTime: 30 * 60_000 });
}

export function useArticle(slug: string | undefined) {
  const { learn } = useRepositories();
  return useQuery({
    queryKey: ['article', slug],
    queryFn: () => (slug ? learn.getBySlug(slug) : Promise.resolve(null)),
    enabled: Boolean(slug),
  });
}
