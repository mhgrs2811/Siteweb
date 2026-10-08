import type { ViewStyle } from 'react-native';

import type { ColorScheme } from './colors';

export interface Shadows {
  /** Resting cards: a breath of depth, never a grey halo. */
  soft: ViewStyle;
  /** Overlay cards and sheets. */
  lifted: ViewStyle;
  /** Primary buttons: a warm, tinted glow that makes the terracotta feel lit from within. */
  accent: ViewStyle;
}

/**
 * Shadows are warm (tinted with ink, not black) and very diffuse. `boxShadow` is supported
 * natively since React Native 0.76 (New Architecture) and on web.
 */
export function makeShadows(scheme: ColorScheme): Shadows {
  if (scheme === 'dark') {
    return {
      soft: { boxShadow: '0 10px 28px rgba(0, 0, 0, 0.34)' },
      lifted: { boxShadow: '0 22px 56px rgba(0, 0, 0, 0.55)' },
      accent: { boxShadow: '0 12px 28px rgba(201, 126, 96, 0.22)' },
    };
  }
  return {
    soft: { boxShadow: '0 10px 28px rgba(60, 44, 32, 0.07)' },
    lifted: { boxShadow: '0 22px 56px rgba(60, 44, 32, 0.12)' },
    accent: { boxShadow: '0 12px 28px rgba(158, 85, 56, 0.26)' },
  };
}
