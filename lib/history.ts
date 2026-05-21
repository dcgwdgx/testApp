import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = '@pet_portrait_history';
const MAX_ITEMS = 10;

export interface HistoryEntry {
  id: string;
  timestamp: number;
  originalBase64: string;
  resultBase64: string;
  styleId: string;
  styleLabel: string;
  prompt: string;
}

export async function loadHistory(): Promise<HistoryEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveToHistory(entry: Omit<HistoryEntry, 'id' | 'timestamp'>): Promise<void> {
  try {
    const list = await loadHistory();
    const newEntry: HistoryEntry = {
      ...entry,
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      timestamp: Date.now(),
    };
    list.unshift(newEntry);
    // Trim to limit to avoid AsyncStorage quota
    while (list.length > MAX_ITEMS) list.pop();
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(list));
  } catch {
    // Silently fail — history is non-critical
  }
}

export async function deleteFromHistory(id: string): Promise<void> {
  const list = await loadHistory();
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(list.filter((e) => e.id !== id)));
}

export async function clearHistory(): Promise<void> {
  await AsyncStorage.removeItem(HISTORY_KEY);
}
