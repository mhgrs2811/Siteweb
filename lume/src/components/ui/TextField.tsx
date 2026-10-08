import { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '@/theme';

import { Text } from './Text';

export interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  helper?: string;
  /** When set, the field is in its error state and this text replaces the helper. */
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

/**
 * Single-line input with a small label above the value. Error state uses amber, never red,
 * in line with the "never alarming" tone of the product.
 */
export function TextField({
  label,
  helper,
  error,
  containerStyle,
  onFocus,
  onBlur,
  editable = true,
  ...rest
}: TextFieldProps) {
  const theme = useTheme();
  const { colors } = theme;
  const [focused, setFocused] = useState(false);

  const borderColor = error ? colors.warning.text : focused ? colors.accent.strong : colors.line;
  const borderWidth = error || focused ? 1.5 : 1;

  return (
    <View style={containerStyle}>
      <View
        style={[
          styles.field,
          {
            borderColor,
            borderWidth,
            borderRadius: theme.radii.md,
            backgroundColor: colors.surface,
            opacity: editable ? 1 : 0.6,
          },
        ]}
      >
        <Text variant="caption" color={error ? 'warning' : 'secondary'}>
          {label}
        </Text>
        <TextInput
          {...rest}
          editable={editable}
          accessibilityLabel={rest.accessibilityLabel ?? label}
          placeholderTextColor={colors.textSecondary}
          selectionColor={colors.accent.base}
          cursorColor={colors.accent.strong}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          style={[theme.typography.body, styles.input, { color: colors.ink }]}
        />
      </View>
      {error || helper ? (
        <Text variant="caption" color={error ? 'warning' : 'secondary'} style={styles.helper}>
          {error ?? helper}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    gap: 2,
  },
  input: {
    padding: 0,
    margin: 0,
    minHeight: 24,
  },
  helper: {
    marginTop: 6,
    marginHorizontal: 4,
  },
});
