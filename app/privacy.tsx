import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors, FontSize, Spacing } from '../lib/theme';

export default function PrivacyScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Privacy Policy</Text>
      <Text style={styles.date}>Last updated: July 27, 2026</Text>

      <Text style={styles.section}>1. Information We Collect</Text>
      <Text style={styles.text}>
        Pet Portrait AI does not collect names, email addresses, precise location, or
        advertising identifiers. Free usage, purchased credits, and limited product
        events are stored locally on your device.
      </Text>

      <Text style={styles.section}>2. How We Use Your Photos</Text>
      <Text style={styles.text}>
        Your uploaded pet photos are used exclusively to generate AI-powered artistic
        portraits. Images are sent directly to Volcengine for processing. Generated
        portraits and history are saved locally on your device.
      </Text>

      <Text style={styles.section}>3. Data Storage</Text>
      <Text style={styles.text}>
        Generated images, history, free usage, purchased credits, processed transaction
        identifiers, and limited product events are stored locally on your device. You
        can remove this data by clearing the app's data or uninstalling the app.
      </Text>

      <Text style={styles.section}>4. Third-Party Services</Text>
      <Text style={styles.text}>
        This app uses Volcengine (火山引擎) for AI image generation and Apple App
        Store or Google Play for purchases. Purchase completion is handled on the
        device using the applicable store.
      </Text>

      <Text style={styles.section}>5. Contact Us</Text>
      <Text style={styles.text}>
        If you have any questions about this Privacy Policy, please contact us at:
        dcgwdgx@126.com
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.xxl,
    paddingBottom: 60,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  date: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginBottom: Spacing.xxl,
  },
  section: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text,
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  text: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
});
