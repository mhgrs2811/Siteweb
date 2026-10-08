import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { Divider } from '@/components/ui/Divider';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme';

export interface SectionProps extends PropsWithChildren {
  title: string;
  hint?: string;
  /** Hide the separator above the section (first section of a page). */
  first?: boolean;
}

/** Design-system page section: overline title, optional hint, consistent vertical rhythm. */
export function Section({ title, hint, first = false, children }: SectionProps) {
  const theme = useTheme();
  return (
    <View style={{ paddingTop: first ? 0 : theme.spacing[8] }}>
      {first ? null : <Divider style={{ marginBottom: theme.spacing[8] }} />}
      <View style={[styles.header, { marginBottom: theme.spacing[4] }]}>
        <Text variant="overline" color="accent">
          {title}
        </Text>
        {hint ? (
          <Text variant="bodySmall" color="secondary">
            {hint}
          </Text>
        ) : null}
      </View>
      <View style={{ gap: theme.spacing[3] }}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 6,
  },
});
