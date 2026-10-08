import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

import { usePreferences } from '@/store/preferences';

/**
 * Four haptic intents cover the whole app. Components never call expo-haptics directly, so the
 * user preference and the platform fallback are honoured everywhere.
 *
 * - selection : picking a chip, moving a segmented control
 * - confirm   : pressing a primary action, checking a routine step
 * - success   : score revealed, purchase done, streak extended
 * - warning   : validation error, photo quality too low
 */
export type HapticIntent = 'selection' | 'confirm' | 'success' | 'warning';

export const HAPTIC_INTENTS: readonly HapticIntent[] = [
  'selection',
  'confirm',
  'success',
  'warning',
];

export const hapticsSupported = Platform.OS === 'ios' || Platform.OS === 'android';

export async function haptic(intent: HapticIntent): Promise<void> {
  if (!hapticsSupported) return;
  if (!usePreferences.getState().hapticsEnabled) return;

  try {
    switch (intent) {
      case 'selection':
        await Haptics.selectionAsync();
        return;
      case 'confirm':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        return;
      case 'success':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        return;
      case 'warning':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        return;
    }
  } catch {
    // Haptics are a nicety: a device without an engine must never surface an error.
  }
}
