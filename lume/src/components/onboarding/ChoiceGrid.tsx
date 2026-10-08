import { StyleSheet, View } from 'react-native';

import { Chip, type ChipSize } from '@/components/ui/Chip';
import type { IconName } from '@/components/ui/Icon';
import { Stagger } from '@/components/ui/Stagger';

export interface ChoiceOption<T extends string> {
  value: T;
  label: string;
  description?: string;
  icon?: IconName;
}

export interface ChoiceGridProps<T extends string> {
  options: readonly ChoiceOption<T>[];
  selected: readonly T[];
  onToggle: (value: T) => void;
  /** Single choice announces radio buttons; multiple choice announces checkboxes. */
  selection?: 'single' | 'multiple';
  /** `lg` cards in a grid (onboarding answers) or `md` pills in a flowing row. */
  size?: ChipSize;
  columns?: 1 | 2;
  /** Animate the cards in with a stagger on first render. */
  animated?: boolean;
}

/**
 * The onboarding answer grid: large tactile cards, one or two per row, with the house
 * staggered entrance. Selection logic stays in the caller (single, multiple, capped).
 */
export function ChoiceGrid<T extends string>({
  options,
  selected,
  onToggle,
  selection = 'single',
  size = 'lg',
  columns = 2,
  animated = true,
}: ChoiceGridProps<T>) {
  const large = size === 'lg';
  const cellStyle = large ? (columns === 2 ? styles.cellHalf : styles.cellFull) : styles.cellAuto;

  const chips = options.map((option) => (
    <Chip
      key={option.value}
      size={size}
      layout={columns === 1 ? 'row' : 'column'}
      role={selection === 'single' ? 'radio' : 'checkbox'}
      label={option.label}
      description={option.description}
      icon={option.icon}
      selected={selected.includes(option.value)}
      onPress={() => onToggle(option.value)}
      style={large ? styles.fill : undefined}
    />
  ));

  return (
    <View style={styles.grid} accessibilityRole={selection === 'single' ? 'radiogroup' : undefined}>
      {animated ? (
        <Stagger itemStyle={cellStyle}>{chips}</Stagger>
      ) : (
        chips.map((chip) => (
          <View key={chip.key} style={cellStyle}>
            {chip}
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  cellHalf: {
    flexGrow: 1,
    flexBasis: '45%',
  },
  cellFull: {
    flexBasis: '100%',
  },
  cellAuto: {
    flexGrow: 0,
  },
  fill: {
    flex: 1,
  },
});
