import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEY, StoredUserData } from '@/types/storage';

/**
 * Default storage data
 */
const DEFAULT_DATA: StoredUserData = {
  coachStatus: 'off',
  coachTone: 'encouraging',
  garminUserId: null,
  garminAccessToken: null,
  garminRefreshToken: null,
  garminTokenExpiresAt: null,
  subscriptionTier: 'free',
  subscriptionStatus: 'inactive',
  subscriptionExpiresAt: null,
  currentWeekStart: null,
  coachedRunsThisWeek: 0,
  recentRunIds: [],
};

/**
 * Load user data from secure storage
 */
export async function loadUserData(): Promise<StoredUserData> {
  try {
    const stored = await SecureStore.getItemAsync(STORAGE_KEY);
    if (!stored) {
      return DEFAULT_DATA;
    }
    return { ...DEFAULT_DATA, ...JSON.parse(stored) };
  } catch (error) {
    console.error('Failed to load user data:', error);
    return DEFAULT_DATA;
  }
}

/**
 * Save user data to secure storage
 */
export async function saveUserData(data: StoredUserData): Promise<void> {
  try {
    await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save user data:', error);
    throw error;
  }
}

/**
 * Clear all user data from storage
 */
export async function clearUserData(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear user data:', error);
    throw error;
  }
}

/**
 * Update a subset of user data
 */
export async function updateUserData(updates: Partial<StoredUserData>): Promise<StoredUserData> {
  const current = await loadUserData();
  const updated = { ...current, ...updates };
  await saveUserData(updated);
  return updated;
}

/**
 * Get the current week start timestamp (ISO week)
 */
export function getCurrentWeekStart(): number {
  const now = new Date();
  const day = now.getDay() || 7; // Sunday = 7
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - day + 1);
  weekStart.setHours(0, 0, 0, 0);
  return weekStart.getTime();
}

/**
 * Check if weekly usage needs to be reset
 */
export async function checkWeeklyReset(): Promise<void> {
  const current = await loadUserData();
  const weekStart = getCurrentWeekStart();

  if (current.currentWeekStart !== weekStart) {
    await updateUserData({
      currentWeekStart: weekStart,
      coachedRunsThisWeek: 0,
    });
  }
}
