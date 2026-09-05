import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Button, Screen, Text } from '@/core/ui';

export default function NotFoundScreen() {
  const { t } = useTranslation();
  return (
    <Screen>
      <Text variant="title">{t('errors.not_found')}</Text>
      <Link href="/" asChild>
        <Button label={t('common.back')} variant="secondary" />
      </Link>
    </Screen>
  );
}
