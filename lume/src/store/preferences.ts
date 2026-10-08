import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ThemeMode = 'system' | 'light' | 'dark';

/** `null` means "follow the device language". */
export type LanguagePreference = 'fr' | 'en' | null;

export interface PreferencesState {
  themeMode: ThemeMode;
  language: LanguagePreference;
  hapticsEnabled: boolean;
  /** True once the persisted values have been read back from storage. */
  hasHydrated: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  setLanguage: (language: LanguagePreference) => void;
  setHapticsEnabled: (enabled: boolean) => void;
  setHasHydrated: (value: boolean) => void;
}

export const PREFERENCES_STORAGE_KEY = 'lume.preferences.v1';

/**
 * Device-level preferences (appearance, language, haptics). Persisted locally; nothing here is
 * personal data. Account-level settings arrive with Supabase in Phase 1.
 */
export const usePreferences = create<PreferencesState>()(
  persist(
    (set) => ({
      themeMode: 'system',
      language: null,
      hapticsEnabled: true,
      hasHydrated: false,
      setThemeMode: (themeMode) => set({ themeMode }),
      setLanguage: (language) => set({ language }),
      setHapticsEnabled: (hapticsEnabled) => set({ hapticsEnabled }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: PREFERENCES_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        themeMode: state.themeMode,
        language: state.language,
        hapticsEnabled: state.hapticsEnabled,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
