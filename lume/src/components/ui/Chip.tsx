import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme';

import { Icon, type IconName } from './Icon';
import { Pressable } from './Pressable';
import { Text } from './Text';

export type ChipSize = 'md' | 'lg';
/** `lg` only: icon above the texts (grid cards) or beside them (full-width rows). */
export type ChipLayout = 'column' | 'row';

export interface ChipProps {
  label: string;
  /** Second line under the label, `lg` size only. */
  description?: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: IconName;
  disabled?: boolean;
  /** `md` is an inline pill-like row; `lg` is the tall card used for onboarding answers. */
  size?: ChipSize;
  layout?: ChipLayout;
  /** Single-choice groups announce their chips as radio buttons. */
  role?: 'checkbox' | 'radio';
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
}

const BADGE = 22;
const COMPACT_HEIGHT = 60;

/**
 * Selectable chip. Selected state uses the soft accent fill with a hairline accent border, so
 * it reads in both colour schemes without relying on colour alone (the check badge confirms it).
 */
export function Chip({
  label,
  description,
  selected = false,
  onPress,
  icon,
  disabled = false,
  size = 'md',
  layout = 'column',
  role = 'checkbox',
  accessibilityHint,
  style,
}: ChipProps) {
  const theme = useTheme();
  const { colors, radii } = theme;
  const borderColor = selected ? colors.accent.base : colors.line;
  const iconColor = selected ? colors.accent.text : colors.textSecondary;
  const large = size === 'lg';
  const row = large && layout === 'row';
  // A label-only card keeps a lower profile, so grids of short answers stay dense.
  const compact = large && !row && !icon && !description;

  const badge = (
    <View style={[styles.badge, { backgroundColor: colors.accent.strong }]}>
      <Icon name="check" size={16} color={colors.textOnAccent} />
    </View>
  );

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || !onPress}
      haptic="selection"
      accessibilityRole={role}
      accessibilityState={{ checked: selected, disabled }}
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      style={[
        row ? styles.largeRow : large ? styles.large : styles.medium,
        compact ? styles.largeCompact : null,
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
      {large ? (
        <View
          style={[
            styles.largeTexts,
            row ? styles.largeTextsRow : styles.largeTextsColumn,
            compact ? styles.largeTextsCompact : null,
          ]}
        >
          <Text variant="label" numberOfLines={2}>
            {label}
          </Text>
          {description ? (
            <Text variant="caption" color="secondary" numberOfLines={2}>
              {description}
            </Text>
          ) : null}
        </View>
      ) : (
        <Text variant="label" numberOfLines={1} style={styles.mediumLabel}>
          {label}
        </Text>
      )}
      {selected && large ? (
        row ? (
          badge
        ) : (
          <View
            style={[styles.badgeCorner, { top: compact ? (COMPACT_HEIGHT - BADGE) / 2 - 1 : 12 }]}
          >
            {badge}
          </View>
        )
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
  largeCompact: {
    minHeight: COMPACT_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  largeRow: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
    gap: 14,
  },
  largeTexts: {
    gap: 2,
  },
  largeTextsColumn: {
    alignSelf: 'stretch',
    paddingRight: 24,
  },
  largeTextsCompact: {
    paddingRight: 20,
  },
  largeTextsRow: {
    flex: 1,
  },
  badge: {
    width: BADGE,
    height: BADGE,
    borderRadius: BADGE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeCorner: {
    position: 'absolute',
    right: 12,
  },
});
