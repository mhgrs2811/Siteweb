import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme';

export default function NotFoundScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();

  return (
    <Screen scroll={false} contentContainerStyle={styles.content}>
      <View style={{ gap: theme.spacing[3] }}>
        <Text variant="h1">{t('notFound.title')}</Text>
        <Text variant="body" color="secondary">
          {t('notFound.body')}
        </Text>
      </View>
      <Button label={t('notFound.cta')} onPress={() => router.replace('/')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
    gap: 32,
  },
});
