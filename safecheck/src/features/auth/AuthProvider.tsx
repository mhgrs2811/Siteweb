import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';

import { track } from '@/core/analytics';
import { useRepositories, type AuthState } from '@/core/data';

const AuthContext = createContext<AuthState>({ status: 'loading' });

export function AuthProvider({ children }: PropsWithChildren) {
  const { auth } = useRepositories();
  const [state, setState] = useState<AuthState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    auth
      .getState()
      .then((s) => {
        if (!cancelled) setState(s);
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'signed_out' });
      });
    const unsubscribe = auth.onStateChange((s) => {
      if (s.status === 'signed_in') track({ name: 'sign_in_completed' });
      setState(s);
    });
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [auth]);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  return useContext(AuthContext);
}
