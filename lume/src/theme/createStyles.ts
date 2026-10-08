import { StyleSheet } from 'react-native';

import type { ColorScheme } from './colors';
import { useTheme } from './ThemeProvider';
import type { Theme } from './theme';

type NamedStyles<T> = { [P in keyof T]: StyleSheet.NamedStyles<T>[P] };

/**
 * Builds a `useStyles()` hook from a theme-aware factory. Styles are created once per colour
 * scheme and cached, so components pay nothing on re-render.
 *
 * @example
 * const useStyles = createStyles((theme) => ({
 *   card: { backgroundColor: theme.colors.surface, borderRadius: theme.radii.lg },
 * }));
 */
export function createStyles<T extends NamedStyles<T>>(factory: (theme: Theme) => T) {
  const cache = new Map<ColorScheme, T>();

  return function useStyles(): T {
    const theme = useTheme();
    const cached = cache.get(theme.scheme);
    if (cached) return cached;
    const created = StyleSheet.create(factory(theme));
    cache.set(theme.scheme, created);
    return created;
  };
}
