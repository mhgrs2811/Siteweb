import type { TextStyle } from 'react-native';

import { Text, type TextColor } from './Text';

export interface HeadlineProps {
  /** Copy with `*asterisks*` around the one word or phrase to set in italic. */
  text: string;
  variant?: 'display' | 'h1';
  color?: TextColor;
  align?: TextStyle['textAlign'];
}

/**
 * Editorial headline: a roman Fraunces line with a single italic accent, the house signature
 * for welcome screens and section titles. The italic segment is marked in the translation
 * string, so copywriters control the emphasis per language.
 */
export function Headline({ text, variant = 'display', color = 'ink', align }: HeadlineProps) {
  const italicVariant = variant === 'display' ? 'displayItalic' : 'h1Italic';
  const parts = text.split('*');

  return (
    <Text variant={variant} color={color} align={align}>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <Text key={index} variant={italicVariant} color={color}>
            {part}
          </Text>
        ) : (
          part
        ),
      )}
    </Text>
  );
}
