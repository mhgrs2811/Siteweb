import { useTranslation } from 'react-i18next';

import { OptionRow } from '@/components/ui/OptionRow';
import { Sheet } from '@/components/ui/Sheet';
import { resolveLanguage, SUPPORTED_LANGUAGES } from '@/i18n';
import { usePreferences } from '@/store/preferences';

/** Language picker, presented as a native form sheet. */
export default function LanguageSheet() {
  const { t } = useTranslation();
  const language = usePreferences((state) => state.language);
  const setLanguage = usePreferences((state) => state.setLanguage);
  const current = resolveLanguage(language);

  return (
    <Sheet
      icon="translate"
      overline={t('settings.title')}
      title={t('settings.language.title')}
      body={t('settings.language.body')}
    >
      {SUPPORTED_LANGUAGES.map((code, index) => (
        <OptionRow
          key={code}
          label={t(`language.${code}`)}
          selected={current === code}
          onPress={() => setLanguage(code)}
          showDivider={index < SUPPORTED_LANGUAGES.length - 1}
        />
      ))}
    </Sheet>
  );
}
