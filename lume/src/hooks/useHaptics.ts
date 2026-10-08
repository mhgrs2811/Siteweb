import { useCallback } from 'react';

import { haptic, type HapticIntent } from '@/lib/haptics';

/** Stable callback wrapper around `haptic()` for components. */
export function useHaptics() {
  return useCallback((intent: HapticIntent) => {
    void haptic(intent);
  }, []);
}
