import { useRouter } from 'expo-router';
import type { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme';

import { Button } from './Button';
import { Icon, type IconName } from './Icon';
import { useGutter } from './Screen';
import { Text } from './Text';

export interface SheetProps extends PropsWithChildren {
  title: string;
  body?: string;
  overline?: string;
  icon?: IconName;
  /** Primary action rendered above the close button. */
  action?: { label: string; onPress: () => void };
}

/**
 * Content scaffold for routes presented as native form sheets. Native platforms dismiss
 * with a swipe; the close button keeps the sheet usable on the web and with screen readers.
 */
export function Sheet({ title, body, overline, icon, action, children }: SheetProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const gutter = useGutter();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          paddingHorizontal: gutter,
          paddingTop: theme.spacing[8],
          paddingBottom: Math.max(insets.bottom, theme.spacing[4]) + theme.spacing[2],
          gap: theme.spacing[5],
        },
      ]}
    >
      <View style={styles.header}>
        {icon ? (
          <View style={[styles.iconCircle, { backgroundColor: theme.colors.accent.soft }]}>
            <Icon name={icon} size={24} color={theme.colors.accent.text} />
          </View>
        ) : null}
        <View style={styles.titles}>
          {overline ? (
            <Text variant="overline" color="secondary">
              {overline}
            </Text>
          ) : null}
          <Text variant="h2">{title}</Text>
        </View>
      </View>
      {body ? (
        <Text variant="body" color="secondary">
          {body}
        </Text>
      ) : null}
      {children ? <View>{children}</View> : null}
      <View style={{ gap: theme.spacing[2] }}>
        {action ? <Button label={action.label} onPress={action.onPress} /> : null}
        <Button label={t('common.close')} variant="ghost" size="md" onPress={() => router.back()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titles: {
    flex: 1,
    gap: 4,
  },
});
