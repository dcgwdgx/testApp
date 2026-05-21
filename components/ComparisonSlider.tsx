import { useState, useRef, useCallback } from 'react';
import {
  StyleSheet, View, Image, PanResponder, Text, LayoutChangeEvent,
} from 'react-native';
import { Colors, FontSize, Spacing, Radius } from '../lib/theme';

interface Props {
  originalUri: string;
  resultUri: string;
}

export default function ComparisonSlider({ originalUri, resultUri }: Props) {
  const [sliderPos, setSliderPos] = useState(50);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerLeft = useRef(0);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
    // measure container's absolute position on screen
    (e.target as any)?.measureInWindow?.((x: number) => {
      containerLeft.current = x;
    });
  }, []);

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gs) => {
        if (containerWidth === 0) return;
        // Use relative dx from start position for proportional movement
        const pct = Math.max(5, Math.min(95, sliderPos + (gs.dx / containerWidth) * 100));
        setSliderPos(pct);
      },
    }),
  ).current;

  return (
    <View ref={(ref) => ref && (ref as any).measureInWindow} onLayout={onLayout} style={styles.container}>
      {/* Result (bottom layer) */}
      <Image source={{ uri: resultUri }} style={styles.image} resizeMode="cover" />

      {/* Original (top layer, clipped) */}
      <View style={[styles.originalClip, { width: `${sliderPos}%` }]}>
        <Image source={{ uri: originalUri }} style={styles.image} resizeMode="cover" />
      </View>

      {/* Divider line + draggable handle */}
      <View style={[styles.divider, { left: `${sliderPos}%` }]} {...pan.panHandlers}>
        <View style={styles.handle}>
          <Text style={styles.handleIcon}>⟷</Text>
        </View>
      </View>

      {/* Labels */}
      <View style={styles.labels}>
        <View style={styles.labelPill}><Text style={styles.labelText}>Original</Text></View>
        <View style={styles.labelPill}><Text style={styles.labelText}>Result</Text></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.xl,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
    aspectRatio: 1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  originalClip: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  divider: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: Colors.background,
    marginLeft: -1.5,
    zIndex: 10,
  },
  handle: {
    position: 'absolute',
    top: '50%',
    left: -20,
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  handleIcon: { fontSize: 16, color: Colors.text },
  labels: {
    position: 'absolute',
    top: Spacing.md,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    zIndex: 20,
  },
  labelPill: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  labelText: {
    color: Colors.background,
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
});
