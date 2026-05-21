import { useState } from 'react';
import {
  StyleSheet, View, Image, Text, TouchableOpacity,
  ActivityIndicator, Alert, Linking,
} from 'react-native';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import * as Haptics from 'expo-haptics';
import ComparisonSlider from './ComparisonSlider';
import { Colors, FontSize, Spacing, Radius } from '../lib/theme';

interface Props {
  imageUrl: string;
  originalUri: string;
  onRetry: () => void;
  onNewStyle: () => void;
  onViewHistory: () => void;
}

type ViewMode = 'result' | 'compare' | 'original';

export default function ResultView({ imageUrl, originalUri, onRetry, onNewStyle, onViewHistory }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>('result');
  const [saving, setSaving] = useState(false);

  const handleShare = async () => {
    try {
      await shareAsync(imageUrl, { dialogTitle: 'Share your pet portrait' });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err: any) {
      if (err.message !== 'User cancelled') {
        Alert.alert('Share Failed', 'Could not share the image. Please try again.');
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Needed', 'Allow photo library access in Settings.', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ]);
        return;
      }
      await MediaLibrary.saveToLibraryAsync(imageUrl);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Saved!', 'Your portrait has been saved to your gallery.');
    } catch {
      Alert.alert('Save Failed', 'Could not save the image.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* View toggle */}
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleBtn, viewMode === 'result' && styles.toggleActive]}
          onPress={() => setViewMode('result')}
          accessibilityLabel="Show generated result"
        >
          <Text style={[styles.toggleText, viewMode === 'result' && styles.toggleTextActive]}>Result</Text>
        </TouchableOpacity>
        {originalUri ? (
          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === 'original' && styles.toggleActive]}
            onPress={() => setViewMode('original')}
            accessibilityLabel="Show original photo"
          >
            <Text style={[styles.toggleText, viewMode === 'original' && styles.toggleTextActive]}>Original</Text>
          </TouchableOpacity>
        ) : null}
        {originalUri ? (
          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === 'compare' && styles.toggleActive]}
            onPress={() => setViewMode('compare')}
            accessibilityLabel="Compare original and result"
          >
            <Text style={[styles.toggleText, viewMode === 'compare' && styles.toggleTextActive]}>Compare</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Image area */}
      <View style={styles.imageWrapper}>
        {viewMode === 'compare' && originalUri ? (
          <ComparisonSlider originalUri={originalUri} resultUri={imageUrl} />
        ) : viewMode === 'original' && originalUri ? (
          <Image
            source={{ uri: originalUri }}
            style={styles.image}
            resizeMode="cover"
            accessibilityLabel="Original pet photo"
          />
        ) : (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="contain"
            accessibilityLabel="Generated pet portrait"
          />
        )}
        {viewMode === 'result' && (
          <View style={styles.watermark}>
            <Text style={styles.watermarkText}>AI Pet Portrait</Text>
          </View>
        )}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={handleShare}
          accessibilityRole="button"
          accessibilityLabel="Share portrait"
        >
          <Text style={styles.primaryText}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryBtn, saving && styles.disabledBtn]}
          onPress={handleSave}
          disabled={saving}
          accessibilityRole="button"
          accessibilityLabel={saving ? 'Saving to gallery' : 'Save to gallery'}
        >
          {saving ? (
            <ActivityIndicator size="small" color={Colors.textSecondary} />
          ) : (
            <Text style={styles.secondaryText}>Save to Gallery</Text>
          )}
        </TouchableOpacity>

        <View style={styles.row}>
          <TouchableOpacity style={styles.ghostBtn} onPress={onNewStyle} accessibilityLabel="Try another style">
            <Text style={styles.ghostText}>Try Another Style</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ghostBtn} onPress={onRetry} accessibilityLabel="Upload new photo">
            <Text style={styles.ghostText}>New Photo</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.historyBtn}
          onPress={onViewHistory}
          accessibilityRole="button"
          accessibilityLabel="View generation history"
        >
          <Text style={styles.historyText}>🕐 View History</Text>
        </TouchableOpacity>
      </View>

      {/* Pro CTA */}
      <View style={styles.cta}>
        <Text style={styles.ctaIcon}>✨</Text>
        <Text style={styles.ctaTitle}>Want HD without watermark?</Text>
        <Text style={styles.ctaDesc}>Unlock full resolution downloads and 20+ more styles</Text>
        <View style={styles.ctaBadge}>
          <Text style={styles.ctaBadgeText}>Coming Soon</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.lg },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: Radius.sm,
  },
  toggleActive: {
    backgroundColor: Colors.primary,
  },
  toggleText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  toggleTextActive: {
    color: Colors.background,
  },
  imageWrapper: {
    borderRadius: Radius.xl,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
    aspectRatio: 1,
  },
  image: { width: '100%', height: '100%' },
  watermark: {
    position: 'absolute', bottom: Spacing.md, right: Spacing.md,
    backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 10,
    paddingVertical: Spacing.xs, borderRadius: Radius.sm,
  },
  watermarkText: { color: Colors.background, fontSize: FontSize.xs, fontWeight: '600', opacity: 0.8 },
  actions: { gap: 10 },
  primaryBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.lg - 2,
    paddingVertical: Spacing.lg, alignItems: 'center',
  },
  primaryText: { color: Colors.background, fontSize: FontSize.lg, fontWeight: '700' },
  secondaryBtn: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg - 2,
    paddingVertical: Spacing.lg - 2, alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  disabledBtn: { opacity: 0.6 },
  secondaryText: { color: Colors.text, fontSize: FontSize.lg, fontWeight: '600' },
  row: { flexDirection: 'row', gap: Spacing.md },
  ghostBtn: { flex: 1, paddingVertical: Spacing.md, alignItems: 'center' },
  ghostText: { color: Colors.textMuted, fontSize: FontSize.sm + 1, fontWeight: '500' },
  historyBtn: {
    alignItems: 'center', paddingVertical: Spacing.md,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  historyText: { fontSize: FontSize.sm + 1, fontWeight: '600', color: Colors.primary },
  cta: {
    backgroundColor: Colors.primaryLight, borderRadius: Radius.lg,
    padding: Spacing.xl, alignItems: 'center', borderWidth: 1, borderColor: '#FFE0CC',
  },
  ctaIcon: { fontSize: 28, marginBottom: Spacing.sm },
  ctaTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text, marginBottom: Spacing.xs },
  ctaDesc: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center', marginBottom: Spacing.md },
  ctaBadge: {
    backgroundColor: Colors.primary, borderRadius: Radius.full,
    paddingVertical: Spacing.sm, paddingHorizontal: Spacing.xl,
  },
  ctaBadgeText: { color: Colors.background, fontSize: FontSize.sm, fontWeight: '600' },
});
