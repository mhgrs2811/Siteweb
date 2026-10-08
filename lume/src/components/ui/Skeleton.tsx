import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { StyleSheet, View, type DimensionValue, type LayoutChangeEvent } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { useTheme, type RadiusKey } from '@/theme';

export interface SkeletonProps {
  width?: DimensionValue;
  height: number;
  radius?: RadiusKey;
}

/**
 * Placeholder block with a soft travelling highlight. Replaces spinners everywhere content
 * is loading. Static when the system asks to reduce motion.
 */
export function Skeleton({ width = '100%', height, radius = 'md' }: SkeletonProps) {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const [measured, setMeasured] = useState(0);
  const shift = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion || measured === 0) return;
    shift.set(0);
    shift.set(
      withRepeat(withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.ease) }), -1, false),
    );
    return () => cancelAnimation(shift);
  }, [measured, reduceMotion, shift]);

  const bandStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -measured + shift.value * measured * 2 }],
  }));

  const onLayout = (event: LayoutChangeEvent) => setMeasured(event.nativeEvent.layout.width);

  const { base, highlight } = theme.colors.skeleton;

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      onLayout={onLayout}
      style={{
        width,
        height,
        borderRadius: radius === 'pill' ? height / 2 : theme.radii[radius],
        backgroundColor: base,
        overflow: 'hidden',
      }}
    >
      {measured > 0 && !reduceMotion ? (
        <Animated.View style={[StyleSheet.absoluteFill, { width: measured }, bandStyle]}>
          <LinearGradient
            colors={[base, highlight, base]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      ) : null}
    </View>
  );
}
