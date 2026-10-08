import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Surface } from '@/components/ui/Surface';
import { Text } from '@/components/ui/Text';
import { useGutter } from '@/components/ui/Screen';
import { useTheme } from '@/theme';

/** Demo content for the native form sheet: the detail of one skin indicator. */
export default function SheetScreen() {
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
          paddingBottom: insets.bottom + theme.spacing[6],
          gap: theme.spacing[5],
        },
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.iconCircle, { backgroundColor: theme.colors.accent.soft }]}>
          <Icon name="drop" size={24} color={theme.colors.accent.text} />
        </View>
        <View style={styles.titles}>
          <Text variant="overline" color="secondary">
            {t('designSystem.sections.sheet')}
          </Text>
          <Text variant="h2">{t('designSystem.sheet.title')}</Text>
        </View>
      </View>
      <Text variant="body" color="secondary">
        {t('designSystem.sheet.body')}
      </Text>
      <Surface variant="highlight" radius="lg" padding={4}>
        <Text variant="bodySmall">{t('designSystem.sheet.tip')}</Text>
      </Surface>
      <View style={styles.spacer} />
      <Button label={t('common.close')} variant="secondary" onPress={() => router.back()} />
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
    gap: 2,
  },
  spacer: {
    flex: 1,
  },
});
