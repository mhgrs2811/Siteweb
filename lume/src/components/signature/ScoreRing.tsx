import { Canvas, Group, Path, Shadow, Skia } from '@shopify/react-native-skia';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import {
  useAnimatedReaction,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { Text } from '@/components/ui/Text';
import { useHaptics } from '@/hooks/useHaptics';
import { hexToRgb, useTheme } from '@/theme';

export interface ScoreRingProps {
  /** Skin score from 0 to 100. */
  score: number;
  /** Outer diameter in points. */
  size?: number;
  strokeWidth?: number;
  /** Change this value to replay the fill animation with the same score. */
  replayKey?: number;
  /** Show the "out of 100" caption under the number. */
  showCaption?: boolean;
  /** Draw the fine watch-dial ticks inside the ring. Defaults to on from 120 pt upward. */
  dial?: boolean;
  /** Fire the success haptic when the ring settles. */
  hapticOnSettle?: boolean;
  onSettled?: () => void;
}

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

const TICKS = 60;

/**
 * Signature component: a Skia ring that fills with a gentle spring while the numeral counts up
 * in sync, driven by the same shared value. A faint dial of sixty ticks sits inside the ring,
 * a nod to watch faces; the arc carries a soft terracotta glow. The number never overshoots
 * the target even when the spring does.
 */
export function ScoreRing({
  score,
  size = 160,
  strokeWidth = 10,
  replayKey = 0,
  showCaption = true,
  dial,
  hapticOnSettle = true,
  onSettled,
}: ScoreRingProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const haptic = useHaptics();
  const reduceMotion = useReducedMotion();
  const target = clampScore(score);
  const progress = useSharedValue(0);
  const [displayed, setDisplayed] = useState(0);
  const showDial = dial ?? size >= 120;

  const center = size / 2;
  const ringRadius = (size - strokeWidth) / 2;

  const ring = useMemo(() => {
    const circle = Skia.Path.Make();
    circle.addCircle(center, center, ringRadius);
    return circle;
  }, [center, ringRadius]);

  const { minorTicks, majorTicks } = useMemo(() => {
    const minor = Skia.Path.Make();
    const major = Skia.Path.Make();
    const outer = ringRadius - strokeWidth / 2 - 6;
    for (let index = 0; index < TICKS; index += 1) {
      const angle = (index / TICKS) * Math.PI * 2;
      const isMajor = index % 5 === 0;
      const length = isMajor ? 6 : 3;
      const path = isMajor ? major : minor;
      path.moveTo(center + Math.cos(angle) * outer, center + Math.sin(angle) * outer);
      path.lineTo(
        center + Math.cos(angle) * (outer - length),
        center + Math.sin(angle) * (outer - length),
      );
    }
    return { minorTicks: minor, majorTicks: major };
  }, [center, ringRadius, strokeWidth]);

  useEffect(() => {
    const settle = () => {
      if (hapticOnSettle) haptic('success');
      onSettled?.();
    };
    progress.set(0);
    if (reduceMotion) {
      progress.set(
        withTiming(target / 100, { duration: 0 }, (finished) => {
          'worklet';
          if (finished) scheduleOnRN(settle);
        }),
      );
      return;
    }
    progress.set(
      withSpring(target / 100, theme.motion.springs.gentle, (finished) => {
        'worklet';
        if (finished) scheduleOnRN(settle);
      }),
    );
  }, [
    haptic,
    hapticOnSettle,
    onSettled,
    progress,
    reduceMotion,
    replayKey,
    target,
    theme.motion.springs.gentle,
  ]);

  useAnimatedReaction(
    () => Math.min(target, Math.round(progress.value * 100)),
    (current, previous) => {
      if (current !== previous) scheduleOnRN(setDisplayed, current);
    },
    [target],
  );

  const numeralSize = Math.round(size * (showDial ? 0.3 : 0.34));
  const captionVisible = showCaption && size >= 120;
  const glow = hexToRgb(theme.colors.accent.base);
  const glowColor = `rgba(${glow.r}, ${glow.g}, ${glow.b}, ${theme.isDark ? 0.45 : 0.32})`;

  return (
    <View
      accessible
      accessibilityLabel={t('a11y.scoreRing', { score: target })}
      accessibilityValue={{ min: 0, max: 100, now: target }}
      style={{ width: size, height: size }}
    >
      <Canvas style={{ width: size, height: size }}>
        {showDial ? (
          <Group>
            <Path path={minorTicks} style="stroke" strokeWidth={1} color={theme.colors.line} />
            <Path
              path={majorTicks}
              style="stroke"
              strokeWidth={1}
              color={theme.colors.lineStrong}
              opacity={0.8}
            />
          </Group>
        ) : null}
        <Group origin={{ x: center, y: center }} transform={[{ rotate: -Math.PI / 2 }]}>
          <Path path={ring} style="stroke" strokeWidth={strokeWidth} color={theme.colors.line} />
          <Path
            path={ring}
            style="stroke"
            strokeWidth={strokeWidth}
            strokeCap="round"
            color={theme.colors.accent.base}
            start={0}
            end={progress}
          >
            <Shadow dx={0} dy={0} blur={strokeWidth * 0.9} color={glowColor} />
          </Path>
        </Group>
      </Canvas>
      <View style={[StyleSheet.absoluteFill, styles.center]} pointerEvents="none">
        <Text
          variant="score"
          style={{ fontSize: numeralSize, lineHeight: Math.round(numeralSize * 1.1) }}
        >
          {displayed}
        </Text>
        {captionVisible ? (
          <Text variant="caption" color="secondary">
            {t('common.outOf100')}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
