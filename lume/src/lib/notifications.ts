import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { createLogger } from './logger';

const log = createLogger('notifications');

export type NotificationPermission = 'granted' | 'denied' | 'undetermined' | 'unavailable';

function fromStatus(status: Notifications.NotificationPermissionsStatus): NotificationPermission {
  if (status.granted) return 'granted';
  return status.canAskAgain ? 'undetermined' : 'denied';
}

/** Current permission without prompting. */
export async function getNotificationPermission(): Promise<NotificationPermission> {
  if (Platform.OS === 'web') return 'unavailable';
  try {
    return fromStatus(await Notifications.getPermissionsAsync());
  } catch (error) {
    log.warn('Permission check failed', error instanceof Error ? error.message : error);
    return 'unavailable';
  }
}

/**
 * Shows the system prompt. Always preceded by the in-app explanation screen, so the user
 * knows what the reminders are for before the OS asks.
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (Platform.OS === 'web') return 'unavailable';
  try {
    return fromStatus(
      await Notifications.requestPermissionsAsync({
        ios: { allowAlert: true, allowBadge: true, allowSound: true },
      }),
    );
  } catch (error) {
    log.warn('Permission request failed', error instanceof Error ? error.message : error);
    return 'unavailable';
  }
}
