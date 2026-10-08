import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { useHaptics } from '@/hooks/useHaptics';
import { useTheme } from '@/theme';

import { Text } from './Text';

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

export interface SegmentedControlProps<T extends string> {
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  accessibilityLabel?: string;
}

const PADDING = 3;
const HEIGHT = 42;

/** Two to four mutually exclusive options; the indicator slides with a snappy spring. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  accessibilityLabel,
}: SegmentedControlProps<T>) {
  const theme = useTheme();
  const { colors, radii } = theme;
  const haptic = useHaptics();
  const [width, setWidth] = useState(0);
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const position = useSharedValue(selectedIndex);

  useEffect(() => {
    position.set(withSpring(selectedIndex, theme.motion.springs.snappy));
  }, [position, selectedIndex, theme.motion.springs.snappy]);

  const segmentWidth = options.length > 0 ? (width - PADDING * 2) / options.length : 0;

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: PADDING + position.value * segmentWidth }],
  }));

  const onLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  };

  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel}
      onLayout={onLayout}
      style={[
        styles.container,
        { backgroundColor: colors.surfaceSunken, borderRadius: radii.pill },
      ]}
    >
      {width > 0 ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.indicator,
            {
              width: segmentWidth,
              backgroundColor: theme.isDark ? colors.surfaceElevated : colors.surface,
              borderRadius: radii.pill,
            },
            theme.shadows.soft,
            indicatorStyle,
          ]}
        />
      ) : null}
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityState={{ selected, checked: selected }}
            accessibilityLabel={option.label}
            onPress={() => {
              if (selected) return;
              haptic('selection');
              onChange(option.value);
            }}
            style={styles.segment}
          >
            <Text
              variant={selected ? 'button' : 'label'}
              color={selected ? 'ink' : 'secondary'}
              numberOfLines={1}
              style={styles.segmentLabel}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: HEIGHT,
    padding: PADDING,
    alignSelf: 'stretch',
  },
  indicator: {
    position: 'absolute',
    top: PADDING,
    bottom: PADDING,
    left: 0,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  segmentLabel: {
    fontSize: 14,
    lineHeight: 18,
  },
});
