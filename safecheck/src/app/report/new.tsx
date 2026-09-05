import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { track } from '@/core/analytics';
import { env } from '@/core/config/env';
import { DataError } from '@/core/data';
import { MIN_TOUCH_TARGET, useTheme } from '@/core/theme';
import { Button, Card, Screen, Text, TextField } from '@/core/ui';
import {
  identifierFromRouteParams,
  parseIdentifier,
  REPORT_CATEGORIES,
  type ContactChannel,
  type ParseIdentifierError,
  type ReportCategory,
} from '@/domain';
import { useAuth } from '@/features/auth';
import { canProceed, EMPTY_DRAFT, REPORT_STEPS, useCreateReport, type ReportDraft, type ReportStep } from '@/features/report';

const CHANNELS: ContactChannel[] = ['call', 'sms', 'email', 'website', 'messaging', 'other'];

/**
 * Formulaire de signalement en 4 étapes courtes : une question par écran,
 * de grandes options, aucune saisie obligatoire au-delà du contact et de la catégorie.
 */
export default function NewReportScreen() {
  const params = useLocalSearchParams<{ kind?: string; value?: string }>();
  const { t } = useTranslation();
  const router = useRouter();
  const { spacing } = useTheme();
  const auth = useAuth();
  const create = useCreateReport();

  const prefilled = useMemo(
    () => (params.kind && params.value ? identifierFromRouteParams(params.kind, params.value) : null),
    [params.kind, params.value],
  );

  const [draft, setDraft] = useState<ReportDraft>({ ...EMPTY_DRAFT, identifier: prefilled });
  const [stepIndex, setStepIndex] = useState(prefilled ? 1 : 0);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    track({ name: 'report_started' });
  }, []);

  const step: ReportStep = REPORT_STEPS[stepIndex] ?? 'identifier';
  const isLast = stepIndex === REPORT_STEPS.length - 1;

  function next() {
    if (isLast) {
      void submit();
    } else {
      setStepIndex((i) => i + 1);
    }
  }
  function back() {
    if (stepIndex === 0) router.back();
    else setStepIndex((i) => i - 1);
  }

  async function submit() {
    if (!draft.identifier || !draft.category) return;
    setSubmitError(null);
    try {
      await create.mutateAsync({
        identifier: draft.identifier,
        category: draft.category,
        ...(draft.channel ? { channel: draft.channel } : {}),
        ...(draft.description.trim() ? { description: draft.description.trim() } : {}),
        ...(draft.hadFinancialLoss !== null ? { hadFinancialLoss: draft.hadFinancialLoss } : {}),
      });
      setSubmitted(true);
    } catch (e) {
      if (e instanceof DataError && e.message.includes('already_reported')) {
        setSubmitError(t('report.alreadyReported'));
      } else {
        setSubmitError(t(`errors.${e instanceof DataError ? e.code : 'unknown'}`));
      }
    }
  }

  if (auth.status === 'signed_out') {
    return (
      <Screen footer={<Button label={t('account.signIn')} icon="log-in-outline" onPress={() => router.push('/auth/sign-in')} />}>
        <Text>{t('report.signInRequired')}</Text>
      </Screen>
    );
  }

  if (submitted) {
    return (
      <Screen footer={<Button label={t('report.success.done')} onPress={() => router.dismissTo('/')} />}>
        <View style={{ alignItems: 'center', gap: spacing.lg, paddingVertical: spacing.xxl }}>
          <Ionicons name="checkmark-circle" size={72} color="#1E6B3A" />
          <Text variant="title" align="center" accessibilityRole="header" accessibilityLiveRegion="polite">
            {t('report.success.title')}
          </Text>
          <Text align="center" color="textMuted">
            {t('report.success.body')}
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen
      footer={
        <View style={{ gap: spacing.sm }}>
          {submitError ? (
            <Text variant="caption" style={{ color: '#A32D2D' }} accessibilityLiveRegion="assertive">
              {submitError}
            </Text>
          ) : null}
          <Button
            label={isLast ? t('report.steps.confirm.submit') : t('common.continue')}
            icon={isLast ? 'send' : 'arrow-forward'}
            onPress={next}
            disabled={!canProceed(step, draft)}
            loading={create.isPending}
          />
          <Button label={t('common.back')} variant="ghost" onPress={back} />
        </View>
      }
    >
      <Text variant="caption" color="textMuted">
        {t('report.step', { current: stepIndex + 1, total: REPORT_STEPS.length })}
      </Text>
      <Text variant="title" accessibilityRole="header">
        {t(`report.steps.${step}.title`)}
      </Text>
      <Text color="textMuted">{t(`report.steps.${step}.hint`)}</Text>

      {step === 'identifier' ? <IdentifierStep draft={draft} onChange={setDraft} /> : null}
      {step === 'category' ? <CategoryStep draft={draft} onChange={setDraft} /> : null}
      {step === 'details' ? <DetailsStep draft={draft} onChange={setDraft} /> : null}
      {step === 'confirm' ? <ConfirmStep draft={draft} /> : null}
    </Screen>
  );
}

type StepProps = { draft: ReportDraft; onChange: (d: ReportDraft) => void };

function IdentifierStep({ draft, onChange }: StepProps) {
  const { t } = useTranslation();
  const [raw, setRaw] = useState(draft.identifier?.display ?? '');
  const [error, setError] = useState<ParseIdentifierError['reason'] | null>(null);

  function handle(v: string) {
    setRaw(v);
    const parsed = parseIdentifier(v, env.EXPO_PUBLIC_DEFAULT_REGION);
    if (parsed.ok) {
      setError(null);
      onChange({ ...draft, identifier: parsed.identifier });
    } else {
      onChange({ ...draft, identifier: null });
      setError(v.trim().length > 5 ? parsed.reason : null);
    }
  }

  return (
    <TextField
      label={t('check.inputLabel')}
      placeholder={t('check.inputPlaceholder')}
      value={raw}
      onChangeText={handle}
      onClear={() => handle('')}
      error={error ? t(`check.parseError.${error}`) : null}
      hint={draft.identifier ? t(`check.detected.${draft.identifier.kind}`) : undefined}
      autoCapitalize="none"
      autoCorrect={false}
      autoFocus
    />
  );
}

function OptionCard({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const { colors, radius, spacing } = useTheme();
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected, checked: selected }}
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 64,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        padding: spacing.lg,
        borderRadius: radius.lg,
        borderWidth: 2,
        borderColor: selected ? colors.primary : colors.border,
        backgroundColor: selected ? colors.risk.unknown.bg : colors.surface,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <Ionicons name={selected ? 'radio-button-on' : 'radio-button-off'} size={28} color={selected ? colors.primary : colors.textMuted} />
      <Text variant="bodyStrong" style={{ flex: 1 }}>
        {label}
      </Text>
    </Pressable>
  );
}

function CategoryStep({ draft, onChange }: StepProps) {
  const { t } = useTranslation();
  const { spacing } = useTheme();
  return (
    <View style={{ gap: spacing.md }} accessibilityRole="radiogroup">
      {REPORT_CATEGORIES.map((c: ReportCategory) => (
        <OptionCard
          key={c}
          label={t(`categories.${c}`)}
          selected={draft.category === c}
          onPress={() => onChange({ ...draft, category: c })}
        />
      ))}
    </View>
  );
}

function DetailsStep({ draft, onChange }: StepProps) {
  const { t } = useTranslation();
  const { spacing } = useTheme();
  return (
    <View style={{ gap: spacing.xl }}>
      <View style={{ gap: spacing.sm }}>
        <Text variant="bodyStrong">{t('report.steps.details.channelLabel')}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
          {CHANNELS.map((ch) => (
            <Chip key={ch} label={t(`channels.${ch}`)} selected={draft.channel === ch} onPress={() => onChange({ ...draft, channel: draft.channel === ch ? null : ch })} />
          ))}
        </View>
      </View>

      <TextField
        label={t('report.steps.details.descriptionLabel')}
        placeholder={t('report.steps.details.descriptionPlaceholder')}
        value={draft.description}
        onChangeText={(v) => onChange({ ...draft, description: v })}
        hint={t('report.steps.details.hint')}
        multiline
        numberOfLines={5}
        style={{ minHeight: 140, textAlignVertical: 'top', paddingTop: 16 }}
        maxLength={2000}
      />

      <View style={{ gap: spacing.sm }}>
        <Text variant="bodyStrong">{t('report.steps.details.lossLabel')}</Text>
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <Chip label={t('common.yes')} selected={draft.hadFinancialLoss === true} onPress={() => onChange({ ...draft, hadFinancialLoss: draft.hadFinancialLoss === true ? null : true })} />
          <Chip label={t('common.no')} selected={draft.hadFinancialLoss === false} onPress={() => onChange({ ...draft, hadFinancialLoss: draft.hadFinancialLoss === false ? null : false })} />
        </View>
      </View>
    </View>
  );
}

function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const { colors, radius, spacing } = useTheme();
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={label}
      onPress={onPress}
      style={{
        minHeight: MIN_TOUCH_TARGET,
        paddingHorizontal: spacing.lg,
        justifyContent: 'center',
        borderRadius: radius.pill,
        borderWidth: 2,
        borderColor: selected ? colors.primary : colors.border,
        backgroundColor: selected ? colors.primary : colors.surface,
      }}
    >
      <Text variant="caption" style={{ color: selected ? colors.onPrimary : colors.text, fontWeight: '600' }}>
        {label}
      </Text>
    </Pressable>
  );
}

function ConfirmStep({ draft }: { draft: ReportDraft }) {
  const { t } = useTranslation();
  const { spacing } = useTheme();
  return (
    <Card style={{ gap: spacing.md }}>
      <Row label={t('check.inputLabel')} value={draft.identifier?.display ?? ''} />
      <Row label={t('report.steps.category.title')} value={draft.category ? t(`categories.${draft.category}`) : ''} />
      {draft.channel ? <Row label={t('report.steps.details.channelLabel')} value={t(`channels.${draft.channel}`)} /> : null}
      {draft.description.trim() ? <Row label={t('report.steps.details.descriptionLabel')} value={draft.description.trim()} /> : null}
      {draft.hadFinancialLoss !== null ? (
        <Row label={t('report.steps.details.lossLabel')} value={draft.hadFinancialLoss ? t('common.yes') : t('common.no')} />
      ) : null}
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ gap: 2 }}>
      <Text variant="caption" color="textMuted">
        {label}
      </Text>
      <Text>{value}</Text>
    </View>
  );
}
