import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Divider } from '@/components/ui/Divider';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Surface } from '@/components/ui/Surface';
import { Text } from '@/components/ui/Text';
import { Toggle } from '@/components/ui/Toggle';
import { useTheme } from '@/theme';

export interface ConsentCardProps {
  accepted: boolean;
  onAcceptedChange: (accepted: boolean) => void;
  keepPhotos: boolean;
  onKeepPhotosChange: (keep: boolean) => void;
}

const FACTS: { key: 'purpose' | 'hosting' | 'retention' | 'deletion'; icon: IconName }[] = [
  { key: 'purpose', icon: 'scan' },
  { key: 'hosting', icon: 'globe' },
  { key: 'retention', icon: 'eye' },
  { key: 'deletion', icon: 'x' },
];

/**
 * The photo consent, on its own screen, separate from the terms (PRD, section 2): four plain
 * facts, the retention choice, then an explicit, unchecked-by-default statement.
 */
export function ConsentCard({
  accepted,
  onAcceptedChange,
  keepPhotos,
  onKeepPhotosChange,
}: ConsentCardProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();

  return (
    <View style={{ gap: theme.spacing[4] }}>
      <Surface radius="lg" padding={5} style={{ gap: theme.spacing[4] }}>
        {FACTS.map((fact) => (
          <View key={fact.key} style={styles.fact}>
            <View style={[styles.factIcon, { backgroundColor: theme.colors.accent.soft }]}>
              <Icon name={fact.icon} size={20} color={theme.colors.accent.text} />
            </View>
            <Text variant="bodySmall" style={styles.factText}>
              {t(`onboarding.consent.facts.${fact.key}`)}
            </Text>
          </View>
        ))}
        <Divider />
        <Toggle
          label={t('onboarding.consent.keepPhotos')}
          description={t('onboarding.consent.keepPhotosHint')}
          value={keepPhotos}
          onValueChange={onKeepPhotosChange}
        />
      </Surface>

      <Surface variant="highlight" radius="lg" padding={5}>
        <Checkbox
          checked={accepted}
          onChange={onAcceptedChange}
          label={t('onboarding.consent.statement')}
        />
      </Surface>

      <Button
        label={t('onboarding.consent.readSummary')}
        variant="ghost"
        size="md"
        onPress={() => router.push('/legal/privacy')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  factIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  factText: {
    flex: 1,
  },
});
