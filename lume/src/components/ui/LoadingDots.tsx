import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface DotProps {
  color: string;
  size: number;
  delay: number;
  reduceMotion: boolean;
}

function Dot({ color, size, delay, reduceMotion }: DotProps) {
  const opacity = useSharedValue(reduceMotion ? 0.7 : 0.35);

  useEffect(() => {
    if (reduceMotion) {
      opacity.set(0.7);
      return;
    }
    opacity.set(
      withDelay(
        delay,
        withRepeat(
          withSequence(withTiming(1, { duration: 380 }), withTiming(0.35, { duration: 380 })),
          -1,
          false,
        ),
      ),
    );
    return () => cancelAnimation(opacity);
  }, [delay, opacity, reduceMotion]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[{ width: size, height: size, borderRadius: size / 2, backgroundColor: color }, style]}
    />
  );
}

export interface LoadingDotsProps {
  color: string;
  size?: number;
}

/** Three softly pulsing dots: the only loading indicator allowed inside controls. */
export function LoadingDots({ color, size = 7 }: LoadingDotsProps) {
  const reduceMotion = useReducedMotion();
  return (
    <View
      style={[styles.row, { gap: size }]}
      accessibilityElementsHidden
      importantForAccessibility="no"
    >
      <Dot color={color} size={size} delay={0} reduceMotion={reduceMotion} />
      <Dot color={color} size={size} delay={160} reduceMotion={reduceMotion} />
      <Dot color={color} size={size} delay={320} reduceMotion={reduceMotion} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
});
