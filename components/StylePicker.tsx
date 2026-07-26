import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, ScrollView, View } from 'react-native';
import { Colors, FontSize, Spacing, Radius } from '../lib/theme';
import { STYLE_CATEGORIES, stylesForCategory, type Style, type StyleCategory } from '../lib/styles';

interface Props {
  styleList: Style[];
  selectedId: string | null;
  onSelect: (style: Style) => void;
  disabled?: boolean;
}

export default function StylePicker({ styleList, selectedId, onSelect, disabled }: Props) {
  const [category, setCategory] = useState<StyleCategory>('Featured');
  const visibleStyles = stylesForCategory(category).filter((item) =>
    styleList.some((candidate) => candidate.id === item.id),
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Choose an Occasion</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>
        {STYLE_CATEGORIES.map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.category, category === item && styles.categoryActive]}
            onPress={() => setCategory(item)}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityState={{ selected: category === item }}
          >
            <Text style={[styles.categoryText, category === item && styles.categoryTextActive]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        decelerationRate="fast"
        snapToInterval={154}
      >
        {visibleStyles.map((item) => {
          const isSelected = item.id === selectedId;
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.card,
                isSelected && { borderColor: item.color, backgroundColor: `${item.color}18` },
                disabled && styles.cardDisabled,
              ]}
              onPress={() => onSelect(item)}
              disabled={disabled}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={`${item.label}: ${item.description}`}
              accessibilityState={{ selected: isSelected, disabled }}
            >
              <Text style={styles.emoji}>{item.emoji}</Text>
              <Text style={[styles.name, isSelected && { color: item.color }]}>{item.label}</Text>
              <Text numberOfLines={2} style={styles.description}>{item.description}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: Spacing.lg },
  label: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.xs,
  },
  categories: {
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    paddingBottom: Spacing.md,
  },
  category: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryActive: { backgroundColor: Colors.text, borderColor: Colors.text },
  categoryText: { color: Colors.textSecondary, fontSize: FontSize.sm, fontWeight: '600' },
  categoryTextActive: { color: Colors.background },
  scroll: { gap: Spacing.md, paddingHorizontal: Spacing.xs },
  card: {
    width: 142,
    minHeight: 154,
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  cardDisabled: { opacity: 0.4 },
  emoji: { fontSize: 32, marginBottom: Spacing.sm },
  name: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  description: {
    marginTop: Spacing.xs,
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    lineHeight: 15,
    textAlign: 'center',
  },
});
