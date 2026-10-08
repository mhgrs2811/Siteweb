import { z } from 'zod';

/**
 * Public runtime configuration, validated once at start-up.
 *
 * Expo inlines `process.env.EXPO_PUBLIC_*` only when each variable is referenced as a static
 * member expression, which is why every key is spelled out below instead of being read in a loop.
 * Empty strings (an unfilled .env line) are treated as "not set".
 */
const optionalString = z.preprocess(
  (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
  z.string().min(1).optional(),
);

const optionalUrl = z.preprocess(
  (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
  z.url().optional(),
);

const flag = z.preprocess(
  (value) =>
    typeof value === 'string' ? ['1', 'true', 'yes'].includes(value.toLowerCase()) : false,
  z.boolean(),
);

const schema = z.object({
  supabaseUrl: optionalUrl,
  supabaseAnonKey: optionalString,
  posthogKey: optionalString,
  posthogHost: optionalUrl,
  revenueCatIosKey: optionalString,
  revenueCatAndroidKey: optionalString,
  enableDevScreens: flag,
});

export type Env = z.infer<typeof schema>;

const parsed = schema.safeParse({
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  posthogKey: process.env.EXPO_PUBLIC_POSTHOG_KEY,
  posthogHost: process.env.EXPO_PUBLIC_POSTHOG_HOST,
  revenueCatIosKey: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY,
  revenueCatAndroidKey: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY,
  enableDevScreens: process.env.EXPO_PUBLIC_ENABLE_DEV_SCREENS,
});

if (!parsed.success) {
  // A malformed value is a configuration bug: fail loudly during development.
  throw new Error(`Invalid EXPO_PUBLIC_* configuration: ${parsed.error.message}`);
}

export const env: Env = parsed.data;

/** Developer-only routes (such as /dev/design-system) are reachable in dev builds or when flagged. */
export const devScreensEnabled: boolean = __DEV__ || env.enableDevScreens;
