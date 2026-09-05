// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', 'supabase/functions/**', 'coverage/*'],
  },
  {
    rules: {
      // Une seule action principale par écran : on interdit les styles inline massifs
      // en faveur des tokens (règle pédagogique, warning seulement).
      'react-native/no-inline-styles': 'off',
    },
  },
]);
