import { useState, useCallback } from 'react';
import {
  StyleSheet, View, Text, Image, TouchableOpacity, FlatList, Alert,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { loadHistory, deleteFromHistory, clearHistory, type HistoryEntry } from '../lib/history';
import { setCachedImage } from '../lib/cache';
import { setCachedPhoto } from '../lib/photoCache';
import { Colors, FontSize, Spacing, Radius } from '../lib/theme';
import { trackEvent } from '../lib/analytics';

export default function HistoryScreen() {
  const router = useRouter();
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  const refresh = useCallback(async () => {
    setEntries(await loadHistory());
  }, []);

  useFocusEffect(
    useCallback(() => {
      void trackEvent('history_open', { source: 'screen' });
      refresh();
    }, [refresh]),
  );

  const handleView = (entry: HistoryEntry) => {
    setCachedImage(entry.resultBase64);
    // Extract raw base64 from data URI for re-generation
    const rawBase64 = entry.originalBase64.replace(/^data:image\/\w+;base64,/, '');
    setCachedPhoto({ uri: entry.originalBase64, base64: rawBase64 });
    router.push({ pathname: '/result', params: { style: entry.styleId } });
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete', 'Remove this from history?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteFromHistory(id);
          refresh();
        },
      },
    ]);
  };

  const handleClearAll = () => {
    Alert.alert('Clear All', 'Delete all history?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          await clearHistory();
          refresh();
        },
      },
    ]);
  };

  return (
    <FlatList
      data={entries}
      keyExtractor={(e) => e.id}
      contentContainerStyle={styles.list}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>📭</Text>
          <Text style={styles.emptyTitle}>No history yet</Text>
          <Text style={styles.emptySubtitle}>Generated portraits will appear here</Text>
        </View>
      }
      ListHeaderComponent={
        entries.length > 0 ? (
          <TouchableOpacity style={styles.clearBtn} onPress={handleClearAll}>
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        ) : null
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.8}
          onPress={() => handleView(item)}
          onLongPress={() => handleDelete(item.id)}
          accessibilityRole="button"
          accessibilityLabel={`View ${item.styleLabel} portrait from ${new Date(item.timestamp).toLocaleDateString()}`}
        >
          <Image source={{ uri: item.resultBase64 }} style={styles.thumb} resizeMode="cover" />
          <View style={styles.info}>
            <Text style={styles.styleLabel}>{item.styleLabel}</Text>
            <Text style={styles.date}>
              {new Date(item.timestamp).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: Spacing.xxl - 4,
    paddingBottom: 60,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
  },
  clearBtn: {
    alignSelf: 'flex-end',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  clearText: {
    color: Colors.error,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    gap: Spacing.md,
    alignItems: 'center',
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: Radius.md,
    backgroundColor: Colors.border,
  },
  info: {
    flex: 1,
    gap: Spacing.xs,
  },
  styleLabel: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.text,
  },
  date: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
});
