import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Icon, type IconName } from '@/components/ui/Icon';
import { Sheet } from '@/components/ui/Sheet';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme';

const STEPS: { icon: IconName; key: 'profile' | 'scan' | 'routine' }[] = [
  { icon: 'user', key: 'profile' },
  { icon: 'camera', key: 'scan' },
  { icon: 'listChecks', key: 'routine' },
];

/** Opened by the welcome call to action while the onboarding is being built (Phase 1). */
export default function NextStepSheet() {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Sheet
      icon="sparkle"
      overline={t('nextStep.overline')}
      title={t('nextStep.title')}
      body={t('nextStep.body')}
    >
      <View style={{ gap: theme.spacing[3] }}>
        {STEPS.map((step, index) => (
          <View key={step.key} style={styles.step}>
            <View style={[styles.index, { backgroundColor: theme.colors.surfaceSunken }]}>
              <Text variant="captionMedium" color="secondary">
                {index + 1}
              </Text>
            </View>
            <Icon name={step.icon} size={20} color={theme.colors.accent.text} />
            <Text variant="label" style={styles.stepLabel}>
              {t(`nextStep.steps.${step.key}`)}
            </Text>
          </View>
        ))}
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  index: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLabel: {
    flex: 1,
  },
});
