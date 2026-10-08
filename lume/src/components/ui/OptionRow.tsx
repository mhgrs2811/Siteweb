import { Pressable, StyleSheet, View } from 'react-native';

import { useHaptics } from '@/hooks/useHaptics';
import { useTheme } from '@/theme';

import { Divider } from './Divider';
import { Icon } from './Icon';
import { Text } from './Text';

export interface OptionRowProps {
  label: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
  showDivider?: boolean;
}

/** One choice in a list of mutually exclusive options (settings sheets). */
export function OptionRow({ label, description, selected, onPress, showDivider }: OptionRowProps) {
  const theme = useTheme();
  const { colors } = theme;
  const haptic = useHaptics();

  return (
    <View>
      <Pressable
        accessibilityRole="radio"
        accessibilityState={{ selected, checked: selected }}
        accessibilityLabel={label}
        accessibilityHint={description}
        onPress={() => {
          if (!selected) haptic('selection');
          onPress();
        }}
        style={({ pressed }) => [styles.row, { opacity: pressed ? theme.motion.pressOpacity : 1 }]}
      >
        <View style={styles.texts}>
          <Text variant="label">{label}</Text>
          {description ? (
            <Text variant="caption" color="secondary">
              {description}
            </Text>
          ) : null}
        </View>
        <View
          style={[
            styles.mark,
            selected
              ? { backgroundColor: colors.accent.strong }
              : { borderWidth: 1.5, borderColor: colors.lineStrong },
          ]}
        >
          {selected ? <Icon name="check" size={16} color={colors.textOnAccent} /> : null}
        </View>
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
    gap: 16,
  },
  texts: {
    flex: 1,
    gap: 2,
  },
  mark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
