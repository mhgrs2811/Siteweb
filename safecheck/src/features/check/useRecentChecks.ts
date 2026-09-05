import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

import type { Identifier, RiskLevel } from '@/domain';

/**
 * Historique local des vérifications (appareil uniquement, jamais envoyé au serveur).
 * Limité à 10 entrées ; effaçable par l'utilisateur.
 */
export interface RecentCheck {
  identifier: Identifier;
  level: RiskLevel;
  checkedAt: string;
}

const KEY = 'safecheck.recentChecks.v1';
const MAX = 10;

export function useRecentChecks() {
  const [items, setItems] = useState<RecentCheck[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (raw) setItems(JSON.parse(raw) as RecentCheck[]);
      })
      .catch(() => undefined)
      .finally(() => setLoaded(true));
  }, []);

  const persist = useCallback(async (next: RecentCheck[]) => {
    setItems(next);
    try {
      await AsyncStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // Stockage indisponible : l'historique reste en mémoire pour la session.
    }
  }, []);

  const add = useCallback(
    (entry: RecentCheck) => {
      setItems((prev) => {
        const next = [entry, ...prev.filter((p) => p.identifier.value !== entry.identifier.value)].slice(0, MAX);
        void persist(next);
        return next;
      });
    },
    [persist],
  );

  const clear = useCallback(() => persist([]), [persist]);

  return { items, loaded, add, clear };
}
