import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { track } from '@/core/analytics';
import { useRepositories } from '@/core/data';
import type { NewReportInput } from '@/domain';
import { checkQueryKey } from '@/features/check';

export function useCreateReport() {
  const { report } = useRepositories();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: NewReportInput) => report.create(input),
    onSuccess: (_created, input) => {
      track({ name: 'report_submitted', props: { category: input.category } });
      void qc.invalidateQueries({ queryKey: ['my-reports'] });
      void qc.invalidateQueries({ queryKey: checkQueryKey(input.identifier) });
    },
  });
}

export function useMyReports(enabled: boolean) {
  const { report } = useRepositories();
  return useQuery({ queryKey: ['my-reports'], queryFn: () => report.listMine(), enabled });
}
