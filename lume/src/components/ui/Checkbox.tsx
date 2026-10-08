import { Pressable, StyleSheet, View } from 'react-native';

import { useHaptics } from '@/hooks/useHaptics';
import { useTheme } from '@/theme';

import { Icon } from './Icon';
import { Text } from './Text';

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
}

/** Explicit opt-in control: a square box next to a full sentence, never pre-checked. */
export function Checkbox({ checked, onChange, label, disabled = false }: CheckboxProps) {
  const theme = useTheme();
  const { colors, radii } = theme;
  const haptic = useHaptics();

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      accessibilityLabel={label}
      disabled={disabled}
      onPress={() => {
        haptic('selection');
        onChange(!checked);
      }}
      style={({ pressed }) => [styles.row, { opacity: pressed ? theme.motion.pressOpacity : 1 }]}
    >
      <View
        style={[
          styles.box,
          {
            borderRadius: radii.xs,
            backgroundColor: checked ? colors.accent.strong : colors.surface,
            borderColor: checked ? colors.accent.strong : colors.lineStrong,
          },
        ]}
      >
        {checked ? <Icon name="check" size={16} color={colors.textOnAccent} /> : null}
      </View>
      <Text variant="bodySmall" style={styles.label}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    minHeight: 44,
  },
  box: {
    width: 24,
    height: 24,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  label: {
    flex: 1,
  },
});
