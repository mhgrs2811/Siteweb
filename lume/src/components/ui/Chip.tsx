import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme';

import { Icon, type IconName } from './Icon';
import { Pressable } from './Pressable';
import { Text } from './Text';

export type ChipSize = 'md' | 'lg';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: IconName;
  disabled?: boolean;
  /** `md` is an inline pill-like row; `lg` is the tall card used for onboarding answers. */
  size?: ChipSize;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Selectable chip. Selected state uses the soft accent fill with a hairline accent border, so
 * it reads in both colour schemes without relying on colour alone (the check badge confirms it).
 */
export function Chip({
  label,
  selected = false,
  onPress,
  icon,
  disabled = false,
  size = 'md',
  accessibilityHint,
  style,
}: ChipProps) {
  const theme = useTheme();
  const { colors, radii } = theme;
  const borderColor = selected ? colors.accent.base : colors.line;
  const iconColor = selected ? colors.accent.text : colors.textSecondary;
  const large = size === 'lg';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || !onPress}
      haptic="selection"
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected, disabled }}
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      style={[
        large ? styles.large : styles.medium,
        {
          backgroundColor: selected ? colors.accent.soft : colors.surface,
          borderColor,
          borderWidth: 1,
          borderRadius: large ? radii.lg : radii.md,
          opacity: disabled ? 0.5 : 1,
        },
        !selected && !theme.isDark ? theme.shadows.soft : null,
        style,
      ]}
    >
      {icon ? <Icon name={icon} size={large ? 24 : 20} color={iconColor} /> : null}
      <Text variant="label" numberOfLines={large ? 2 : 1} style={large ? null : styles.mediumLabel}>
        {label}
      </Text>
      {selected && large ? (
        <View style={[styles.badge, { backgroundColor: colors.accent.strong }]}>
          <Icon name="check" size={16} color={colors.textOnAccent} />
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  medium: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: 16,
    gap: 10,
  },
  mediumLabel: {
    flexShrink: 1,
  },
  large: {
    minHeight: 96,
    padding: 18,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 14,
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
