import { useMutation } from '@tanstack/react-query';

import { useRepositories } from '@/core/data';

export function useRequestEmailOtp() {
  const { auth } = useRepositories();
  return useMutation({ mutationFn: (email: string) => auth.requestEmailOtp(email) });
}

export function useVerifyEmailOtp() {
  const { auth } = useRepositories();
  return useMutation({
    mutationFn: ({ email, code }: { email: string; code: string }) => auth.verifyEmailOtp(email, code),
  });
}

export function useSignOut() {
  const { auth } = useRepositories();
  return useMutation({ mutationFn: () => auth.signOut() });
}

export function useDeleteAccount() {
  const { auth } = useRepositories();
  return useMutation({ mutationFn: () => auth.deleteAccount() });
}
