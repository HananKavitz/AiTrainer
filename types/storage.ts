/**
 * Stored user data structure for secure storage
 */
export interface StoredUserData {
  // User preferences
  coachStatus: 'on' | 'off';
  coachTone: 'encouraging' | 'motivational' | 'funny';

  // Garmin connection
  garminUserId: string | null;
  garminAccessToken: string | null;
  garminRefreshToken: string | null;
  garminTokenExpiresAt: number | null;

  // Subscription
  subscriptionTier: 'free' | 'pro';
  subscriptionStatus: 'inactive' | 'active' | 'expired' | 'pending';
  subscriptionExpiresAt: number | null;

  // Usage tracking
  currentWeekStart: number | null;
  coachedRunsThisWeek: number;

  // Run history (simplified for MVP)
  recentRunIds: string[];
}

/**
 * Storage key for user data
 */
export const STORAGE_KEY = 'aitrainer_user_data';
