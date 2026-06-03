import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, ActivityIndicator, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import { purchaseTier, TIERS } from '../lib/purchases';
import { Colors, FontSize, Spacing, Radius } from '../lib/theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  onPurchased: (credits: number) => void;
}

export default function Paywall({ visible, onClose, onPurchased }: Props) {
  const [buying, setBuying] = useState<string | null>(null);

  const handlePurchase = async (tierId: string) => {
    setBuying(tierId);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const { ok, message } = await purchaseTier(tierId);
    setBuying(null);
    if (ok) {
      // Purchase listener will fire onPurchased
    } else {
      Alert.alert('Purchase Failed', message || 'Please try again.');
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent statusBarTranslucent>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.emoji}>🚀</Text>
          <Text style={styles.title}>Get More Generations</Text>
          <Text style={styles.subtitle}>Your 3 free generations are up. Pick a plan to continue.</Text>

          <View style={styles.tiers}>
            {TIERS.map((tier) => (
              <TouchableOpacity
                key={tier.id}
                style={styles.tier}
                onPress={() => handlePurchase(tier.id)}
                disabled={buying !== null}
                activeOpacity={0.8}
              >
                <View style={styles.tierLeft}>
                  <Text style={styles.tierLabel}>{tier.label}</Text>
                  <Text style={styles.tierCredits}>🎨 {tier.credits} portraits</Text>
                </View>
                <View style={styles.tierRight}>
                  {buying === tier.id ? (
                    <ActivityIndicator color={Colors.primary} />
                  ) : (
                    <Text style={styles.tierPrice}>{tier.price}</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.note}>One-time purchase per plan. Use anytime.</Text>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose} disabled={buying !== null}>
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
    padding: Spacing.xxl, alignItems: 'center', width: '100%', maxWidth: 360,
  },
  emoji: { fontSize: 48, marginBottom: Spacing.sm },
  title: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.text, marginBottom: Spacing.xs },
  subtitle: { fontSize: FontSize.sm, color: Colors.textMuted, marginBottom: Spacing.xl, textAlign: 'center' },
  tiers: { alignSelf: 'stretch', gap: Spacing.md, marginBottom: Spacing.md },
  tier: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: Colors.border,
    borderRadius: Radius.lg, padding: Spacing.lg,
  },
  tierLeft: { flex: 1, gap: Spacing.xs },
  tierLabel: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text },
  tierCredits: { fontSize: FontSize.sm, color: Colors.textSecondary },
  tierRight: {},
  tierPrice: {
    fontSize: FontSize.xl, fontWeight: '800', color: Colors.primary,
  },
  note: { fontSize: FontSize.xs, color: Colors.textMuted, marginBottom: Spacing.lg },
  closeBtn: { paddingVertical: Spacing.sm },
  closeText: { fontSize: FontSize.sm, color: Colors.textMuted },
});
