import { useTranslation } from 'react-i18next';

import { OptionRow } from '@/components/ui/OptionRow';
import { Sheet } from '@/components/ui/Sheet';
import { usePreferences, type ThemeMode } from '@/store/preferences';

const MODES: ThemeMode[] = ['system', 'light', 'dark'];

/** Appearance picker, presented as a native form sheet. */
export default function AppearanceSheet() {
  const { t } = useTranslation();
  const themeMode = usePreferences((state) => state.themeMode);
  const setThemeMode = usePreferences((state) => state.setThemeMode);

  return (
    <Sheet
      icon="sun"
      overline={t('settings.title')}
      title={t('settings.appearance.title')}
      body={t('settings.appearance.body')}
    >
      {MODES.map((mode, index) => (
        <OptionRow
          key={mode}
          label={t(`theme.${mode}`)}
          selected={themeMode === mode}
          onPress={() => setThemeMode(mode)}
          showDivider={index < MODES.length - 1}
        />
      ))}
    </Sheet>
  );
}
