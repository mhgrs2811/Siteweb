import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Wordmark } from '@/components/brand/Wordmark';
import { ProfileSummary } from '@/components/onboarding/ProfileSummary';
import { Button } from '@/components/ui/Button';
import { Headline } from '@/components/ui/Headline';
import { Icon } from '@/components/ui/Icon';
import { ListRow } from '@/components/ui/ListRow';
import { Screen } from '@/components/ui/Screen';
import { Stagger } from '@/components/ui/Stagger';
import { Surface } from '@/components/ui/Surface';
import { Text } from '@/components/ui/Text';
import { useOnboarding } from '@/features/onboarding/store';
import { formatConsentDate } from '@/features/onboarding/format';
import { resolveLanguage } from '@/i18n';
import { devScreensEnabled } from '@/lib/env';
import { usePreferences } from '@/store/preferences';
import { useTheme } from '@/theme';

type GreetingKey = 'home.greetingMorning' | 'home.greetingAfternoon' | 'home.greetingEvening';

function greetingKey(): GreetingKey {
  const hour = new Date().getHours();
  if (hour < 12) return 'home.greetingMorning';
  if (hour < 18) return 'home.greetingAfternoon';
  return 'home.greetingEvening';
}

/**
 * Post-onboarding home of Phase 1: the saved profile, the next step, and the settings.
 * It becomes the "Today" tab once the routine exists (Phase 4).
 */
export default function HomeScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const answers = useOnboarding((state) => state.answers);
  const reset = useOnboarding((state) => state.reset);
  const themeMode = usePreferences((state) => state.themeMode);
  const language = usePreferences((state) => state.language);
  const locale = resolveLanguage(language);
  const consent = answers.photoConsent;

  return (
    <Screen>
      <Wordmark size="md" />

      <View style={{ marginTop: theme.spacing[6], gap: theme.spacing[3] }}>
        <Stagger>
          <Text variant="overline" color="accent">
            {t(greetingKey(), { name: answers.firstName })}
          </Text>
          <Headline text={t('home.headline')} variant="h1" />
          <Text variant="body" color="secondary">
            {t('home.body')}
          </Text>
        </Stagger>
      </View>

      <Surface variant="highlight" radius="lg" padding={5} style={{ marginTop: theme.spacing[6] }}>
        <View style={styles.cardRow}>
          <View style={[styles.cardIcon, { backgroundColor: theme.colors.surface }]}>
            <Icon name="camera" size={24} color={theme.colors.accent.text} />
          </View>
          <View style={styles.cardTexts}>
            <Text variant="overline" color="accent">
              {t('home.nextScan.overline')}
            </Text>
            <Text variant="h2">{t('home.nextScan.title')}</Text>
            <Text variant="bodySmall" color="secondary">
              {t('home.nextScan.body')}
            </Text>
          </View>
        </View>
      </Surface>

      <View style={{ marginTop: theme.spacing[8] }}>
        <View style={styles.sectionHeader}>
          <Text variant="overline" color="secondary">
            {t('home.profile.title')}
          </Text>
          <Button
            label={t('common.edit')}
            variant="ghost"
            size="md"
            fullWidth={false}
            style={styles.editButton}
            onPress={() => router.push('/(onboarding)/name')}
          />
        </View>
        <Surface radius="lg" padding={5}>
          <ProfileSummary answers={answers} />
        </Surface>
      </View>

      <View style={{ marginTop: theme.spacing[8] }}>
        <Text variant="overline" color="secondary" style={{ marginBottom: theme.spacing[1] }}>
          {t('settings.title')}
        </Text>
        <ListRow
          title={t('settings.photos.title')}
          subtitle={
            consent.acceptedAt
              ? t('onboarding.consent.givenOn', {
                  date: formatConsentDate(consent.acceptedAt, locale),
                })
              : t('onboarding.consent.notGiven')
          }
          leadingIcon="camera"
          trailing="chevron"
          onPress={() => router.push('/settings/photos')}
          showDivider
        />
        <ListRow
          title={t('settings.appearance.title')}
          subtitle={t(`theme.${themeMode}`)}
          leadingIcon="sun"
          trailing="chevron"
          onPress={() => router.push('/settings/appearance')}
          showDivider
        />
        <ListRow
          title={t('settings.language.title')}
          subtitle={t(`language.${locale}`)}
          leadingIcon="translate"
          trailing="chevron"
          onPress={() => router.push('/settings/language')}
        />
        {devScreensEnabled ? (
          <View style={{ marginTop: theme.spacing[2] }}>
            <Button
              label={t('home.openDesignSystem')}
              variant="ghost"
              size="md"
              onPress={() => router.push('/dev/design-system')}
            />
            <Button
              label={t('home.resetOnboarding')}
              variant="ghost"
              size="md"
              onPress={() => {
                reset();
                router.replace('/');
              }}
            />
          </View>
        ) : null}
      </View>

      <Text
        variant="caption"
        color="secondary"
        align="center"
        style={{ marginTop: theme.spacing[6] }}
      >
        {t('common.disclaimer')}
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTexts: {
    flex: 1,
    gap: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  editButton: {
    marginRight: -20,
  },
});
