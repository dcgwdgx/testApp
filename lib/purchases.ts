import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Purchase, PurchaseError, EventSubscription } from 'react-native-iap';
// react-native-iap uses complex generics — use dynamic require for runtime access
const Iap = require('react-native-iap');

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
let initialized = false;

export async function initPurchases() {
  try {
    const result: boolean = await Iap.initConnection();
    initialized = result;
    await Iap.getProducts({ skus: PRODUCT_IDS });
    // Finish any pending transactions
    const purchases: Purchase[] = await Iap.getAvailablePurchases();
    for (const p of purchases) {
      const tier = TIERS.find((t) => t.id === p.productId);
      await Iap.finishTransaction({ purchase: p, isConsumable: true });
    }
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
  if (!initialized) await initPurchases();
  try {
    await Iap.requestPurchase({ sku: tierId });
    return { ok: true, message: '' };
  } catch (err: any) {
    return { ok: false, message: err?.message || String(err) };
  }
}

export function listenForPurchases(onPurchased: (credits: number) => void): void {
  Iap.purchaseUpdatedListener(async (purchase: Purchase) => {
    const tier = TIERS.find((t) => t.id === purchase.productId);
    if (!tier) return;
    try {
      await Iap.finishTransaction({ purchase, isConsumable: true });
      await addCredits(tier.credits);
      onPurchased(tier.credits);
    } catch {
      try { await addCredits(tier.credits); } catch {}
      onPurchased(tier.credits);
    }
  });

  Iap.purchaseErrorListener((_error: PurchaseError) => {
    // User cancelled or payment error — UI handles via purchaseTier return value
  });
}
