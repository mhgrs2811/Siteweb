import { View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme';

export interface DividerProps {
  /** Left inset, for lists where the line should start under the text, not under the icon. */
  inset?: number;
  style?: StyleProp<ViewStyle>;
}

export function Divider({ inset = 0, style }: DividerProps) {
  const { colors } = useTheme();
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={[{ height: 1, backgroundColor: colors.line, marginLeft: inset }, style]}
    />
  );
}
