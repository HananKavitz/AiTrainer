/**
 * Subscription tier - available subscription levels
 */
export type SubscriptionTier = 'free' | 'pro';

/**
 * Subscription status - current state of subscription
 */
export type SubscriptionStatus = 'inactive' | 'active' | 'expired' | 'pending';

/**
 * In-App Purchase product information
 */
export interface IAPProduct {
  productId: string;
  price: string;
  priceCurrency: string;
  localizedPrice: string;
  description: string;
  title: string;
}

/**
 * User subscription details
 */
export interface UserSubscription {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  productId?: string;
  expiresAt?: number | null;
  autoRenewing: boolean;
}

/**
 * Weekly usage tracking for free tier limits
 */
export interface WeeklyUsage {
  weekStart: number; // ISO week start timestamp
  coachedRunsCount: number;
}
