import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AnalyticsEvent =
  | 'app_open'
  | 'landing_cta'
  | 'history_open'
  | 'photo_selected'
  | 'style_selected'
  | 'generate_started'
  | 'generate_succeeded'
  | 'generate_failed'
  | 'paywall_viewed'
  | 'purchase_started'
  | 'purchase_succeeded'
  | 'purchase_failed'
  | 'result_viewed'
  | 'result_shared'
  | 'result_saved';

interface QueuedEvent {
  name: AnalyticsEvent;
  sessionId: string;
  properties: Record<string, string | number | boolean>;
}

const QUEUE_KEY = '@analytics_queue_v1';
const sessionId = Constants.sessionId || `session_${Date.now()}`;

async function readQueue(): Promise<QueuedEvent[]> {
  try {
    return JSON.parse((await AsyncStorage.getItem(QUEUE_KEY)) || '[]');
  } catch {
    return [];
  }
}

export async function trackEvent(
  name: AnalyticsEvent,
  properties: Record<string, string | number | boolean> = {},
) {
  const queue = await readQueue();
  queue.push({ name, sessionId, properties });
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue.slice(-500)));
}
