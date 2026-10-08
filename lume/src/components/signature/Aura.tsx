import {
  Blur,
  Canvas,
  Circle,
  FractalNoise,
  LinearGradient,
  Rect,
  vec,
} from '@shopify/react-native-skia';
import { useEffect } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import {
  cancelAnimation,
  Easing,
  useDerivedValue,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { hexToRgb, useTheme } from '@/theme';

export interface AuraProps {
  width: number;
  height: number;
  /** Melt the bottom edge into the page background. */
  fade?: boolean;
  /** Slow breathing drift of the discs; off when the system reduces motion. */
  animated?: boolean;
  /** Grain strength, 0 to 1. */
  grain?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Signature brand visual: three blurred discs of warm light (champagne, terracotta, sage)
 * breathing slowly on the page background, under a fine paper grain. Drawn in Skia, so it
 * costs no image asset and adapts to both colour schemes.
 */
export function Aura({ width, height, fade = true, animated = true, grain = 1, style }: AuraProps) {
  const theme = useTheme();
  const { aura, background } = theme.colors;
  const reduceMotion = useReducedMotion();
  const drift = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion || !animated) {
      drift.set(0);
      return;
    }
    drift.set(
      withRepeat(withTiming(1, { duration: 14000, easing: Easing.inOut(Easing.sin) }), -1, true),
    );
    return () => cancelAnimation(drift);
  }, [animated, drift, reduceMotion]);

  const champagneX = useDerivedValue(() => width * 0.74 + drift.value * 16);
  const champagneY = useDerivedValue(() => height * 0.3 - drift.value * 12);
  const terracottaX = useDerivedValue(() => width * 0.2 - drift.value * 14);
  const terracottaY = useDerivedValue(() => height * 0.6 + drift.value * 10);
  const sageX = useDerivedValue(() => width * 0.9 + drift.value * 8);
  const sageY = useDerivedValue(() => height * 0.9 - drift.value * 8);

  const { r, g, b } = hexToRgb(background);
  const transparentBackground = `rgba(${r}, ${g}, ${b}, 0)`;
  const grainOpacity = (theme.isDark ? 0.09 : 0.06) * grain;

  // The web Canvas expects a flat style object, never an array.
  const canvasStyle = StyleSheet.flatten([{ width, height }, style]);

  return (
    <Canvas style={canvasStyle}>
      <Rect x={0} y={0} width={width} height={height} color={background} />
      <Circle cx={champagneX} cy={champagneY} r={width * 0.52} color={aura.champagne}>
        <Blur blur={52} />
      </Circle>
      <Circle cx={terracottaX} cy={terracottaY} r={width * 0.4} color={aura.terracotta}>
        <Blur blur={58} />
      </Circle>
      <Circle cx={sageX} cy={sageY} r={width * 0.3} color={aura.sage}>
        <Blur blur={46} />
      </Circle>
      <Circle
        cx={width * 0.42}
        cy={height * 0.08}
        r={width * 0.34}
        color={aura.highlight}
        opacity={0.75}
      >
        <Blur blur={64} />
      </Circle>
      {grain > 0 ? (
        <Rect
          x={0}
          y={0}
          width={width}
          height={height}
          opacity={grainOpacity}
          blendMode={theme.isDark ? 'screen' : 'multiply'}
        >
          <FractalNoise freqX={0.85} freqY={0.85} octaves={3} seed={11} />
        </Rect>
      ) : null}
      {fade ? (
        <Rect x={0} y={height * 0.45} width={width} height={height * 0.55}>
          <LinearGradient
            start={vec(0, height * 0.45)}
            end={vec(0, height)}
            colors={[transparentBackground, background]}
          />
        </Rect>
      ) : null}
    </Canvas>
  );
}
