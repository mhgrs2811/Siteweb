import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { useHaptics } from '@/hooks/useHaptics';
import { useTheme } from '@/theme';

import { Text } from './Text';

export interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}

const TRACK_WIDTH = 50;
const TRACK_HEIGHT = 30;
const KNOB = 24;
const INSET = 3;

/** Switch row. The knob springs, the track tints from sunken surface to strong accent. */
export function Toggle({
  value,
  onValueChange,
  label,
  description,
  disabled = false,
}: ToggleProps) {
  const theme = useTheme();
  const { colors } = theme;
  const haptic = useHaptics();
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.set(withSpring(value ? 1 : 0, theme.motion.springs.snappy));
  }, [progress, theme.motion.springs.snappy, value]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [colors.lineStrong, colors.accent.strong],
    ),
  }));

  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: INSET + progress.value * (TRACK_WIDTH - KNOB - INSET * 2) }],
  }));

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      accessibilityLabel={label}
      accessibilityHint={description}
      disabled={disabled}
      onPress={() => {
        haptic('selection');
        onValueChange(!value);
      }}
      style={[styles.row, { opacity: disabled ? 0.5 : 1 }]}
    >
      <View style={styles.texts}>
        <Text variant="label">{label}</Text>
        {description ? (
          <Text variant="caption" color="secondary">
            {description}
          </Text>
        ) : null}
      </View>
      <Animated.View style={[styles.track, trackStyle]}>
        <Animated.View style={[styles.knob, { backgroundColor: colors.surface }, knobStyle]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
    gap: 16,
  },
  texts: {
    flex: 1,
    gap: 2,
  },
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    justifyContent: 'center',
  },
  knob: {
    width: KNOB,
    height: KNOB,
    borderRadius: KNOB / 2,
    boxShadow: '0 1px 3px rgba(28, 26, 23, 0.18)',
  },
});
