import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import type { EventSubscription, Product, Purchase, PurchaseError } from 'react-native-iap';
import { trackEvent } from './analytics';

const Iap = require('react-native-iap');

const FREE_LIMIT = 1;
const CREDITS_KEY = '@remaining_credits';
const FREE_USED_KEY = '@free_used';
const PROCESSED_PURCHASES_KEY = '@processed_purchases';

export interface Tier {
  id: string;
  label: string;
  price: string;
  credits: number;
  badge?: string;
}

export const TIERS: Tier[] = [
  { id: 'gen_10_1', label: '10 Portraits', price: '$0.99', credits: 10 },
  { id: 'gen_30', label: '30 Portraits', price: '$1.99', credits: 30, badge: 'Most Popular' },
  { id: 'gen_60', label: '60 Portraits', price: '$2.99', credits: 60, badge: 'Best Value' },
];

const PRODUCT_IDS = TIERS.map((tier) => tier.id);
let initialized = false;
let products: Product[] = [];

export async function initPurchases(): Promise<void> {
  if (Platform.OS === 'web' || initialized) return;
  try {
    initialized = await Iap.initConnection();
    products =
      (await Iap.fetchProducts({ skus: PRODUCT_IDS, type: 'in-app' }))?.filter(Boolean) || [];
  } catch (error: any) {
    console.warn('IAP initialization failed:', error?.message || error);
  }
}

export function getDisplayTiers(): Tier[] {
  return TIERS.map((tier) => {
    const product = products.find((item) => item.id === tier.id);
    return { ...tier, price: product?.displayPrice || tier.price };
  });
}

export async function getRemainingCredits(): Promise<number> {
  const value = await AsyncStorage.getItem(CREDITS_KEY);
  return value ? Number.parseInt(value, 10) : 0;
}

async function addCredits(amount: number): Promise<void> {
  const current = await getRemainingCredits();
  await AsyncStorage.setItem(CREDITS_KEY, String(current + amount));
}

export async function deductCredit(): Promise<void> {
  const current = await getRemainingCredits();
  if (current > 0) await AsyncStorage.setItem(CREDITS_KEY, String(current - 1));
}

export async function getFreeGenerationsUsed(): Promise<number> {
  const value = await AsyncStorage.getItem(FREE_USED_KEY);
  return value ? Number.parseInt(value, 10) : 0;
}

export async function incrementFreeUsage(): Promise<void> {
  const used = await getFreeGenerationsUsed();
  await AsyncStorage.setItem(FREE_USED_KEY, String(used + 1));
}

export async function canGenerate(): Promise<boolean> {
  if ((await getFreeGenerationsUsed()) < FREE_LIMIT) return true;
  return (await getRemainingCredits()) > 0;
}

async function creditPurchase(purchase: Purchase): Promise<number> {
  const tier = TIERS.find((item) => item.id === purchase.productId);
  if (!tier) return 0;

  const purchaseId = purchase.transactionId || purchase.purchaseToken || purchase.id;
  const processed: string[] = JSON.parse(
    (await AsyncStorage.getItem(PROCESSED_PURCHASES_KEY)) || '[]',
  );
  if (purchaseId && processed.includes(purchaseId)) {
    await Iap.finishTransaction({ purchase, isConsumable: true });
    return 0;
  }

  await addCredits(tier.credits);
  if (purchaseId) {
    processed.push(purchaseId);
    await AsyncStorage.setItem(
      PROCESSED_PURCHASES_KEY,
      JSON.stringify(processed.slice(-200)),
    );
  }
  await Iap.finishTransaction({ purchase, isConsumable: true });
  return tier.credits;
}

export function listenForPurchases(
  onPurchased: (credits: number) => void,
  onError?: (message: string) => void,
): () => void {
  if (Platform.OS === 'web') return () => {};

  const updateSubscription: EventSubscription = Iap.purchaseUpdatedListener(
    async (purchase: Purchase) => {
      if (!PRODUCT_IDS.includes(purchase.productId) || purchase.purchaseState === 'pending') return;
      try {
        const added = await creditPurchase(purchase);
        if (added > 0) {
          await trackEvent('purchase_succeeded', { productId: purchase.productId, added });
          onPurchased(added);
        }
      } catch (error: any) {
        await trackEvent('purchase_failed', {
          productId: purchase.productId,
          reason: error?.message || 'local_credit_failed',
        });
        onError?.(error?.message || 'Could not complete the purchase.');
      }
    },
  );
  const errorSubscription: EventSubscription = Iap.purchaseErrorListener(
    async (error: PurchaseError) => {
      await trackEvent('purchase_failed', {
        productId: error.productId || 'unknown',
        reason: error.code || error.message,
      });
      if (error.code !== 'user-cancelled') onError?.(error.message);
    },
  );

  return () => {
    updateSubscription.remove();
    errorSubscription.remove();
  };
}

export async function purchaseTier(tierId: string): Promise<{ ok: boolean; message: string }> {
  if (!PRODUCT_IDS.includes(tierId)) return { ok: false, message: 'Unknown portrait pack.' };
  if (Platform.OS === 'web') {
    return { ok: false, message: 'Purchases are available in the mobile app.' };
  }
  if (!initialized) await initPurchases();

  try {
    await trackEvent('purchase_started', { productId: tierId });
    await Iap.requestPurchase({
      request: {
        apple: { sku: tierId },
        google: { skus: [tierId] },
      },
      type: 'in-app',
    });
    return { ok: true, message: '' };
  } catch (error: any) {
    return { ok: false, message: error?.message || String(error) };
  }
}
