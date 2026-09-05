import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { env } from '@/core/config/env';
import { useTheme } from '@/core/theme';
import { Button, Card, RiskBadge, Screen, Text, TextField } from '@/core/ui';
import { detectKind, identifierToRouteParams, parseIdentifier, type ParseIdentifierError } from '@/domain';
import { useRecentChecks } from '@/features/check';

export default function CheckScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors, spacing, radius } = useTheme();
  const [input, setInput] = useState('');
  const [error, setError] = useState<ParseIdentifierError['reason'] | null>(null);
  const recent = useRecentChecks();

  const detected = detectKind(input);

  function submit() {
    const parsed = parseIdentifier(input, env.EXPO_PUBLIC_DEFAULT_REGION);
    if (!parsed.ok) {
      setError(parsed.reason);
      return;
    }
    setError(null);
    router.push({ pathname: '/check/[kind]/[value]', params: identifierToRouteParams(parsed.identifier) });
  }

  async function paste() {
    const text = await Clipboard.getStringAsync();
    if (text) {
      setInput(text.trim());
      setError(null);
    }
  }

  return (
    <Screen>
      <View style={{ gap: spacing.sm }}>
        <Text variant="display" accessibilityRole="header">
          {t('check.title')}
        </Text>
        <Text color="textMuted">{t('check.subtitle')}</Text>
      </View>

      <Card style={{ gap: spacing.lg }}>
        <TextField
          label={t('check.inputLabel')}
          placeholder={t('check.inputPlaceholder')}
          value={input}
          onChangeText={(v) => {
            setInput(v);
            if (error) setError(null);
          }}
          onClear={() => setInput('')}
          clearLabel={t('a11y.clearInput')}
          error={error ? t(`check.parseError.${error}`) : null}
          hint={detected ? t(`check.detected.${detected}`) : undefined}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="default"
          returnKeyType="search"
          onSubmitEditing={submit}
          accessibilityHint={t('check.subtitle')}
        />
        <View style={{ flexDirection: 'row', gap: spacing.md }}>
          <View style={{ flex: 1 }}>
            <Button label={t('check.paste')} icon="clipboard-outline" variant="secondary" onPress={paste} accessibilityLabel={t('a11y.pasteButton')} />
          </View>
          <View style={{ flex: 2 }}>
            <Button label={t('check.submit')} icon="search" onPress={submit} />
          </View>
        </View>
      </Card>

      {recent.items.length > 0 ? (
        <View style={{ gap: spacing.md }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text variant="heading" accessibilityRole="header">
              {t('check.recent')}
            </Text>
            <Pressable accessibilityRole="button" onPress={() => void recent.clear()} hitSlop={8} style={{ minHeight: 48, justifyContent: 'center' }}>
              <Text variant="caption" color="primary">
                {t('check.clearRecent')}
              </Text>
            </Pressable>
          </View>
          {recent.items.map((item) => (
            <Card
              key={item.identifier.value}
              accessibilityLabel={`${item.identifier.display}, ${t(`result.level.${item.level}`)}`}
              onPress={() =>
                router.push({ pathname: '/check/[kind]/[value]', params: identifierToRouteParams(item.identifier) })
              }
              style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}
            >
              <View style={{ flex: 1, gap: spacing.xs }}>
                <Text variant="bodyStrong">{item.identifier.display}</Text>
                <RiskBadge level={item.level} size="md" />
              </View>
              <Ionicons name="chevron-forward" size={24} color={colors.textMuted} />
            </Card>
          ))}
        </View>
      ) : null}

      <Card tone="alt" style={{ gap: spacing.sm, borderRadius: radius.lg }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          <Ionicons name="information-circle-outline" size={24} color={colors.primary} />
          <Text variant="bodyStrong">{t('check.help')}</Text>
        </View>
        <Text variant="caption" color="textMuted">
          {t('check.helpBody')}
        </Text>
      </Card>
    </Screen>
  );
}
