import {
  Canvas,
  Circle,
  DashPathEffect,
  LinearGradient,
  Path,
  Shadow,
  Skia,
  vec,
} from '@shopify/react-native-skia';
import { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Easing,
  useDerivedValue,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { Text } from '@/components/ui/Text';
import { hexToRgb, useTheme } from '@/theme';

export interface ProofChartProps {
  width: number;
  height?: number;
  /** Labels under the left and right ends of the curve. */
  startLabel: string;
  endLabel: string;
}

/**
 * Illustrative progression curve for the "proof" step: a soft S-curve that draws itself,
 * a tinted area beneath, no numbers anywhere. It shows the shape of progress, never a promise.
 */
export function ProofChart({ width, height = 200, startLabel, endLabel }: ProofChartProps) {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(0);

  const padding = { left: 8, right: 8, top: 24, bottom: 20 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const { line, area, endPoint } = useMemo(() => {
    const x = (ratio: number) => padding.left + innerWidth * ratio;
    const y = (ratio: number) => padding.top + innerHeight * (1 - ratio);
    const curve = Skia.Path.Make();
    curve.moveTo(x(0), y(0.18));
    curve.cubicTo(x(0.3), y(0.2), x(0.42), y(0.5), x(0.6), y(0.62));
    curve.cubicTo(x(0.78), y(0.74), x(0.9), y(0.84), x(1), y(0.88));

    const fill = curve.copy();
    fill.lineTo(x(1), y(0));
    fill.lineTo(x(0), y(0));
    fill.close();

    return { line: curve, area: fill, endPoint: { x: x(1), y: y(0.88) } };
  }, [innerHeight, innerWidth, padding.left, padding.top]);

  useEffect(() => {
    progress.set(0);
    progress.set(
      reduceMotion
        ? 1
        : withDelay(200, withTiming(1, { duration: 1400, easing: Easing.out(Easing.cubic) })),
    );
  }, [progress, reduceMotion]);

  const areaOpacity = useDerivedValue(() => progress.value);
  const dotOpacity = useDerivedValue(() => (progress.value > 0.98 ? 1 : 0));

  const accent = hexToRgb(theme.colors.accent.base);
  const accentTint = `rgba(${accent.r}, ${accent.g}, ${accent.b}, ${theme.isDark ? 0.28 : 0.18})`;
  const accentClear = `rgba(${accent.r}, ${accent.g}, ${accent.b}, 0)`;
  const glow = `rgba(${accent.r}, ${accent.g}, ${accent.b}, 0.35)`;

  const baseline = useMemo(() => {
    const path = Skia.Path.Make();
    path.moveTo(padding.left, height - padding.bottom);
    path.lineTo(width - padding.right, height - padding.bottom);
    return path;
  }, [height, padding.bottom, padding.left, padding.right, width]);

  return (
    <View style={{ gap: 8 }}>
      <Canvas style={{ width, height }}>
        <Path path={baseline} style="stroke" strokeWidth={1} color={theme.colors.line}>
          <DashPathEffect intervals={[3, 5]} />
        </Path>
        <Path path={area} opacity={areaOpacity}>
          <LinearGradient
            start={vec(0, padding.top)}
            end={vec(0, height - padding.bottom)}
            colors={[accentTint, accentClear]}
          />
        </Path>
        <Path
          path={line}
          style="stroke"
          strokeWidth={2.5}
          strokeCap="round"
          color={theme.colors.accent.base}
          start={0}
          end={progress}
        />
        <Circle
          cx={endPoint.x}
          cy={endPoint.y}
          r={5}
          color={theme.colors.accent.base}
          opacity={dotOpacity}
        >
          <Shadow dx={0} dy={0} blur={6} color={glow} />
        </Circle>
      </Canvas>
      <View style={styles.axis}>
        <Text variant="caption" color="secondary">
          {startLabel}
        </Text>
        <Text variant="caption" color="secondary">
          {endLabel}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  axis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
});
