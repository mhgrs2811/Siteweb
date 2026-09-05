import type { ConfigContext, ExpoConfig } from 'expo/config';

/**
 * Configuration Expo dynamique.
 * Les valeurs sensibles ne sont JAMAIS écrites ici : elles proviennent des
 * variables d'environnement EXPO_PUBLIC_* (voir .env.example).
 */
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'SafeCheck',
  slug: 'safecheck',
  version: '0.1.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'safecheck',
  userInterfaceStyle: 'automatic',
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'app.safecheck.mobile',
    infoPlist: {
      // Pas de suivi publicitaire : privacy by design.
      NSUserTrackingUsageDescription: undefined,
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    package: 'app.safecheck.mobile',
    adaptiveIcon: {
      backgroundColor: '#EEF4FA',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-secure-store',
    'expo-localization',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#1F4E79',
        image: './assets/images/splash-icon.png',
        imageWidth: 120,
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    eas: { projectId: process.env.EAS_PROJECT_ID },
  },
});
