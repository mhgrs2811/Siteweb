import { StyleSheet, View } from 'react-native';

import { Icon, type IconName } from '@/components/ui/Icon';
import { Stagger } from '@/components/ui/Stagger';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme';

export interface BenefitItem {
  icon: IconName;
  title: string;
  body: string;
}

export interface BenefitListProps {
  items: readonly BenefitItem[];
  initialDelayMs?: number;
}

/** Three-line argument list (icon, title, one sentence) used by the value and guide screens. */
export function BenefitList({ items, initialDelayMs = 0 }: BenefitListProps) {
  const theme = useTheme();

  return (
    <View style={{ gap: theme.spacing[4] }}>
      <Stagger initialDelayMs={initialDelayMs}>
        {items.map((item) => (
          <View key={item.title} style={styles.row}>
            <View style={[styles.icon, { backgroundColor: theme.colors.accent.soft }]}>
              <Icon name={item.icon} size={20} color={theme.colors.accent.text} />
            </View>
            <View style={styles.texts}>
              <Text variant="label">{item.title}</Text>
              <Text variant="bodySmall" color="secondary">
                {item.body}
              </Text>
            </View>
          </View>
        ))}
      </Stagger>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: {
    flex: 1,
    gap: 2,
  },
});
