import { useEffect, useState } from 'react';
import { View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { useTheme } from '@/theme';

export interface ProgressBarProps {
  /** From 0 to 1. */
  progress: number;
  height?: number;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

/** Thin progress line used at the top of onboarding screens. Fill width springs between steps. */
export function ProgressBar({ progress, height = 2, accessibilityLabel, style }: ProgressBarProps) {
  const theme = useTheme();
  const [width, setWidth] = useState(0);
  const fill = useSharedValue(0);
  const clamped = Math.min(1, Math.max(0, progress));

  useEffect(() => {
    fill.set(withSpring(clamped * width, theme.motion.springs.gentle));
  }, [clamped, fill, theme.motion.springs.gentle, width]);

  const fillStyle = useAnimatedStyle(() => ({ width: fill.value }));

  const onLayout = (event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width);

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
      onLayout={onLayout}
      style={[
        {
          height,
          borderRadius: height / 2,
          backgroundColor: theme.colors.line,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          { height, borderRadius: height / 2, backgroundColor: theme.colors.accent.strong },
          fillStyle,
        ]}
      />
    </View>
  );
}
