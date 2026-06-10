import { useState, useRef, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import StylePicker from '../components/StylePicker';
import StrengthSlider from '../components/StrengthSlider';
import LoadingOverlay from '../components/LoadingOverlay';
import Paywall from '../components/Paywall';
import { pickAndResizeImage } from '../components/imagePicker';
import { generatePortrait } from '../lib/api';
import { setCachedImage, setCachedOriginalUri } from '../lib/cache';
import { getCachedPhoto, setCachedPhoto } from '../lib/photoCache';
import { saveToHistory } from '../lib/history';
import { STYLES, type Style } from '../lib/styles';
import { Colors, FontSize, Spacing, Radius } from '../lib/theme';
import { initPurchases, listenForPurchases, canGenerate as checkCanGenerate, deductCredit, incrementFreeUsage, getFreeGenerationsUsed, getRemainingCredits } from '../lib/purchases';

const FREE_LIMIT = 3;

export default function GenerateScreen() {
  const router = useRouter();
  const [image, setImage] = useState<{ uri: string; base64: string } | null>(() => getCachedPhoto());
  const [selectedStyle, setSelectedStyle] = useState<Style | null>(null);
  const [strength, setStrength] = useState(0.5);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const abortRef = useRef<AbortController | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [freeUsed, setFreeUsed] = useState(0);
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    initPurchases();
    listenForPurchases((added: number) => {
      setCredits((c) => c + added);
      setShowPaywall(false);
    });
    (async () => {
      const [used, c] = await Promise.all([getFreeGenerationsUsed(), getRemainingCredits()]);
      setFreeUsed(used);
      setCredits(c);
    })();
  }, []);

  const handlePickImage = useCallback(async () => {
    try {
      const result = await pickAndResizeImage();
      setImage(result);
      setCachedPhoto(result);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (err: any) {
      if (err.message !== 'User cancelled') {
        Alert.alert('Error', 'Could not pick image. Please try again.');
      }
    }
  }, []);

  const handleCancel = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setLoading(false);
    setStatus('');
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!image || !selectedStyle || loading) return;

    // Failsafe: auto-dismiss loading after 3 minutes
    const failsafe = setTimeout(() => {
      setLoading(false);
      setStatus('');
      Alert.alert('Timeout', 'Generation took too long. Please try again.');
    }, 180_000);

    try {
      const allowed = await checkCanGenerate();
      if (!allowed) {
        setShowPaywall(true);
        return;
      }

      setLoading(true);
      const controller = new AbortController();
      abortRef.current = controller;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

      try {
        if (!image.base64) {
          Alert.alert('Error', 'Image data is missing. Please re-upload your photo.');
          return;
        }

        const resultUrl = await generatePortrait(
          { imageBase64: image.base64, prompt: selectedStyle.prompt, strength, signal: controller.signal },
          setStatus,
        );

        setCachedImage(resultUrl);
        setCachedOriginalUri(image.uri);

        saveToHistory({
          originalBase64: `data:image/jpeg;base64,${image.base64}`,
          resultBase64: resultUrl,
          styleId: selectedStyle.id,
          styleLabel: selectedStyle.label,
          prompt: selectedStyle.prompt,
        }).catch(() => {});

        const used = await getFreeGenerationsUsed();
        if (used < FREE_LIMIT) {
          await incrementFreeUsage();
          setFreeUsed((c) => c + 1);
        } else {
          await deductCredit();
          setCredits((c) => c - 1);
        }

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.push({ pathname: '/result', params: { style: selectedStyle.id } });
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert('Generation Failed', err.message || 'Something went wrong. Please try again.');
      } finally {
        abortRef.current = null;
        setLoading(false);
      }
    } finally {
      clearTimeout(failsafe);
    }
  }, [image, selectedStyle, strength, loading, router, freeUsed, credits]);

  const canGenerate = image && selectedStyle && !loading;

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {!image ? (
        <TouchableOpacity
          style={styles.pickerArea}
          onPress={handlePickImage}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Upload pet photo from gallery"
        >
          <Text style={styles.pickerEmoji}>📸</Text>
          <Text style={styles.pickerTitle}>Upload Your Pet Photo</Text>
          <Text style={styles.pickerSubtitle}>Tap to choose from gallery</Text>
        </TouchableOpacity>
      ) : (
        <View>
          <Image
            source={{ uri: image.uri }}
            style={styles.preview}
            resizeMode="cover"
            accessibilityLabel="Your uploaded pet photo"
          />
          <TouchableOpacity
            style={styles.changeBtn}
            onPress={handlePickImage}
            accessibilityRole="button"
            accessibilityLabel="Change photo"
          >
            <Text style={styles.changeText}>Change Photo</Text>
          </TouchableOpacity>
        </View>
      )}

      <StylePicker
        styleList={STYLES}
        selectedId={selectedStyle?.id ?? null}
        onSelect={(s) => {
          setSelectedStyle(s);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
        disabled={loading}
      />

      {image && selectedStyle && (
        <StrengthSlider value={strength} onChange={setStrength} disabled={loading} />
      )}

      {image && credits === 0 && freeUsed < FREE_LIMIT && (
        <Text style={styles.freeCount}>
          {freeUsed}/{FREE_LIMIT} free generations used
        </Text>
      )}
      {image && credits > 0 && (
        <Text style={styles.freeCount}>
          {credits} generation{credits !== 1 ? 's' : ''} remaining
        </Text>
      )}

      {image && (
        <TouchableOpacity
          style={[styles.generateBtn, !selectedStyle && styles.generateBtnDisabled]}
          onPress={handleGenerate}
          disabled={!canGenerate}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={selectedStyle ? `Generate ${selectedStyle.label} portrait` : 'Pick a style first'}
        >
          {selectedStyle ? (
            <Text style={styles.generateText}>
              Generate {selectedStyle.emoji} {selectedStyle.label} Portrait
            </Text>
          ) : (
            <Text style={styles.generateTextDisabled}>Pick a style to continue</Text>
          )}
        </TouchableOpacity>
      )}

      {image && (
        <TouchableOpacity style={styles.creditsLink} onPress={() => setShowPaywall(true)}>
          <Text style={styles.creditsLinkText}>Credits</Text>
        </TouchableOpacity>
      )}

      <LoadingOverlay visible={loading} status={status} onCancel={handleCancel} />
      <Paywall visible={showPaywall} onClose={() => setShowPaywall(false)} onPurchased={(added: number) => setCredits((c) => c + added)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.xxl - 4, paddingBottom: 60 },
  pickerArea: {
    borderWidth: 2, borderColor: Colors.border, borderStyle: 'dashed',
    borderRadius: Radius.xl, aspectRatio: 1,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: Colors.surface, gap: Spacing.sm,
  },
  pickerEmoji: { fontSize: 48 },
  pickerTitle: { fontSize: FontSize.lg, fontWeight: '600', color: Colors.text },
  pickerSubtitle: { fontSize: FontSize.sm + 1, color: Colors.textMuted },
  preview: { width: '100%', aspectRatio: 1, borderRadius: Radius.xl },
  changeBtn: { marginTop: 10, alignSelf: 'center', paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg },
  changeText: { color: Colors.primary, fontSize: FontSize.sm + 1, fontWeight: '600' },
  generateBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.lg,
    paddingVertical: Spacing.lg + 2, alignItems: 'center', marginTop: Spacing.sm,
  },
  freeCount: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.sm },
  creditsLink: { alignItems: 'center', marginTop: Spacing.lg },
  creditsLinkText: { fontSize: FontSize.sm, color: Colors.textMuted },
  generateBtnDisabled: { backgroundColor: Colors.border },
  generateText: { color: Colors.background, fontSize: FontSize.lg, fontWeight: '700' },
  generateTextDisabled: { color: Colors.textMuted, fontSize: FontSize.lg, fontWeight: '600' },
});
