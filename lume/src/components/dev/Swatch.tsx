import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme';

export interface SwatchProps {
  label: string;
  color: string;
}

export function Swatch({ label, color }: SwatchProps) {
  const theme = useTheme();
  return (
    <View style={styles.swatch}>
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: theme.radii.md,
          backgroundColor: color,
          borderWidth: 1,
          borderColor: theme.colors.line,
        }}
      />
      <Text variant="captionMedium" numberOfLines={2}>
        {label}
      </Text>
      <Text variant="caption" color="secondary">
        {color.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  swatch: {
    width: 88,
    gap: 6,
  },
});
