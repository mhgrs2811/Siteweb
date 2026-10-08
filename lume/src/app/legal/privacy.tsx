import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Sheet } from '@/components/ui/Sheet';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme';

const POINTS = [
  'sensitive',
  'hosting',
  'storage',
  'ai',
  'retention',
  'deletion',
  'analytics',
  'notMedical',
] as const;

/** Plain-language privacy summary, opened from the consent screen and the settings. */
export default function PrivacySheet() {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Sheet
      icon="eye"
      overline={t('legal.privacy.overline')}
      title={t('legal.privacy.title')}
      body={t('legal.privacy.body')}
    >
      <View style={{ gap: theme.spacing[3] }}>
        {POINTS.map((key) => (
          <View key={key} style={styles.point}>
            <Icon name="checkCircle" size={20} color={theme.colors.success.text} />
            <Text variant="bodySmall" style={styles.pointText}>
              {t(`legal.privacy.points.${key}`)}
            </Text>
          </View>
        ))}
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  point: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  pointText: {
    flex: 1,
  },
});
