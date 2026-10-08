import { useCallback } from 'react';
import {
  Pressable as RNPressable,
  type GestureResponderEvent,
  type PressableProps as RNPressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { useHaptics } from '@/hooks/useHaptics';
import type { HapticIntent } from '@/lib/haptics';
import { useTheme } from '@/theme';

const AnimatedRNPressable = Animated.createAnimatedComponent(RNPressable);

export interface PressableProps extends Omit<RNPressableProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  /** Scale applied while pressed. Defaults to the motion token; pass 1 to disable. */
  pressScale?: number;
  /** Haptic intent fired on press, or null for none. */
  haptic?: HapticIntent | null;
}

/**
 * Base pressable with the house press feedback: a quick spring scale and an optional haptic.
 * Every tappable component builds on it so feedback is identical across the app.
 */
export function Pressable({
  style,
  pressScale,
  haptic = null,
  onPressIn,
  onPressOut,
  onPress,
  disabled,
  ...rest
}: PressableProps) {
  const theme = useTheme();
  const triggerHaptic = useHaptics();
  const scale = useSharedValue(1);
  const targetScale = pressScale ?? theme.motion.pressScale;

  // Shared values are mutated through `.set()` so the React Compiler sees no illegal mutation.
  const handlePressIn = useCallback(
    (event: GestureResponderEvent) => {
      scale.set(withSpring(targetScale, theme.motion.springs.snappy));
      onPressIn?.(event);
    },
    [onPressIn, scale, targetScale, theme.motion.springs.snappy],
  );

  const handlePressOut = useCallback(
    (event: GestureResponderEvent) => {
      scale.set(withSpring(1, theme.motion.springs.snappy));
      onPressOut?.(event);
    },
    [onPressOut, scale, theme.motion.springs.snappy],
  );

  const handlePress = useCallback(
    (event: GestureResponderEvent) => {
      if (haptic) triggerHaptic(haptic);
      onPress?.(event);
    },
    [haptic, onPress, triggerHaptic],
  );

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedRNPressable
      {...rest}
      disabled={disabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={[style, animatedStyle]}
    />
  );
}
