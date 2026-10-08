import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Headline } from '@/components/ui/Headline';
import { Icon } from '@/components/ui/Icon';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useOnboarding } from '@/features/onboarding/store';
import { useTheme } from '@/theme';

/** Kind dead end for users under 16: no account is created and nothing leaves the device. */
export default function TooYoungScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const clearAgeBand = useOnboarding((state) => state.clearAgeBand);

  const correct = () => {
    clearAgeBand();
    // Reached from the age step: go back to it. Reached on a cold start: open it afresh.
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(onboarding)/age');
    }
  };

  return (
    <Screen
      scroll={false}
      contentContainerStyle={styles.content}
      footer={<Button label={t('onboarding.tooYoung.cta')} onPress={correct} />}
    >
      <View style={{ gap: theme.spacing[6] }}>
        <View style={[styles.medallion, { backgroundColor: theme.colors.accent.soft }]}>
          <Icon name="leaf" size={32} color={theme.colors.accent.text} />
        </View>
        <View style={{ gap: theme.spacing[3] }}>
          <Text variant="overline" color="accent">
            {t('onboarding.tooYoung.overline')}
          </Text>
          <Headline text={t('onboarding.tooYoung.title')} variant="h1" />
          <Text variant="body" color="secondary">
            {t('onboarding.tooYoung.body')}
          </Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
  },
  medallion: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
