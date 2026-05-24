import { useRef } from 'react';
import { StyleSheet, View, Text, PanResponder } from 'react-native';
import { Colors, FontSize, Spacing, Radius } from '../lib/theme';

interface Props {
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
}

const MIN = 0.1;
const MAX = 0.9;

export default function StrengthSlider({ value, onChange, disabled }: Props) {
  const trackRef = useRef<View>(null);
  const trackWidth = useRef(0);
  const pct = Math.round(((value - MIN) / (MAX - MIN)) * 100);

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,
      onPanResponderGrant: (evt) => {
        updateValue(evt.nativeEvent.locationX);
      },
      onPanResponderMove: (evt) => {
        updateValue(evt.nativeEvent.locationX);
      },
    }),
  ).current;

  const updateValue = (x: number) => {
    if (!trackWidth.current) return;
    const p = Math.max(0, Math.min(1, x / trackWidth.current));
    onChange(Math.round((MIN + p * (MAX - MIN)) * 10) / 10);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Style Strength: {pct}%</Text>
      <View style={styles.row}>
        <Text style={styles.endLabel}>Keep Original</Text>
        <View
          ref={trackRef}
          style={styles.track}
          onLayout={(e) => { trackWidth.current = e.nativeEvent.layout.width; }}
          {...pan.panHandlers}
        >
          <View style={[styles.fill, { width: `${pct}%` }]} />
          <View style={[styles.thumb, { left: `${pct}%` }]} />
        </View>
        <Text style={styles.endLabel}>Full Style</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: Spacing.md },
  label: {
    fontSize: FontSize.md, fontWeight: '600', color: Colors.text,
    marginBottom: Spacing.sm, paddingHorizontal: Spacing.xs,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  track: {
    flex: 1, height: 8, borderRadius: Radius.full,
    backgroundColor: Colors.border, justifyContent: 'center', position: 'relative',
  },
  fill: {
    height: '100%', borderRadius: Radius.full,
    backgroundColor: Colors.primary, position: 'absolute', left: 0,
  },
  thumb: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: Colors.primary, marginLeft: -12,
    position: 'absolute', top: -8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, shadowRadius: 4, elevation: 4,
  },
  endLabel: { fontSize: FontSize.xs, color: Colors.textMuted, width: 44, textAlign: 'center' },
});
