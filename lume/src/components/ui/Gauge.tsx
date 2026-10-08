import { useEffect, useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { useTheme } from '@/theme';

import { Text } from './Text';

export interface GaugeProps {
  label: string;
  /** From 0 to 100. */
  value: number;
  tone?: 'accent' | 'success' | 'warning';
}

/** Compact indicator row: label, value and a hairline bar that springs to its value. */
export function Gauge({ label, value, tone = 'accent' }: GaugeProps) {
  const theme = useTheme();
  const { colors } = theme;
  const [width, setWidth] = useState(0);
  const fill = useSharedValue(0);
  const clamped = Math.max(0, Math.min(100, Math.round(value)));

  useEffect(() => {
    fill.set(withSpring((clamped / 100) * width, theme.motion.springs.gentle));
  }, [clamped, fill, theme.motion.springs.gentle, width]);

  const fillStyle = useAnimatedStyle(() => ({ width: fill.value }));

  const fillColor = {
    accent: colors.accent.base,
    success: colors.success.base,
    warning: colors.warning.base,
  }[tone];

  return (
    <View
      accessible
      accessibilityLabel={`${label}, ${clamped}`}
      accessibilityValue={{ min: 0, max: 100, now: clamped }}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text variant="captionMedium" numberOfLines={1} style={styles.label}>
          {label}
        </Text>
        <Text variant="captionMedium" color="secondary" style={styles.value}>
          {clamped}
        </Text>
      </View>
      <View
        onLayout={(event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width)}
        style={[styles.track, { backgroundColor: colors.line }]}
      >
        <Animated.View style={[styles.fill, { backgroundColor: fillColor }, fillStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 8,
  },
  label: {
    flexShrink: 1,
  },
  value: {
    fontVariant: ['tabular-nums'],
  },
  track: {
    height: 3,
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  fill: {
    height: 3,
    borderRadius: 1.5,
  },
});
