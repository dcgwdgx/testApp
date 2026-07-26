import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, ActivityIndicator, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import { getDisplayTiers, purchaseTier, type Tier } from '../lib/purchases';
import { Colors, FontSize, Spacing, Radius } from '../lib/theme';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function Paywall({ visible, onClose }: Props) {
  const [buying, setBuying] = useState<string | null>(null);
  const [tiers, setTiers] = useState<Tier[]>(getDisplayTiers());

  useEffect(() => {
    if (visible) setTiers(getDisplayTiers());
  }, [visible]);

  const handlePurchase = async (tierId: string) => {
    setBuying(tierId);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const { ok, message } = await purchaseTier(tierId);
    if (ok) {
      setTimeout(() => setBuying(null), 10_000);
    } else {
      setBuying(null);
      Alert.alert('Purchase Failed', message || 'Please try again.');
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent statusBarTranslucent>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.emoji}>✨</Text>
          <Text style={styles.title}>Create More Keepsakes</Text>
          <Text style={styles.subtitle}>
            Your free preview is complete. Choose a one-time portrait pack.
          </Text>

          <View style={styles.tiers}>
            {tiers.map((tier) => (
              <TouchableOpacity
                key={tier.id}
                style={styles.tier}
                onPress={() => handlePurchase(tier.id)}
                disabled={buying !== null}
                activeOpacity={0.8}
              >
                {tier.badge ? (
                  <View style={styles.badge}><Text style={styles.badgeText}>{tier.badge}</Text></View>
                ) : null}
                <View style={styles.tierLeft}>
                  <Text style={styles.tierLabel}>{tier.label}</Text>
                  <Text style={styles.tierCredits}>🎨 {tier.credits} portraits</Text>
                </View>
                <View>
                  {buying === tier.id ? (
                    <ActivityIndicator color={Colors.primary} />
                  ) : (
                    <Text style={styles.tierPrice}>{tier.price}</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.note}>No subscription. Credits never expire.</Text>
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
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxl,
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: Radius.xl,
    padding: Spacing.xxl,
    alignItems: 'center',
    width: '100%',
    maxWidth: 360,
  },
  emoji: { fontSize: 44, marginBottom: Spacing.sm },
  title: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.text, marginBottom: Spacing.xs },
  subtitle: {
    fontSize: FontSize.sm,
    lineHeight: 19,
    color: Colors.textMuted,
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },
  tiers: { alignSelf: 'stretch', gap: Spacing.md, marginBottom: Spacing.md },
  tier: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
  },
  badge: {
    position: 'absolute',
    top: -9,
    right: 12,
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  badgeText: { color: Colors.background, fontSize: 10, fontWeight: '800' },
  tierLeft: { flex: 1, gap: Spacing.xs },
  tierLabel: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text },
  tierCredits: { fontSize: FontSize.sm, color: Colors.textSecondary },
  tierPrice: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.primary },
  note: { fontSize: FontSize.xs, color: Colors.textMuted, marginBottom: Spacing.lg },
  closeBtn: { paddingVertical: Spacing.sm },
  closeText: { fontSize: FontSize.sm, color: Colors.textMuted },
});
