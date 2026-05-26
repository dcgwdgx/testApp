import AsyncStorage from '@react-native-async-storage/async-storage';
import * as InAppPurchases from 'expo-in-app-purchases';
import { Platform } from 'react-native';

const FREE_LIMIT = 3;
const GENERATION_KEY = '@free_generations_used';
const PURCHASED_KEY = '@has_purchased';
const PRODUCT_ID = 'unlock_full';

let productLoaded = false;

export async function initPurchases() {
  try {
    await InAppPurchases.connectAsync();
    const { results } = await InAppPurchases.getProductsAsync([PRODUCT_ID]);
    if (results?.length) productLoaded = true;
  } catch {
    // StoreKit unavailable — skip (simulator / dev)
  }
}

export async function getFreeGenerationsUsed(): Promise<number> {
  const raw = await AsyncStorage.getItem(GENERATION_KEY);
  return raw ? parseInt(raw, 10) : 0;
}

export async function incrementFreeUsage(): Promise<void> {
  const used = await getFreeGenerationsUsed();
  await AsyncStorage.setItem(GENERATION_KEY, String(used + 1));
}

export async function hasFreeGenerationsLeft(): Promise<boolean> {
  const used = await getFreeGenerationsUsed();
  return used < FREE_LIMIT;
}

export async function hasPurchased(): Promise<boolean> {
  // First check local storage
  const cached = await AsyncStorage.getItem(PURCHASED_KEY);
  if (cached === 'true') return true;

  // Then check with IAP
  try {
    const { results } = await InAppPurchases.getPurchaseHistoryAsync();
    return (results ?? []).some((p) => p.productId === PRODUCT_ID);
  } catch {
    return false;
  }
}

export async function purchaseUnlock(): Promise<boolean> {
  if (!productLoaded) {
    await initPurchases();
  }
  try {
    await InAppPurchases.purchaseItemAsync(PRODUCT_ID);
    // Result comes via purchase listener below
    return true;
  } catch {
    return false;
  }
}

export function listenForPurchases(onPurchased: () => void) {
  InAppPurchases.setPurchaseListener(async ({ responseCode, results }) => {
    if (responseCode === InAppPurchases.IAPResponseCode.OK && results) {
      for (const purchase of results) {
        if (purchase.productId === PRODUCT_ID) {
          await InAppPurchases.finishTransactionAsync(purchase, false);
          await AsyncStorage.setItem(PURCHASED_KEY, 'true');
          onPurchased();
        }
      }
    }
  });
}

export function getProductPrice(): string {
  // Will be populated by getProductsAsync in initPurchases
  // Default fallback
  return Platform.select({ ios: '$0.99', android: 'US$0.99', default: '$0.99' });
}
