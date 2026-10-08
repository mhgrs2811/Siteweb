import { useState } from 'react';
import { Pressable, StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { Text } from '@/components/ui/Text';
import { useHaptics } from '@/hooks/useHaptics';
import { useTheme, type SpringName } from '@/theme';

export interface SpringDemoProps {
  spring: SpringName;
  label: string;
}

const DOT = 24;

/** Tap the track: the dot travels to the other end with the named spring. */
export function SpringDemo({ spring, label }: SpringDemoProps) {
  const theme = useTheme();
  const haptic = useHaptics();
  const [width, setWidth] = useState(0);
  const [atEnd, setAtEnd] = useState(false);
  const x = useSharedValue(0);

  const dotStyle = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  const onLayout = (event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width);

  const run = () => {
    const next = !atEnd;
    setAtEnd(next);
    haptic('selection');
    x.set(withSpring(next ? Math.max(0, width - DOT) : 0, theme.motion.springs[spring]));
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={run}
      style={styles.container}
    >
      <Text variant="captionMedium" color="secondary">
        {label}
      </Text>
      <View
        onLayout={onLayout}
        style={[
          styles.track,
          { backgroundColor: theme.colors.surfaceSunken, borderRadius: theme.radii.pill },
        ]}
      >
        <Animated.View
          style={[
            styles.dot,
            { backgroundColor: theme.colors.accent.base, borderRadius: DOT / 2 },
            dotStyle,
          ]}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  track: {
    height: DOT + 8,
    padding: 4,
    justifyContent: 'center',
  },
  dot: {
    width: DOT,
    height: DOT,
  },
});
