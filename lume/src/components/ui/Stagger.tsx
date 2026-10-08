import { Children, type PropsWithChildren } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useTheme } from '@/theme';

export interface StaggerProps extends PropsWithChildren {
  /** Delay between two children, defaults to the motion token. */
  stepMs?: number;
  /** Delay before the first child appears. */
  initialDelayMs?: number;
  /** Style applied to the wrapper of each child (for example a gap). */
  itemStyle?: StyleProp<ViewStyle>;
}

/**
 * Wraps each direct child in an entering animation offset by `stepMs`, so lists settle in a
 * soft cascade instead of popping in at once. Honours the system reduce-motion setting.
 */
export function Stagger({ children, stepMs, initialDelayMs = 0, itemStyle }: StaggerProps) {
  const theme = useTheme();
  const step = stepMs ?? theme.motion.staggerMs;
  const { damping, stiffness } = theme.motion.springs.gentle;

  return (
    <>
      {Children.toArray(children).map((child, index) => (
        <Animated.View
          key={index}
          style={itemStyle}
          entering={FadeInDown.delay(initialDelayMs + index * step)
            .springify()
            .damping(damping)
            .stiffness(stiffness)}
        >
          {child}
        </Animated.View>
      ))}
    </>
  );
}
