import PostHog from 'posthog-react-native';

import { env } from './env';
import { createLogger } from './logger';

const log = createLogger('analytics');

/**
 * Product analytics events (PRD, section 8). Properties never include skin data or free text:
 * only funnel positions, flags and versions.
 */
export type AnalyticsEvent =
  | { name: 'onboarding_started' }
  | { name: 'onboarding_step_completed'; props: { index: number; step: string } }
  | { name: 'photo_consent_given'; props: { version: string; keep_photos: boolean } }
  | { name: 'notifications_opt_in'; props: { granted: boolean } }
  | { name: 'onboarding_completed' };

let client: PostHog | null = null;

/** Creates the PostHog client when a key is configured; otherwise analytics is a silent no-op. */
export function initAnalytics(): void {
  if (client || !env.posthogKey) return;
  client = new PostHog(env.posthogKey, {
    host: env.posthogHost ?? 'https://eu.i.posthog.com',
    captureAppLifecycleEvents: true,
    enableSessionReplay: false,
  });
  log.info('PostHog ready');
}

export function track(event: AnalyticsEvent): void {
  const props = 'props' in event ? event.props : undefined;
  if (!client) {
    log.debug(`event ${event.name}`, props);
    return;
  }
  client.capture(event.name, props);
}

export async function flushAnalytics(): Promise<void> {
  await client?.flush();
}
