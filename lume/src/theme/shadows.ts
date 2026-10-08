import type { ViewStyle } from 'react-native';

import type { ColorScheme } from './colors';

export interface Shadows {
  /** Resting cards. Barely there. */
  soft: ViewStyle;
  /** Overlay cards and sheets. */
  lifted: ViewStyle;
}

/**
 * Two levels only, very diffuse, tinted with warm ink rather than grey.
 * `boxShadow` is supported natively since React Native 0.76 (New Architecture) and on web.
 */
export function makeShadows(scheme: ColorScheme): Shadows {
  if (scheme === 'dark') {
    return {
      soft: { boxShadow: '0 6px 18px rgba(0, 0, 0, 0.30)' },
      lifted: { boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)' },
    };
  }
  return {
    soft: { boxShadow: '0 6px 18px rgba(28, 26, 23, 0.07)' },
    lifted: { boxShadow: '0 16px 40px rgba(28, 26, 23, 0.10)' },
  };
}
