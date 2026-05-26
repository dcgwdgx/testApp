import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import * as Haptics from 'expo-haptics';
import { purchaseUnlock } from '../lib/purchases';
import { Colors, FontSize, Spacing, Radius } from '../lib/theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  onPurchased: () => void;
  freeCount: number;
  freeLimit: number;
}

export default function Paywall({ visible, onClose, onPurchased, freeCount, freeLimit }: Props) {
  const [buying, setBuying] = useState(false);

  const handlePurchase = async () => {
    setBuying(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const ok = await purchaseUnlock();
    setBuying(false);
    if (ok) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onPurchased();
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent statusBarTranslucent>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.emoji}>🎨</Text>
          <Text style={styles.title}>Unlock Full Access</Text>
          <Text style={styles.subtitle}>
            You've used {freeCount}/{freeLimit} free generations
          </Text>

          <View style={styles.features}>
            <Text style={styles.feature}>✨ Unlimited generations</Text>
            <Text style={styles.feature}>📐 HD quality without watermark</Text>
            <Text style={styles.feature}>🎨 Priority access to new styles</Text>
          </View>

          <TouchableOpacity
            style={[styles.buyBtn, buying && styles.buyBtnDisabled]}
            onPress={handlePurchase}
            disabled={buying}
            activeOpacity={0.8}
          >
            {buying ? (
              <ActivityIndicator color={Colors.background} />
            ) : (
              <Text style={styles.buyText}>Buy Once — $0.99</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.onetime}>One-time purchase. No subscriptions.</Text>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Maybe Later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center', padding: Spacing.xxl,
  },
  card: {
    backgroundColor: Colors.background, borderRadius: Radius.xl,
    padding: Spacing.xxl, alignItems: 'center', width: '100%', maxWidth: 340,
  },
  emoji: { fontSize: 56, marginBottom: Spacing.md },
  title: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.text, marginBottom: Spacing.sm },
  subtitle: { fontSize: FontSize.md, color: Colors.textMuted, marginBottom: Spacing.xl },
  features: { alignSelf: 'stretch', gap: Spacing.sm, marginBottom: Spacing.xl },
  feature: { fontSize: FontSize.md, color: Colors.textSecondary },
  buyBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.lg,
    paddingVertical: Spacing.lg, paddingHorizontal: Spacing.xxl,
    width: '100%', alignItems: 'center',
  },
  buyBtnDisabled: { opacity: 0.6 },
  buyText: { color: Colors.background, fontSize: FontSize.lg, fontWeight: '700' },
  onetime: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: Spacing.sm, marginBottom: Spacing.lg },
  closeBtn: { paddingVertical: Spacing.sm },
  closeText: { fontSize: FontSize.sm, color: Colors.textMuted },
});
