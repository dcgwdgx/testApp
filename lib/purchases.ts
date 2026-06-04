import AsyncStorage from '@react-native-async-storage/async-storage';
import * as InAppPurchases from 'expo-in-app-purchases';

const FREE_LIMIT = 3;
const CREDITS_KEY = '@remaining_credits';

interface Tier {
  id: string;
  label: string;
  price: string;
  credits: number;
}

export const TIERS: Tier[] = [
  { id: 'gen_10_1',  label: '10 Generations',  price: '$0.99', credits: 10 },
  { id: 'gen_30',  label: '30 Generations',  price: '$1.99', credits: 30 },
  { id: 'gen_60',  label: '60 Generations',  price: '$2.99', credits: 60 },
];

const PRODUCT_IDS = TIERS.map((t) => t.id);
let connected = false;

export async function initPurchases() {
  try {
    await InAppPurchases.connectAsync();
    connected = true;
    await InAppPurchases.getProductsAsync(PRODUCT_IDS);
  } catch (err: any) {
    console.log('IAP init error:', err?.message || err);
  }
}

export async function getRemainingCredits(): Promise<number> {
  const raw = await AsyncStorage.getItem(CREDITS_KEY);
  return raw ? parseInt(raw, 10) : 0;
}

async function addCredits(n: number): Promise<void> {
  const current = await getRemainingCredits();
  await AsyncStorage.setItem(CREDITS_KEY, String(current + n));
}

export async function deductCredit(): Promise<void> {
  const current = await getRemainingCredits();
  if (current > 0) {
    await AsyncStorage.setItem(CREDITS_KEY, String(current - 1));
  }
}

export async function getFreeGenerationsUsed(): Promise<number> {
  // Track free usage separately, always 3 free before needing credits
  const raw = await AsyncStorage.getItem('@free_used');
  return raw ? parseInt(raw, 10) : 0;
}

export async function incrementFreeUsage(): Promise<void> {
  const used = await getFreeGenerationsUsed();
  await AsyncStorage.setItem('@free_used', String(used + 1));
}

export async function canGenerate(): Promise<boolean> {
  const freeUsed = await getFreeGenerationsUsed();
  if (freeUsed < FREE_LIMIT) return true;
  const credits = await getRemainingCredits();
  return credits > 0;
}

export async function purchaseTier(tierId: string): Promise<{ ok: boolean; message: string }> {
  if (!connected) await initPurchases();
  if (!connected) {
    return { ok: false, message: 'Store connection failed. Check network or Apple ID login.' };
  }
  try {
    await InAppPurchases.purchaseItemAsync(tierId);
    return { ok: true, message: '' };
  } catch (err: any) {
    return { ok: false, message: err?.message || String(err) };
  }
}

export function listenForPurchases(onPurchased: (credits: number) => void) {
  InAppPurchases.setPurchaseListener(async ({ responseCode, results }) => {
    if (responseCode === InAppPurchases.IAPResponseCode.OK && results) {
      for (const purchase of results) {
        const tier = TIERS.find((t) => t.id === purchase.productId);
        if (tier) {
          await InAppPurchases.finishTransactionAsync(purchase, true);
          await addCredits(tier.credits);
          onPurchased(tier.credits);
        }
      }
    }
  });
}
