import { type PropsWithChildren } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/core/theme';

interface ScreenProps {
  scroll?: boolean;
  padded?: boolean;
  contentStyle?: ViewStyle;
  /** Élément fixé en bas (action principale). */
  footer?: React.ReactNode;
}

/** Conteneur d'écran : fond thémé, marges sûres, clavier géré, une action principale possible en pied. */
export function Screen({ children, scroll = true, padded = true, contentStyle, footer }: PropsWithChildren<ScreenProps>) {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const padding = padded ? spacing.lg : 0;

  const body = scroll ? (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[{ padding, paddingBottom: spacing.xxl, gap: spacing.lg }, contentStyle]}
      contentInsetAdjustmentBehavior="automatic"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, { padding, gap: spacing.lg }, contentStyle]}>{children}</View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {body}
      {footer ? (
        <View
          style={{
            padding: spacing.lg,
            paddingBottom: Math.max(insets.bottom, spacing.lg),
            backgroundColor: colors.background,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: colors.border,
          }}
        >
          {footer}
        </View>
      ) : null}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 } });
