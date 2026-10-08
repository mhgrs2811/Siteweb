import { Canvas, Group, Path, Skia } from '@shopify/react-native-skia';
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
import { useTheme } from '@/theme';

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
  /** Fire the success haptic when the ring settles. */
  hapticOnSettle?: boolean;
  onSettled?: () => void;
}

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

/**
 * Signature component: a Skia ring that fills with a gentle spring while the numeral counts up
 * in sync, driven by the same shared value. The number never overshoots the target even when
 * the spring does.
 */
export function ScoreRing({
  score,
  size = 160,
  strokeWidth = 10,
  replayKey = 0,
  showCaption = true,
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

  const path = useMemo(() => {
    const circle = Skia.Path.Make();
    circle.addCircle(size / 2, size / 2, (size - strokeWidth) / 2);
    return circle;
  }, [size, strokeWidth]);

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

  const numeralSize = Math.round(size * 0.34);
  const captionVisible = showCaption && size >= 120;

  return (
    <View
      accessible
      accessibilityLabel={t('a11y.scoreRing', { score: target })}
      accessibilityValue={{ min: 0, max: 100, now: target }}
      style={{ width: size, height: size }}
    >
      <Canvas style={{ width: size, height: size }}>
        <Group origin={{ x: size / 2, y: size / 2 }} transform={[{ rotate: -Math.PI / 2 }]}>
          <Path path={path} style="stroke" strokeWidth={strokeWidth} color={theme.colors.line} />
          <Path
            path={path}
            style="stroke"
            strokeWidth={strokeWidth}
            strokeCap="round"
            color={theme.colors.accent.base}
            start={0}
            end={progress}
          />
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
