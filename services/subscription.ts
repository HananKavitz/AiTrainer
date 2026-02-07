import {
  Product,
  PurchaseError,
  purchaseErrorListener,
  purchaseUpdatedListener,
} from 'react-native-iap';

// Product IDs
const SUBSCRIPTION_PRODUCTS = [
  'aitrainer_pro_monthly', // iOS/Android monthly
  'aitrainer_pro_monthly_trial', // With trial (optional)
];

let purchaseUpdateSubscription: any = null;
let purchaseErrorSubscription: any = null;
const RNIap = require('react-native-iap');

/**
 * Initialize IAP module
 */
export async function initIAP(): Promise<void> {
  try {
    await RNIap.initConnection();
    console.log('IAP connection initialized');
  } catch (error) {
    console.error('Failed to initialize IAP:', error);
    throw error;
  }
}

/**
 * Get available subscription products
 */
export async function getSubscriptionProducts(): Promise<Product[]> {
  try {
    const products = await RNIap.getSubscriptions(SUBSCRIPTION_PRODUCTS);
    return products;
  } catch (error) {
    console.error('Failed to get subscription products:', error);
    return [];
  }
}

/**
 * Purchase a subscription
 */
export async function purchaseSubscription(productId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    // Set up listener for successful purchase
    purchaseUpdateSubscription = purchaseUpdatedListener(async (purchase: any) => {
      console.log('Purchase updated:', purchase);

      if (purchase.transactionReceipt) {
        try {
          // Acknowledge the purchase
          await RNIap.acknowledgePurchaseAndroid(purchase.purchaseToken);
          await RNIap.finishTransaction(purchase, false);
          resolve(purchase);
        } catch (error) {
          reject(error);
        }
      }
    });

    // Set up listener for purchase errors
    purchaseErrorSubscription = purchaseErrorListener((error: PurchaseError) => {
      console.error('Purchase error:', error);
      reject(error);
    });

    // Initiate purchase
    RNIap.requestSubscription(productId).catch(reject);
  });
}

/**
 * Restore previous purchases
 */
export async function restorePurchases(): Promise<any[]> {
  try {
    const purchases = await RNIap.getPurchaseHistoryAsync();
    return purchases.filter((p: any) => SUBSCRIPTION_PRODUCTS.includes(p.productId));
  } catch (error) {
    console.error('Failed to restore purchases:', error);
    return [];
  }
}

/**
 * End IAP connection
 */
export async function endIAP(): Promise<void> {
  try {
    if (purchaseUpdateSubscription) {
      purchaseUpdateSubscription.remove();
      purchaseUpdateSubscription = null;
    }
    if (purchaseErrorSubscription) {
      purchaseErrorSubscription.remove();
      purchaseErrorSubscription = null;
    }
    await RNIap.endConnection();
    console.log('IAP connection ended');
  } catch (error) {
    console.error('Failed to end IAP connection:', error);
  }
}

/**
 * Check if user has active subscription
 */
export async function hasActiveSubscription(): Promise<boolean> {
  try {
    const purchases = await restorePurchases();
    if (purchases.length === 0) return false;

    // Check if any purchase is still valid
    const now = Date.now();
    return purchases.some((purchase: any) => {
      const expiryDate = purchase.transactionDate ? new Date(purchase.transactionDate).getTime() + 30 * 24 * 60 * 60 * 1000 : 0; // 30 days
      return expiryDate > now;
    });
  } catch (error) {
    console.error('Failed to check subscription status:', error);
    return false;
  }
}

/**
 * Mock function for testing subscription flow without real IAP
 */
export async function mockPurchaseSubscription(): Promise<{ success: boolean; expiryDate: number }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Mock successful purchase
  const expiryDate = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days from now

  // Update storage
  const { updateUserData } = await import('./storage');
  await updateUserData({
    subscriptionTier: 'pro',
    subscriptionStatus: 'active',
    subscriptionExpiresAt: expiryDate,
  });

  return { success: true, expiryDate };
}
