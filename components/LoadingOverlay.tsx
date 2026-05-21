import { StyleSheet, View, Text, ActivityIndicator, Modal, TouchableOpacity } from 'react-native';
import { Colors, FontSize, Spacing, Radius } from '../lib/theme';

interface Props {
  visible: boolean;
  status: string;
  onCancel?: () => void;
}

const STATUS_TEXT: Record<string, string> = {
  starting: 'Preparing your photo...',
  processing: 'The artist is painting...',
  succeeded: 'Done!',
};

export default function LoadingOverlay({ visible, status, onCancel }: Props) {
  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card} accessibilityRole="alert" accessibilityLabel="Generating portrait">
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.title}>Creating Portrait</Text>
          <Text style={styles.status}>
            {STATUS_TEXT[status] || 'Working on it...'}
          </Text>
          {onCancel && (
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onCancel}
              accessibilityRole="button"
              accessibilityLabel="Cancel generation"
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: Radius.xl,
    padding: Spacing.xxxl,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.text,
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  status: {
    fontSize: FontSize.sm + 1,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  cancelBtn: {
    marginTop: Spacing.xl,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxl,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelText: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
});
