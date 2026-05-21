import { StyleSheet, View, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import { Colors, FontSize, Spacing, Radius } from '../lib/theme';

interface Props {
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
}

export default function StrengthSlider({ value, onChange, disabled }: Props) {
  const pct = Math.round(value * 100);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Style Strength: {pct}%</Text>
      <View style={styles.sliderRow}>
        <Text style={styles.endLabel}>Keep Original</Text>
        <Slider
          style={styles.slider}
          minimumValue={0.1}
          maximumValue={0.9}
          step={0.1}
          value={value}
          onValueChange={onChange}
          disabled={disabled}
          minimumTrackTintColor={Colors.primary}
          maximumTrackTintColor={Colors.border}
          thumbTintColor={Colors.primary}
        />
        <Text style={styles.endLabel}>Full Style</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.md,
  },
  label: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  endLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    width: 44,
    textAlign: 'center',
  },
});
