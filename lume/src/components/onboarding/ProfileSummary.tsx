import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Badge } from '@/components/ui/Badge';
import { Divider } from '@/components/ui/Divider';
import { Text } from '@/components/ui/Text';
import type { OnboardingAnswers } from '@/features/onboarding/types';
import { useTheme } from '@/theme';

export interface ProfileSummaryProps {
  answers: OnboardingAnswers;
}

interface SummaryRow {
  key: 'skinType' | 'goals' | 'sensitivities' | 'routine' | 'budget' | 'lifestyle';
  label: string;
  value?: string;
  badges?: string[];
}

/** Read-only recap of the onboarding answers: labels on the left, values or badges on the right. */
export function ProfileSummary({ answers }: ProfileSummaryProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { lifestyle } = answers;

  const rows: SummaryRow[] = [
    {
      key: 'skinType',
      label: t('profile.skinType'),
      value: answers.skinType ? t(`onboarding.options.skinType.${answers.skinType}`) : undefined,
    },
    {
      key: 'goals',
      label: t('profile.goals'),
      badges: answers.goals.map((goal) => t(`onboarding.options.goals.${goal}`)),
    },
    {
      key: 'sensitivities',
      label: t('profile.sensitivities'),
      badges: answers.sensitivities.map((item) => t(`onboarding.options.sensitivities.${item}`)),
    },
    {
      key: 'routine',
      label: t('profile.routine'),
      value: answers.routineLevel
        ? t(`onboarding.options.routineLevel.${answers.routineLevel}`)
        : undefined,
    },
    {
      key: 'budget',
      label: t('profile.budget'),
      value: answers.monthlyBudget
        ? t(`onboarding.options.monthlyBudget.${answers.monthlyBudget}`)
        : undefined,
    },
    {
      key: 'lifestyle',
      label: t('profile.lifestyle'),
      badges: [
        lifestyle.sleep ? t(`onboarding.options.sleep.${lifestyle.sleep}`) : null,
        lifestyle.water ? t(`onboarding.options.water.${lifestyle.water}`) : null,
        lifestyle.sun ? t(`onboarding.options.sun.${lifestyle.sun}`) : null,
        lifestyle.makeup === null
          ? null
          : t(`onboarding.options.makeupShort.${lifestyle.makeup ? 'yes' : 'no'}`),
      ].filter((item): item is string => item !== null),
    },
  ];

  return (
    <View>
      {rows.map((row, index) => (
        <View key={row.key}>
          <View style={styles.row}>
            <Text variant="caption" color="secondary" style={styles.label}>
              {row.label}
            </Text>
            <View style={styles.value}>
              {row.badges ? (
                <View style={styles.badges}>
                  {row.badges.length > 0 ? (
                    row.badges.map((badge, badgeIndex) => (
                      <Badge
                        key={`${row.key}-${badgeIndex}`}
                        label={badge}
                        tone={row.key === 'goals' ? 'accent' : 'neutral'}
                      />
                    ))
                  ) : (
                    <Text variant="label" color="secondary">
                      {t('profile.none')}
                    </Text>
                  )}
                </View>
              ) : (
                <Text variant="label" color={row.value ? 'ink' : 'secondary'} align="right">
                  {row.value ?? t('profile.none')}
                </Text>
              )}
            </View>
          </View>
          {index < rows.length - 1 ? (
            <Divider style={{ marginVertical: theme.spacing[1] }} />
          ) : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
    paddingVertical: 10,
  },
  label: {
    width: 96,
    paddingTop: 3,
  },
  value: {
    flex: 1,
    alignItems: 'flex-end',
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: 6,
  },
});
