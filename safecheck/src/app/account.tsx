import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Alert, View } from 'react-native';

import { useTheme } from '@/core/theme';
import { Button, Card, LoadingState, Screen, Text } from '@/core/ui';
import { useAuth, useDeleteAccount, useSignOut } from '@/features/auth';
import { useCurrentPlan } from '@/features/subscription';

export default function AccountScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { spacing } = useTheme();
  const auth = useAuth();
  const plan = useCurrentPlan();
  const signOut = useSignOut();
  const deleteAccount = useDeleteAccount();

  function confirmDelete() {
    Alert.alert(t('account.deleteConfirmTitle'), t('account.deleteConfirmBody'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('account.deleteConfirmAction'),
        style: 'destructive',
        onPress: () => {
          deleteAccount.mutate(undefined, { onSuccess: () => router.dismissTo('/') });
        },
      },
    ]);
  }

  if (auth.status === 'loading') {
    return (
      <Screen scroll={false}>
        <LoadingState />
      </Screen>
    );
  }

  return (
    <Screen>
      {auth.status === 'signed_out' ? (
        <Card style={{ gap: spacing.lg }}>
          <Text>{t('account.signedOut')}</Text>
          <Button label={t('account.signIn')} icon="log-in-outline" onPress={() => router.push('/auth/sign-in')} />
        </Card>
      ) : (
        <>
          <Card style={{ gap: spacing.sm }}>
            <Text variant="caption" color="textMuted">
              {t('auth.emailLabel')}
            </Text>
            <Text variant="bodyStrong">{auth.profile.email}</Text>
            <Text color="textMuted">{t('account.planLabel', { plan: t(`account.plan.${plan}`) })}</Text>
          </Card>

          <Card tone="alt" style={{ gap: spacing.md }}>
            <Text variant="bodyStrong">{t('account.upgrade')}</Text>
            <Text variant="caption" color="textMuted">
              {t('account.premiumSoon')}
            </Text>
          </Card>

          <View style={{ gap: spacing.md }}>
            <Button label={t('account.signOut')} variant="secondary" onPress={() => signOut.mutate()} loading={signOut.isPending} />
            <Button label={t('account.deleteAccount')} variant="danger" onPress={confirmDelete} loading={deleteAccount.isPending} />
          </View>
        </>
      )}

      <Text variant="caption" color="textMuted" align="center">
        {t('account.version', { version: Constants.expoConfig?.version ?? '0.0.0' })}
      </Text>
    </Screen>
  );
}
