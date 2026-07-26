import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { FEATURED_STYLES, STYLES } from '../lib/styles';
import { Colors, FontSize, Spacing, Radius } from '../lib/theme';
import { trackEvent } from '../lib/analytics';

export default function LandingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <View />
          <TouchableOpacity
            style={styles.historyBtn}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              void trackEvent('history_open', { source: 'home' });
              router.push('/history');
            }}
            accessibilityRole="button"
            accessibilityLabel="View generation history"
          >
            <Text style={styles.historyIcon}>🕐</Text>
            <Text style={styles.historyText}>History</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.hero}>Turn Their Story Into a Keepsake</Text>
        <Text style={styles.subtitle}>
          Create heartfelt memorials, celebration cards, and frame-worthy pet portraits from one photo.
        </Text>

        <View style={styles.badges}>
          <View style={styles.badge}><Text style={styles.badgeText}>{STYLES.length} Designs</Text></View>
          <View style={styles.badge}><Text style={styles.badgeText}>1 Free Preview</Text></View>
          <View style={styles.badge}><Text style={styles.badgeText}>~60s</Text></View>
        </View>

        <TouchableOpacity
          style={styles.cta}
          activeOpacity={0.8}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            void trackEvent('landing_cta');
            router.push('/generate');
          }}
          accessibilityRole="button"
          accessibilityLabel="Try it now — generate your pet portrait"
        >
          <Text style={styles.ctaText}>Try It Free</Text>
        </TouchableOpacity>

        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>Made for Meaningful Moments</Text>

        <View style={styles.gallery}>
          {FEATURED_STYLES.map((style) => (
            <View
              key={style.id}
              style={[styles.galleryItem, { backgroundColor: style.color + '18' }]}
              accessibilityLabel={`${style.label} style preview`}
            >
              <View style={[styles.galleryIcon, { backgroundColor: style.color + '30' }]}>
                <Text style={styles.galleryEmoji}>{style.emoji}</Text>
              </View>
              <Text style={styles.galleryName}>{style.label}</Text>
              <Text style={styles.galleryDescription}>
                {style.description}
              </Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.privacyLink}
          onPress={() => router.push('/privacy')}
          accessibilityRole="button"
          accessibilityLabel="View privacy policy"
        >
          <Text style={styles.privacyText}>Privacy Policy</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.xxl - 4, paddingTop: Spacing.xxl },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  historyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  historyIcon: { fontSize: 14 },
  historyText: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textSecondary },
  hero: { fontSize: FontSize.hero, fontWeight: '800', color: Colors.text, lineHeight: 44, marginBottom: Spacing.md },
  subtitle: { fontSize: FontSize.lg, color: Colors.textMuted, lineHeight: 24, marginBottom: Spacing.xl },
  badges: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xxl },
  badge: {
    backgroundColor: Colors.surface, borderRadius: Radius.full,
    paddingVertical: Spacing.xs, paddingHorizontal: Spacing.md,
    borderWidth: 1, borderColor: Colors.border,
  },
  badgeText: { fontSize: FontSize.xs, fontWeight: '600', color: Colors.textSecondary },
  cta: {
    backgroundColor: Colors.primary, borderRadius: Radius.lg,
    paddingVertical: Spacing.lg + 2, alignItems: 'center', marginBottom: Spacing.xxxl,
  },
  ctaText: { color: Colors.background, fontSize: FontSize.lg, fontWeight: '700' },
  divider: { height: 1, backgroundColor: Colors.border, marginBottom: Spacing.xxl },
  sectionTitle: { fontSize: FontSize.xxl, fontWeight: '700', color: Colors.text, marginBottom: Spacing.lg },
  gallery: { gap: Spacing.md },
  galleryItem: { borderRadius: Radius.xl, padding: Spacing.xl, alignItems: 'center', gap: Spacing.sm },
  galleryIcon: {
    width: 64, height: 64, borderRadius: Radius.full,
    justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.xs,
  },
  galleryEmoji: { fontSize: 28 },
  galleryName: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text },
  galleryDescription: {
    fontSize: FontSize.sm, color: Colors.textSecondary,
    fontWeight: '500', textAlign: 'center', textTransform: 'capitalize',
  },
  privacyLink: {
    marginTop: Spacing.xxl,
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  privacyText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontWeight: '500',
  },
});
