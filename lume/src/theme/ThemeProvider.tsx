import { createContext, useContext, type PropsWithChildren } from 'react';
import { useColorScheme } from 'react-native';

import { usePreferences } from '@/store/preferences';

import type { ColorScheme } from './colors';
import { themes, type Theme } from './theme';

const ThemeContext = createContext<Theme>(themes.light);

/**
 * Resolves the active colour scheme from the user preference ("system", "light" or "dark")
 * and the OS appearance, then exposes the matching token set to the whole tree.
 */
export function ThemeProvider({ children }: PropsWithChildren) {
  const systemScheme = useColorScheme();
  const themeMode = usePreferences((state) => state.themeMode);

  const scheme: ColorScheme =
    themeMode === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : themeMode;

  return <ThemeContext.Provider value={themes[scheme]}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  return useContext(ThemeContext);
}
