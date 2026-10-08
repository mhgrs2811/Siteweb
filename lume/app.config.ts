import type { ConfigContext, ExpoConfig } from 'expo/config';

/**
 * Dynamic Expo configuration.
 *
 * The build variant comes from the APP_VARIANT environment variable (set per EAS profile in
 * eas.json, or in a local .env). Each variant gets its own display name and bundle identifier
 * so a development build can live next to a store build on the same device.
 */
type Variant = 'development' | 'preview' | 'production';

const VARIANTS: readonly Variant[] = ['development', 'preview', 'production'];

function readVariant(): Variant {
  const raw = process.env.APP_VARIANT;
  return VARIANTS.find((v) => v === raw) ?? 'development';
}

const variant = readVariant();

/**
 * Provisional identifier, to confirm before the first store submission (it cannot change
 * afterwards). Development and preview builds get a suffix so they never collide with the
 * production app.
 */
const BUNDLE_ID_BASE = 'com.lume.app';

const DISPLAY_NAME: Record<Variant, string> = {
  development: 'Lumé Dev',
  preview: 'Lumé Preview',
  production: 'Lumé',
};

const ID_SUFFIX: Record<Variant, string> = {
  development: '.dev',
  preview: '.preview',
  production: '',
};

const bundleIdentifier = `${BUNDLE_ID_BASE}${ID_SUFFIX[variant]}`;

/** Filled by `eas init` (see README, "Dev build"). Read from .env so nothing is invented here. */
const easProjectId = process.env.EAS_PROJECT_ID?.trim() || undefined;
const owner = process.env.EXPO_OWNER?.trim() || undefined;

const BRAND = {
  ivory: '#F7F3EE',
  night: '#121110',
} as const;

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: DISPLAY_NAME[variant],
  slug: 'lume',
  version: '0.1.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'lume',
  userInterfaceStyle: 'automatic',
  backgroundColor: BRAND.ivory,
  ...(owner ? { owner } : {}),
  ios: {
    bundleIdentifier,
    supportsTablet: false,
    icon: {
      light: './assets/images/icon.png',
      dark: './assets/images/icon-dark.png',
    },
    infoPlist: {
      CFBundleAllowMixedLocalizations: true,
      CFBundleLocalizations: ['fr', 'en'],
      CFBundleDevelopmentRegion: 'fr',
    },
  },
  android: {
    package: bundleIdentifier,
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: BRAND.ivory,
    },
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        backgroundColor: BRAND.ivory,
        image: './assets/images/splash-icon.png',
        imageWidth: 180,
        resizeMode: 'contain',
        dark: {
          backgroundColor: BRAND.night,
          image: './assets/images/splash-icon-dark.png',
        },
      },
    ],
    'expo-localization',
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    variant,
    ...(easProjectId ? { eas: { projectId: easProjectId } } : {}),
  },
});
