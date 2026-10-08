import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useHaptics } from '@/hooks/useHaptics';
import { useTheme } from '@/theme';

import { Divider } from './Divider';
import { Icon, type IconName } from './Icon';
import { Text } from './Text';

export interface ListRowProps {
  title: string;
  subtitle?: string;
  /** Leading icon drawn in a soft circle, or any custom node. */
  leadingIcon?: IconName;
  leading?: ReactNode;
  /** `chevron` draws the caret; otherwise pass a node (a badge, a value) or nothing. */
  trailing?: ReactNode | 'chevron';
  onPress?: () => void;
  showDivider?: boolean;
  accessibilityHint?: string;
}

export function ListRow({
  title,
  subtitle,
  leadingIcon,
  leading,
  trailing,
  onPress,
  showDivider = false,
  accessibilityHint,
}: ListRowProps) {
  const theme = useTheme();
  const { colors } = theme;
  const haptic = useHaptics();

  return (
    <View>
      <Pressable
        disabled={!onPress}
        onPress={() => {
          haptic('selection');
          onPress?.();
        }}
        accessibilityRole={onPress ? 'button' : undefined}
        accessibilityLabel={subtitle ? `${title}, ${subtitle}` : title}
        accessibilityHint={accessibilityHint}
        style={({ pressed }) => [styles.row, { opacity: pressed ? theme.motion.pressOpacity : 1 }]}
      >
        {leadingIcon ? (
          <View style={[styles.leadingCircle, { backgroundColor: colors.accent.soft }]}>
            <Icon name={leadingIcon} size={20} color={colors.accent.text} />
          </View>
        ) : (
          leading
        )}
        <View style={styles.texts}>
          <Text variant="label" numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text variant="caption" color="secondary" numberOfLines={2}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        {trailing === 'chevron' ? (
          <Icon name="caretRight" size={20} color={colors.textSecondary} />
        ) : (
          trailing
        )}
      </Pressable>
      {showDivider ? <Divider /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    paddingVertical: 10,
    gap: 12,
  },
  leadingCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: {
    flex: 1,
    gap: 2,
  },
});
