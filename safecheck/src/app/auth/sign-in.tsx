import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { DataError } from '@/core/data';
import { useTheme } from '@/core/theme';
import { Button, Screen, Text, TextField } from '@/core/ui';
import { normalizeEmail } from '@/domain';
import { useRequestEmailOtp, useVerifyEmailOtp } from '@/features/auth';

/**
 * Connexion par code email (OTP) : un seul champ à la fois, aucune notion de
 * mot de passe. Le compte est créé automatiquement au premier code validé.
 */
export default function SignInScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { spacing } = useTheme();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [error, setError] = useState<string | null>(null);
  const request = useRequestEmailOtp();
  const verify = useVerifyEmailOtp();

  async function sendCode() {
    const normalized = normalizeEmail(email);
    if (!normalized) {
      setError(t('auth.invalidEmail'));
      return;
    }
    setError(null);
    try {
      await request.mutateAsync(normalized);
      setStep('code');
    } catch (e) {
      setError(t(`errors.${e instanceof DataError ? e.code : 'unknown'}`));
    }
  }

  async function verifyCode() {
    setError(null);
    try {
      await verify.mutateAsync({ email, code });
      router.back();
    } catch (e) {
      setError(e instanceof DataError && e.code === 'validation' ? t('auth.invalidCode') : t('errors.unknown'));
    }
  }

  return (
    <Screen
      footer={
        step === 'email' ? (
          <Button label={t('auth.sendCode')} onPress={() => void sendCode()} loading={request.isPending} />
        ) : (
          <View style={{ gap: spacing.sm }}>
            <Button label={t('auth.verify')} onPress={() => void verifyCode()} loading={verify.isPending} disabled={code.length < 6} />
            <Button label={t('auth.changeEmail')} variant="ghost" onPress={() => setStep('email')} />
          </View>
        )
      }
    >
      <Text color="textMuted">{t('auth.subtitle')}</Text>
      {step === 'email' ? (
        <TextField
          label={t('auth.emailLabel')}
          placeholder={t('auth.emailPlaceholder')}
          value={email}
          onChangeText={setEmail}
          onClear={() => setEmail('')}
          error={error}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          textContentType="emailAddress"
          autoComplete="email"
          returnKeyType="send"
          onSubmitEditing={() => void sendCode()}
          autoFocus
        />
      ) : (
        <View style={{ gap: spacing.lg }}>
          <Text accessibilityLiveRegion="polite">{t('auth.codeSent', { email })}</Text>
          <TextField
            label={t('auth.codeLabel')}
            value={code}
            onChangeText={(v) => setCode(v.replace(/\D/g, '').slice(0, 6))}
            error={error}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            autoComplete="one-time-code"
            maxLength={6}
            style={{ letterSpacing: 8, fontSize: 28, textAlign: 'center' }}
            autoFocus
          />
        </View>
      )}
      <Text variant="caption" color="textMuted">
        {t('auth.privacyNote')}
      </Text>
    </Screen>
  );
}
