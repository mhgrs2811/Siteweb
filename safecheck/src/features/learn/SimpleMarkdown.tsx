import { View } from 'react-native';

import { useTheme } from '@/core/theme';
import { Text } from '@/core/ui';

/**
 * Rendu d'un Markdown volontairement minimal (## titres, listes -, 1., paragraphes).
 * Suffisant pour les contenus pédagogiques ; évite une dépendance lourde.
 */
export function SimpleMarkdown({ source }: { source: string }) {
  const { spacing } = useTheme();
  const blocks = source.split(/\n{2,}/);
  return (
    <View style={{ gap: spacing.lg }}>
      {blocks.map((block, i) => {
        const trimmed = block.trim();
        if (trimmed.startsWith('## ')) {
          return (
            <Text key={i} variant="heading" accessibilityRole="header">
              {trimmed.slice(3)}
            </Text>
          );
        }
        const lines = trimmed.split('\n');
        const isList = lines.every((l) => /^(-|\d+\.)\s/.test(l));
        if (isList) {
          return (
            <View key={i} style={{ gap: spacing.sm }}>
              {lines.map((l, j) => {
                const numbered = /^\d+\./.test(l);
                const content = l.replace(/^(-|\d+\.)\s/, '');
                return (
                  <View key={j} style={{ flexDirection: 'row', gap: spacing.sm }}>
                    <Text>{numbered ? `${j + 1}.` : '•'}</Text>
                    <Text style={{ flex: 1 }}>{content}</Text>
                  </View>
                );
              })}
            </View>
          );
        }
        return <Text key={i}>{trimmed}</Text>;
      })}
    </View>
  );
}
