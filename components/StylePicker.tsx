import { StyleSheet, Text, TouchableOpacity, ScrollView, View } from 'react-native';
import { Colors, FontSize, Spacing, Radius } from '../lib/theme';
import type { Style } from '../lib/styles';

interface Props {
  styleList: Style[];
  selectedId: string | null;
  onSelect: (style: Style) => void;
  disabled?: boolean;
}

export default function StylePicker({ styleList, selectedId, onSelect, disabled }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Choose a Style</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        decelerationRate="fast"
        snapToInterval={112}
      >
        {styleList.map((s) => {
          const isSelected = s.id === selectedId;
          return (
            <TouchableOpacity
              key={s.id}
              style={[
                styles.card,
                isSelected && { borderColor: s.color, backgroundColor: s.color + '18' },
                disabled && styles.cardDisabled,
              ]}
              onPress={() => onSelect(s)}
              disabled={disabled}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={`${s.label} style`}
              accessibilityState={{ selected: isSelected, disabled }}
            >
              <Text style={styles.emoji}>{s.emoji}</Text>
              <Text style={[styles.name, isSelected && { color: s.color }]}>{s.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.lg,
  },
  label: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.xs,
  },
  scroll: {
    gap: Spacing.md,
    paddingHorizontal: Spacing.xs,
  },
  card: {
    width: 100,
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  cardDisabled: {
    opacity: 0.4,
  },
  emoji: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  name: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
