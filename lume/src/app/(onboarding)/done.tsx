import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Wordmark } from '@/components/brand/Wordmark';
import { ProfileSummary } from '@/components/onboarding/ProfileSummary';
import { Aura } from '@/components/signature/Aura';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Headline } from '@/components/ui/Headline';
import { Screen, useGutter } from '@/components/ui/Screen';
import { Stagger } from '@/components/ui/Stagger';
import { Surface } from '@/components/ui/Surface';
import { Text } from '@/components/ui/Text';
import { useOnboarding } from '@/features/onboarding/store';
import { useTheme } from '@/theme';

/** Profile saved: a recap of the answers and the bridge to the first scan. */
export default function DoneScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const gutter = useGutter();
  const { width } = useWindowDimensions();
  const answers = useOnboarding((state) => state.answers);

  const heroHeight = Math.round(Math.min(width * 0.62, 260));
  // The title uses asterisks for its italic accent; a name must not break that markup.
  const name = answers.firstName.replace(/\*/g, '');

  return (
    <Screen
      padded={false}
      safeTop={false}
      footer={
        <Button
          label={t('onboarding.done.cta')}
          // Pops back to the home when the profile was edited from it, else replaces the flow.
          onPress={() => router.dismissTo('/(app)/home')}
        />
      }
    >
      <View style={{ height: heroHeight }}>
        <Aura width={width} height={heroHeight} />
        <View
          style={[
            StyleSheet.absoluteFill,
            { paddingTop: insets.top + 14, paddingHorizontal: gutter },
          ]}
        >
          <Wordmark size="md" />
        </View>
      </View>

      <View
        style={{ paddingHorizontal: gutter, marginTop: -theme.spacing[8], gap: theme.spacing[5] }}
      >
        <Stagger>
          <Badge label={t('onboarding.done.overline')} tone="success" dot />
          <Headline text={t('onboarding.done.title', { name })} variant="h1" />
          <Text variant="body" color="secondary">
            {t('onboarding.done.body')}
          </Text>
        </Stagger>

        <Surface radius="lg" padding={5}>
          <ProfileSummary answers={answers} />
        </Surface>

        <Text variant="caption" color="secondary" align="center">
          {t('common.disclaimer')}
        </Text>
      </View>
    </Screen>
  );
}
