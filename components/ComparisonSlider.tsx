import { useRef, useState, useMemo } from 'react';
import { StyleSheet, View, Image, PanResponder, Text } from 'react-native';
import { Colors, FontSize, Spacing, Radius } from '../lib/theme';

interface Props {
  originalUri: string;
  resultUri: string;
}

export default function ComparisonSlider({ originalUri, resultUri }: Props) {
  const sliderPos = useRef(50);
  const [renderPos, setRenderPos] = useState(50);
  const containerWidth = useRef(0);

  const pan = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gs) => {
      if (!containerWidth.current) return;
      sliderPos.current = Math.max(5, Math.min(95, sliderPos.current + (gs.dx / containerWidth.current) * 100));
      setRenderPos(sliderPos.current);
    },
  }), []);

  return (
    <View
      onLayout={(e) => { containerWidth.current = e.nativeEvent.layout.width; }}
      style={styles.container}
    >
      <Image source={{ uri: resultUri }} style={styles.image} resizeMode="cover" fadeDuration={0} />

      <View style={[styles.originalClip, { width: `${renderPos}%` }]}>
        <Image source={{ uri: originalUri }} style={styles.image} resizeMode="cover" fadeDuration={0} />
      </View>

      <View style={[styles.divider, { left: `${renderPos}%` }]} {...pan.panHandlers}>
        <View style={styles.handle}>
          <Text style={styles.handleIcon}>⟷</Text>
        </View>
      </View>

      <View style={styles.labels}>
        <View style={styles.labelPill}><Text style={styles.labelText}>Original</Text></View>
        <View style={styles.labelPill}><Text style={styles.labelText}>Result</Text></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: Radius.xl, overflow: 'hidden', backgroundColor: Colors.surface, aspectRatio: 1 },
  image: { width: '100%', height: '100%', position: 'absolute' },
  originalClip: { position: 'absolute', top: 0, left: 0, bottom: 0, overflow: 'hidden' },
  divider: { position: 'absolute', top: 0, bottom: 0, width: 3, backgroundColor: Colors.background, marginLeft: -1.5, zIndex: 10 },
  handle: { position: 'absolute', top: '50%', left: -20, marginTop: -20, width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 5 },
  handleIcon: { fontSize: 16, color: Colors.text },
  labels: { position: 'absolute', top: Spacing.md, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: Spacing.md, zIndex: 20 },
  labelPill: { backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: Radius.sm, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs },
  labelText: { color: Colors.background, fontSize: FontSize.xs, fontWeight: '600' },
});
