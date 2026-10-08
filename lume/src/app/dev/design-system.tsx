import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';

import { Wordmark } from '@/components/brand/Wordmark';
import { ContrastRow } from '@/components/dev/ContrastRow';
import { Section } from '@/components/dev/Section';
import { SpringDemo } from '@/components/dev/SpringDemo';
import { Swatch } from '@/components/dev/Swatch';
import { Aura } from '@/components/signature/Aura';
import { ScoreRing } from '@/components/signature/ScoreRing';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Gauge } from '@/components/ui/Gauge';
import { Headline } from '@/components/ui/Headline';
import { Icon, ICON_NAMES, type IconName } from '@/components/ui/Icon';
import { IconButton } from '@/components/ui/IconButton';
import { ListRow } from '@/components/ui/ListRow';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Screen, useGutter } from '@/components/ui/Screen';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Skeleton } from '@/components/ui/Skeleton';
import { Surface } from '@/components/ui/Surface';
import { Text } from '@/components/ui/Text';
import { TextField } from '@/components/ui/TextField';
import { Toggle } from '@/components/ui/Toggle';
import { useHaptics } from '@/hooks/useHaptics';
import { resolveLanguage, type Language } from '@/i18n';
import { hapticsSupported, HAPTIC_INTENTS, type HapticIntent } from '@/lib/haptics';
import { usePreferences, type ThemeMode } from '@/store/preferences';
import { spacing, useTheme, type TypographyVariant } from '@/theme';

type GoalKey =
  'glow' | 'blemishes' | 'texture' | 'spots' | 'wrinkles' | 'pores' | 'redness' | 'hydration';

const GOALS: { key: GoalKey; icon: IconName }[] = [
  { key: 'glow', icon: 'sparkle' },
  { key: 'blemishes', icon: 'target' },
  { key: 'texture', icon: 'waves' },
  { key: 'spots', icon: 'circlesThree' },
  { key: 'wrinkles', icon: 'waveSine' },
  { key: 'pores', icon: 'circlesThree' },
  { key: 'redness', icon: 'sunHorizon' },
  { key: 'hydration', icon: 'drop' },
];

const MAX_GOALS = 3;

type TypeSampleKey = 'h2' | 'h3' | 'body' | 'bodySmall' | 'caption' | 'overline';

const TYPE_SAMPLES: { variant: TypographyVariant; key: TypeSampleKey }[] = [
  { variant: 'h2', key: 'h2' },
  { variant: 'h3', key: 'h3' },
  { variant: 'body', key: 'body' },
  { variant: 'bodySmall', key: 'bodySmall' },
  { variant: 'caption', key: 'caption' },
  { variant: 'overline', key: 'overline' },
];

const SPACING_KEYS = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16] as const;
const SCORE_OPTIONS = [42, 72, 91] as const;
const TOTAL_STEPS = 12;

export default function DesignSystemScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { colors } = theme;
  const router = useRouter();
  const haptic = useHaptics();
  const gutter = useGutter();
  const { width } = useWindowDimensions();

  const themeMode = usePreferences((state) => state.themeMode);
  const setThemeMode = usePreferences((state) => state.setThemeMode);
  const language = usePreferences((state) => state.language);
  const setLanguage = usePreferences((state) => state.setLanguage);
  const hapticsEnabled = usePreferences((state) => state.hapticsEnabled);
  const setHapticsEnabled = usePreferences((state) => state.setHapticsEnabled);

  const [loading, setLoading] = useState(false);
  const [goals, setGoals] = useState<GoalKey[]>(['glow', 'pores', 'hydration']);
  const [reminder, setReminder] = useState(true);
  const [keepPhotos, setKeepPhotos] = useState(false);
  const [moment, setMoment] = useState<'morning' | 'evening'>('evening');
  const [step, setStep] = useState(5);
  const [firstName, setFirstName] = useState('Léa');
  const [age, setAge] = useState('15');
  const [score, setScore] = useState<number>(72);
  const [replayKey, setReplayKey] = useState(0);

  const themeOptions: { value: ThemeMode; label: string }[] = [
    { value: 'system', label: t('theme.system') },
    { value: 'light', label: t('theme.light') },
    { value: 'dark', label: t('theme.dark') },
  ];
  const languageOptions: { value: Language; label: string }[] = [
    { value: 'fr', label: t('language.fr') },
    { value: 'en', label: t('language.en') },
  ];

  const toggleGoal = (key: GoalKey) => {
    setGoals((current) => {
      if (current.includes(key)) return current.filter((goal) => goal !== key);
      if (current.length >= MAX_GOALS) return current;
      return [...current, key];
    });
  };

  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1800);
  };

  const parsedAge = Number.parseInt(age, 10);
  const ageError = age.length > 0 && Number.isFinite(parsedAge) && parsedAge < 16;
  const auraWidth = width - gutter * 2;

  const swatches: { label: string; color: string }[] = [
    { label: t('designSystem.colors.background'), color: colors.background },
    { label: t('designSystem.colors.surface'), color: colors.surface },
    { label: t('designSystem.colors.surfaceSunken'), color: colors.surfaceSunken },
    { label: t('designSystem.colors.ink'), color: colors.ink },
    { label: t('designSystem.colors.textSecondary'), color: colors.textSecondary },
    { label: t('designSystem.colors.line'), color: colors.line },
    { label: t('designSystem.colors.accentBase'), color: colors.accent.base },
    { label: t('designSystem.colors.accentStrong'), color: colors.accent.strong },
    { label: t('designSystem.colors.accentText'), color: colors.accent.text },
    { label: t('designSystem.colors.accentSoft'), color: colors.accent.soft },
    { label: t('designSystem.colors.champagne'), color: colors.champagne.base },
    { label: t('designSystem.colors.success'), color: colors.success.base },
    { label: t('designSystem.colors.warning'), color: colors.warning.base },
  ];

  const contrastPairs: { name: string; foreground: string; background: string }[] = [
    {
      name: t('designSystem.colors.pairs.inkOnBackground'),
      foreground: colors.ink,
      background: colors.background,
    },
    {
      name: t('designSystem.colors.pairs.secondaryOnBackground'),
      foreground: colors.textSecondary,
      background: colors.background,
    },
    {
      name: t('designSystem.colors.pairs.accentTextOnBackground'),
      foreground: colors.accent.text,
      background: colors.background,
    },
    {
      name: t('designSystem.colors.pairs.labelOnAccentStrong'),
      foreground: colors.textOnAccent,
      background: colors.accent.strong,
    },
    {
      name: t('designSystem.colors.pairs.accentBaseOnBackground'),
      foreground: colors.accent.base,
      background: colors.background,
    },
    {
      name: t('designSystem.colors.pairs.successTextOnBackground'),
      foreground: colors.success.text,
      background: colors.background,
    },
    {
      name: t('designSystem.colors.pairs.warningTextOnBackground'),
      foreground: colors.warning.text,
      background: colors.background,
    },
    {
      name: t('designSystem.colors.pairs.champagneTextOnBackground'),
      foreground: colors.champagne.text,
      background: colors.background,
    },
  ];

  const hapticLabel: Record<HapticIntent, string> = {
    selection: t('designSystem.haptics.selection'),
    confirm: t('designSystem.haptics.confirm'),
    success: t('designSystem.haptics.success'),
    warning: t('designSystem.haptics.warning'),
  };

  return (
    <Screen>
      <View style={styles.topBar}>
        <IconButton
          icon="caretLeft"
          accessibilityLabel={t('common.back')}
          onPress={() => router.back()}
        />
        <Wordmark size="md" />
      </View>

      <View style={[styles.intro, { marginTop: theme.spacing[4], marginBottom: theme.spacing[6] }]}>
        <Text variant="h1">{t('designSystem.title')}</Text>
        <Text variant="body" color="secondary">
          {t('designSystem.subtitle')}
        </Text>
      </View>

      <View style={{ gap: theme.spacing[3] }}>
        <SegmentedControl
          options={themeOptions}
          value={themeMode}
          onChange={setThemeMode}
          accessibilityLabel={t('a11y.themeSelector')}
        />
        <SegmentedControl
          options={languageOptions}
          value={resolveLanguage(language)}
          onChange={setLanguage}
          accessibilityLabel={t('a11y.languageSelector')}
        />
      </View>

      <Section title={t('designSystem.sections.brand')} hint={t('designSystem.brand.hint')}>
        <View style={{ borderRadius: theme.radii.lg, overflow: 'hidden' }}>
          <Aura width={auraWidth} height={220} fade={false} />
          <View style={[StyleSheet.absoluteFill, styles.auraOverlay]}>
            <Wordmark size="lg" />
          </View>
        </View>
        <Headline text={t('designSystem.typography.display')} />
        <Headline text={t('designSystem.typography.h1')} variant="h1" />
      </Section>

      <Section
        title={t('designSystem.sections.colors')}
        hint={t('designSystem.colors.contrastHint')}
      >
        <View style={styles.wrap}>
          {swatches.map((swatch) => (
            <Swatch key={swatch.label} label={swatch.label} color={swatch.color} />
          ))}
        </View>
        <Text variant="overline" color="secondary" style={{ marginTop: theme.spacing[2] }}>
          {t('designSystem.colors.contrastTitle')}
        </Text>
        {contrastPairs.map((pair) => (
          <ContrastRow key={pair.name} {...pair} />
        ))}
      </Section>

      <Section title={t('designSystem.sections.typography')}>
        {TYPE_SAMPLES.map((sample) => (
          <View key={sample.variant} style={styles.typeRow}>
            <Text variant="caption" color="secondary">
              {sample.variant}
            </Text>
            <Text variant={sample.variant} style={styles.typeSample}>
              {t(`designSystem.typography.${sample.key}`)}
            </Text>
          </View>
        ))}
        <View style={styles.typeRow}>
          <Text variant="caption" color="secondary">
            {t('designSystem.typography.scoreLabel')}
          </Text>
          <View style={styles.scoreNumerals}>
            <Text variant="score" color="inherit" style={{ color: colors.accent.base }}>
              72
            </Text>
            <Text variant="scoreSmall" color="champagne">
              84
            </Text>
          </View>
        </View>
      </Section>

      <Section title={t('designSystem.sections.spacing')} hint={t('designSystem.spacing.hint')}>
        {SPACING_KEYS.map((key) => (
          <View key={key} style={styles.spacingRow}>
            <Text variant="caption" color="secondary" style={styles.spacingLabel}>
              {spacing[key]}
            </Text>
            <View
              style={{
                width: spacing[key],
                height: 12,
                backgroundColor: colors.accent.base,
                borderRadius: 2,
              }}
            />
          </View>
        ))}
        <View style={[styles.wrap, { marginTop: theme.spacing[2] }]}>
          {(
            [
              ['xs', t('designSystem.spacing.radiusXs')],
              ['md', t('designSystem.spacing.radiusMd')],
              ['lg', t('designSystem.spacing.radiusLg')],
              ['pill', t('designSystem.spacing.radiusPill')],
            ] as const
          ).map(([key, label]) => (
            <View key={key} style={styles.radiusItem}>
              <View
                style={[
                  {
                    width: 64,
                    height: 64,
                    borderRadius: key === 'pill' ? 32 : theme.radii[key],
                    backgroundColor: colors.surface,
                  },
                  theme.shadows.soft,
                ]}
              />
              <Text variant="caption" color="secondary">
                {label}
              </Text>
            </View>
          ))}
        </View>
      </Section>

      <Section title={t('designSystem.sections.icons')} hint={t('designSystem.icons.hint')}>
        <View style={styles.wrap}>
          {ICON_NAMES.map((name) => (
            <View key={name} style={styles.iconCell}>
              <Icon name={name} size={24} />
              <Icon name={name} size={20} color={colors.textSecondary} />
            </View>
          ))}
        </View>
      </Section>

      <Section title={t('designSystem.sections.buttons')}>
        <Button
          label={t('designSystem.buttons.primary')}
          onPress={simulateLoading}
          loading={loading}
        />
        <Button
          label={t('designSystem.buttons.secondary')}
          variant="secondary"
          onPress={() => {}}
        />
        <Button label={t('designSystem.buttons.ghost')} variant="ghost" onPress={() => {}} />
        <Button label={t('designSystem.buttons.disabled')} disabled />
        <View style={styles.rowGap}>
          <Button label={t('common.continue')} size="md" fullWidth={false} onPress={() => {}} />
          <IconButton icon="shareNetwork" accessibilityLabel={t('common.ok')} variant="surface" />
          <IconButton icon="x" accessibilityLabel={t('common.close')} variant="soft" />
        </View>
      </Section>

      <Section title={t('designSystem.sections.selection')} hint={t('designSystem.selection.hint')}>
        <View style={styles.chipGrid}>
          {GOALS.map((goal) => (
            <Chip
              key={goal.key}
              size="lg"
              icon={goal.icon}
              label={t(`designSystem.selection.goals.${goal.key}`)}
              selected={goals.includes(goal.key)}
              onPress={() => toggleGoal(goal.key)}
              style={styles.chipCell}
            />
          ))}
        </View>
        <View style={styles.rowGap}>
          <Chip label={t('designSystem.controls.morning')} icon="sun" selected onPress={() => {}} />
          <Chip label={t('designSystem.controls.evening')} icon="moon" onPress={() => {}} />
        </View>
      </Section>

      <Section title={t('designSystem.sections.controls')}>
        <Surface radius="lg" padding={4} style={{ gap: theme.spacing[2] }}>
          <Toggle
            label={t('designSystem.controls.eveningReminder')}
            value={reminder}
            onValueChange={setReminder}
          />
          <Toggle
            label={t('designSystem.controls.keepPhotos')}
            value={keepPhotos}
            onValueChange={setKeepPhotos}
          />
        </Surface>
        <SegmentedControl
          options={[
            { value: 'morning', label: t('designSystem.controls.morning') },
            { value: 'evening', label: t('designSystem.controls.evening') },
          ]}
          value={moment}
          onChange={setMoment}
        />
        <View style={styles.rowGap}>
          <IconButton
            icon="caretLeft"
            accessibilityLabel={t('common.back')}
            variant="surface"
            size={40}
            iconSize={20}
            disabled={step <= 1}
            onPress={() => setStep((s) => Math.max(1, s - 1))}
          />
          <View style={styles.progressColumn}>
            <ProgressBar
              progress={step / TOTAL_STEPS}
              accessibilityLabel={t('designSystem.controls.progress', {
                current: step,
                total: TOTAL_STEPS,
              })}
            />
            <Text variant="caption" color="secondary">
              {t('designSystem.controls.progress', { current: step, total: TOTAL_STEPS })}
            </Text>
          </View>
          <IconButton
            icon="caretRight"
            accessibilityLabel={t('common.continue')}
            variant="surface"
            size={40}
            iconSize={20}
            disabled={step >= TOTAL_STEPS}
            onPress={() => setStep((s) => Math.min(TOTAL_STEPS, s + 1))}
          />
        </View>
        <TextField
          label={t('designSystem.controls.firstNameLabel')}
          placeholder={t('designSystem.controls.firstNamePlaceholder')}
          value={firstName}
          onChangeText={setFirstName}
          autoCapitalize="words"
        />
        <TextField
          label={t('designSystem.controls.ageLabel')}
          value={age}
          onChangeText={setAge}
          keyboardType="number-pad"
          error={ageError ? t('designSystem.controls.ageError') : undefined}
        />
      </Section>

      <Section title={t('designSystem.sections.surfaces')}>
        <Surface variant="highlight" radius="lg" padding={4} style={styles.highlightCard}>
          <View style={[styles.iconCircle, { backgroundColor: colors.surface }]}>
            <Icon name="camera" size={20} color={colors.accent.text} />
          </View>
          <View style={styles.cardTexts}>
            <Text variant="h3">{t('designSystem.surfaces.nextScan', { count: 4 })}</Text>
            <Text variant="bodySmall" color="secondary">
              {t('designSystem.surfaces.nextScanBody')}
            </Text>
          </View>
        </Surface>
        <Surface radius="lg" padding={4}>
          <ListRow
            title={t('designSystem.surfaces.scanRowTitle')}
            subtitle={t('designSystem.surfaces.scanRowSubtitle')}
            leadingIcon="camera"
            trailing="chevron"
            onPress={() => {}}
            showDivider
          />
          <ListRow
            title={t('designSystem.surfaces.productRowTitle')}
            subtitle={t('designSystem.surfaces.productRowSubtitle')}
            leadingIcon="barcode"
            trailing={
              <Badge label={t('designSystem.surfaces.verdictCompatible')} tone="success" dot />
            }
            onPress={() => {}}
          />
        </Surface>
        <Surface variant="elevated" radius="lg" padding={5}>
          <View style={{ gap: theme.spacing[3] }}>
            <Text variant="overline" color="secondary">
              {t('designSystem.typography.overline')}
            </Text>
            <Gauge label={t('indicators.texture')} value={68} />
            <Gauge label={t('indicators.glow')} value={61} />
            <Gauge label={t('indicators.hydration')} value={79} />
          </View>
        </Surface>
        <View style={styles.rowGap}>
          <Badge label={t('designSystem.surfaces.verdictCompatible')} tone="success" dot />
          <Badge label={t('designSystem.surfaces.verdictCaution')} tone="warning" dot />
          <Badge label={t('designSystem.surfaces.verdictUnsuitable')} tone="accent" dot />
        </View>
      </Section>

      <Section title={t('designSystem.sections.loading')} hint={t('designSystem.loading.hint')}>
        <Skeleton height={14} width="70%" radius="pill" />
        <Skeleton height={14} width="48%" radius="pill" />
        <Skeleton height={72} radius="md" />
        <View style={styles.rowGap}>
          <Skeleton height={56} width={56} radius="pill" />
          <View style={styles.skeletonColumn}>
            <Skeleton height={14} width="60%" radius="pill" />
            <Skeleton height={12} width="40%" radius="pill" />
          </View>
        </View>
      </Section>

      <Section title={t('designSystem.sections.signature')} hint={t('designSystem.signature.hint')}>
        <View style={styles.ringRow}>
          <ScoreRing score={score} size={168} replayKey={replayKey} />
          <View style={styles.ringControls}>
            <Text variant="overline" color="secondary">
              {t('designSystem.signature.label')}
            </Text>
            <View style={styles.rowGap}>
              {SCORE_OPTIONS.map((option) => (
                <Chip
                  key={option}
                  label={String(option)}
                  selected={score === option}
                  onPress={() => setScore(option)}
                />
              ))}
            </View>
            <Button
              label={t('designSystem.signature.replay')}
              variant="secondary"
              size="md"
              fullWidth={false}
              leading={<Icon name="arrowsClockwise" size={20} />}
              onPress={() => setReplayKey((key) => key + 1)}
            />
          </View>
        </View>
        <View style={styles.rowGap}>
          <ScoreRing
            score={score}
            size={48}
            strokeWidth={5}
            showCaption={false}
            hapticOnSettle={false}
          />
          <ScoreRing
            score={score}
            size={72}
            strokeWidth={7}
            showCaption={false}
            hapticOnSettle={false}
          />
          <ScoreRing
            score={score}
            size={116}
            strokeWidth={8}
            showCaption={false}
            hapticOnSettle={false}
          />
        </View>
      </Section>

      <Section title={t('designSystem.sections.motion')} hint={t('designSystem.motion.hint')}>
        <SpringDemo spring="gentle" label={t('designSystem.motion.gentle')} />
        <SpringDemo spring="snappy" label={t('designSystem.motion.snappy')} />
        <SpringDemo spring="bouncy" label={t('designSystem.motion.bouncy')} />
      </Section>

      <Section
        title={t('designSystem.sections.haptics')}
        hint={hapticsSupported ? undefined : t('designSystem.haptics.unavailable')}
      >
        <Toggle
          label={t('designSystem.haptics.enabled')}
          value={hapticsEnabled}
          onValueChange={setHapticsEnabled}
          disabled={!hapticsSupported}
        />
        <View style={styles.chipGrid}>
          {HAPTIC_INTENTS.map((intent) => (
            <Button
              key={intent}
              label={hapticLabel[intent]}
              variant="secondary"
              size="md"
              haptic={null}
              disabled={!hapticsSupported}
              onPress={() => haptic(intent)}
              style={styles.chipCell}
            />
          ))}
        </View>
      </Section>

      <Section title={t('designSystem.sections.sheet')} hint={t('designSystem.sheet.hint')}>
        <Button
          label={t('designSystem.sheet.open')}
          variant="secondary"
          accessibilityHint={t('a11y.openSheet')}
          onPress={() => router.push('/settings/appearance')}
        />
      </Section>

      <Text
        variant="caption"
        color="secondary"
        align="center"
        style={{ marginTop: theme.spacing[10] }}
      >
        {t('common.disclaimer')}
      </Text>
      {Platform.OS === 'web' ? <View style={{ height: theme.spacing[8] }} /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: -12,
  },
  intro: {
    gap: 8,
  },
  auraOverlay: {
    padding: 20,
    justifyContent: 'flex-end',
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeRow: {
    gap: 4,
  },
  typeSample: {
    flexShrink: 1,
  },
  scoreNumerals: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 16,
  },
  spacingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  spacingLabel: {
    width: 28,
    textAlign: 'right',
  },
  radiusItem: {
    alignItems: 'center',
    gap: 6,
    width: 72,
  },
  iconCell: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  rowGap: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  chipCell: {
    flexGrow: 1,
    flexBasis: '45%',
  },
  progressColumn: {
    flex: 1,
    gap: 6,
  },
  highlightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTexts: {
    flex: 1,
    gap: 2,
  },
  skeletonColumn: {
    flex: 1,
    gap: 8,
  },
  ringRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    flexWrap: 'wrap',
  },
  ringControls: {
    flex: 1,
    minWidth: 150,
    gap: 12,
  },
});
