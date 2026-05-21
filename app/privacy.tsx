import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors, FontSize, Spacing } from '../lib/theme';

export default function PrivacyScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Privacy Policy</Text>
      <Text style={styles.date}>Last updated: May 21, 2026</Text>

      <Text style={styles.section}>1. Information We Collect</Text>
      <Text style={styles.text}>
        Pet Portrait AI does not collect, store, or share any personal information.
        Photos you upload are temporarily processed to generate artistic portraits and
        are not stored on our servers. Uploaded images are sent directly to our AI
        service provider (Volcengine) solely for the purpose of image generation.
      </Text>

      <Text style={styles.section}>2. How We Use Your Photos</Text>
      <Text style={styles.text}>
        Your uploaded pet photos are used exclusively to generate AI-powered artistic
        portraits. Images are transmitted securely and are not used for any other
        purpose, including model training, advertising, or analytics. Generated
        portraits are saved locally on your device only.
      </Text>

      <Text style={styles.section}>3. Data Storage</Text>
      <Text style={styles.text}>
        All generated images and history are stored locally on your device. We do
        not upload or store your photos or generated portraits on any external
        servers. You can delete your history at any time from the History screen.
      </Text>

      <Text style={styles.section}>4. Third-Party Services</Text>
      <Text style={styles.text}>
        This app uses the Volcengine (火山引擎) API for AI image generation. Photos
        are transmitted to Volcengine's servers for processing. Please refer to
        Volcengine's privacy policy for information on how they handle data during
        the image generation process.
      </Text>

      <Text style={styles.section}>5. Contact Us</Text>
      <Text style={styles.text}>
        If you have any questions about this Privacy Policy, please contact us at:
        support@petportrait.ai
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
