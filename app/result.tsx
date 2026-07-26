import { useEffect } from 'react';
import { StyleSheet, ScrollView, View, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ResultView from '../components/ResultView';
import { getCachedImage, getCachedOriginalUri } from '../lib/cache';
import { getCachedPhoto } from '../lib/photoCache';
import { Colors, Spacing } from '../lib/theme';
import { trackEvent } from '../lib/analytics';

export default function ResultScreen() {
  const router = useRouter();
  const imageUrl = getCachedImage();
  const originalUri = getCachedOriginalUri() ?? getCachedPhoto()?.uri ?? '';

  useEffect(() => {
    if (!imageUrl) {
      router.replace('/generate');
    } else {
      void trackEvent('result_viewed');
    }
  }, [imageUrl, router]);

  if (!imageUrl) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <ResultView
        imageUrl={imageUrl}
        originalUri={originalUri}
        onRetry={() => router.back()}
        onNewStyle={() => router.back()}
        onViewHistory={() => router.push('/history')}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.xxl - 4, paddingBottom: 60 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
