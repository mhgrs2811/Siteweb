import { Ionicons } from '@expo/vector-icons';
import { forwardRef } from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { MIN_TOUCH_TARGET, useTheme } from '@/core/theme';

import { Text } from './Text';

export interface TextFieldProps extends TextInputProps {
  label: string;
  hint?: string | undefined;
  error?: string | null | undefined;
  onClear?: (() => void) | undefined;
  clearLabel?: string | undefined;
}

/** Champ de saisie : libellé visible (jamais seulement un placeholder), erreur annoncée, gros texte. */
export const TextField = forwardRef<TextInput, TextFieldProps>(function TextField(
  { label, hint, error, onClear, clearLabel, value, style, ...rest },
  ref,
) {
  const { colors, radius, spacing, typography } = useTheme();
  const hasError = Boolean(error);
  return (
    <View style={{ gap: spacing.sm }}>
      <Text variant="bodyStrong" nativeID={`${label}-label`}>
        {label}
      </Text>
      <View
        style={[
          styles.inputWrap,
          {
            borderColor: hasError ? colors.risk.high.accent : colors.border,
            backgroundColor: colors.surface,
            borderRadius: radius.md,
          },
        ]}
      >
        <TextInput
          ref={ref}
          value={value}
          accessibilityLabel={label}
          accessibilityLabelledBy={`${label}-label`}
          accessibilityHint={hint}
          placeholderTextColor={colors.textMuted}
          style={[
            styles.input,
            typography.body,
            { color: colors.text, paddingHorizontal: spacing.lg, minHeight: 60 },
            style,
          ]}
          {...rest}
        />
        {onClear && value ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={clearLabel ?? 'Effacer'}
            onPress={onClear}
            style={styles.clear}
            hitSlop={8}
          >
            <Ionicons name="close-circle" size={28} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>
      {hasError ? (
        <Text variant="caption" style={{ color: colors.risk.high.fg }} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : hint ? (
        <Text variant="caption" color="textMuted">
          {hint}
        </Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  inputWrap: { flexDirection: 'row', alignItems: 'center', borderWidth: 2 },
  input: { flex: 1 },
  clear: { width: MIN_TOUCH_TARGET, height: MIN_TOUCH_TARGET, alignItems: 'center', justifyContent: 'center' },
});
