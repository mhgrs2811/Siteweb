import type { PropsWithChildren, ReactNode } from 'react';
import {
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme';

export interface ScreenProps extends PropsWithChildren {
  /** Scrollable content (default) or a fixed layout for screens with a pinned footer. */
  scroll?: boolean;
  /** Apply the horizontal gutter. Turn off for edge-to-edge content. */
  padded?: boolean;
  background?: 'background' | 'surface';
  /** Pinned under the content, above the bottom safe area (primary actions). */
  footer?: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  testID?: string;
}

/** Hook exposing the responsive gutter so custom layouts stay aligned with Screen. */
export function useGutter(): number {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  return width >= theme.layout.wideBreakpoint ? theme.layout.gutterWide : theme.layout.gutter;
}

/**
 * Page scaffold: safe areas, responsive gutters, optional scrolling and a pinned footer.
 * Every route renders inside a Screen so spacing is consistent from the first pixel.
 */
export function Screen({
  children,
  scroll = true,
  padded = true,
  background = 'background',
  footer,
  contentContainerStyle,
  testID,
}: ScreenProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const gutter = useGutter();
  const backgroundColor = theme.colors[background];

  const horizontal = padded ? gutter : 0;
  const paddingTop = insets.top + theme.spacing[4];
  const paddingBottom = footer ? theme.spacing[4] : insets.bottom + theme.spacing[6];

  const content = scroll ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[
        { paddingTop, paddingBottom, paddingHorizontal: horizontal },
        contentContainerStyle,
      ]}
      contentInsetAdjustmentBehavior="never"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View
      style={[
        styles.flex,
        { paddingTop, paddingBottom, paddingHorizontal: horizontal },
        contentContainerStyle,
      ]}
    >
      {children}
    </View>
  );

  return (
    <View style={[styles.flex, { backgroundColor }]} testID={testID}>
      {content}
      {footer ? (
        <View
          style={{
            paddingHorizontal: gutter,
            paddingBottom: insets.bottom + theme.spacing[4],
            paddingTop: theme.spacing[2],
            backgroundColor,
          }}
        >
          {footer}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
