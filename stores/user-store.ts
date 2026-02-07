import { create } from 'zustand';
import { GarminConnection, GarminUserProfile } from '@/types/garmin';
import { UserSubscription, SubscriptionTier, SubscriptionStatus } from '@/types/subscription';

interface UserStore {
  // Garmin connection
  garminConnection: GarminConnection;
  garminProfile: GarminUserProfile | null;

  // Subscription
  subscription: UserSubscription;

  // Actions
  setGarminConnection: (connection: Partial<GarminConnection>) => void;
  setGarminProfile: (profile: GarminUserProfile | null) => void;
  setSubscription: (subscription: Partial<UserSubscription>) => void;
  clearGarminConnection: () => void;
}

/**
 * User store - manages user data and connections
 */
export const useUserStore = create<UserStore>((set) => ({
  // Initial state
  garminConnection: {
    isConnected: false,
    userId: null,
    accessToken: null,
    refreshToken: null,
    tokenExpiresAt: null,
  },
  garminProfile: null,
  subscription: {
    tier: 'free',
    status: 'inactive',
    productId: undefined,
    expiresAt: null,
    autoRenewing: false,
  },

  // Actions
  setGarminConnection: (connection) =>
    set((state) => ({
      garminConnection: { ...state.garminConnection, ...connection },
    })),

  setGarminProfile: (profile) => set({ garminProfile: profile }),

  setSubscription: (subscription) =>
    set((state) => ({
      subscription: { ...state.subscription, ...subscription },
    })),

  clearGarminConnection: () =>
    set({
      garminConnection: {
        isConnected: false,
        userId: null,
        accessToken: null,
        refreshToken: null,
        tokenExpiresAt: null,
      },
      garminProfile: null,
    }),
}));

/**
 * Initialize user store from storage
 */
export async function initUserStore(): Promise<void> {
  try {
    const { loadUserData } = await import('@/services/storage');
    const data = await loadUserData();

    useUserStore.setState({
      garminConnection: {
        isConnected: !!data.garminUserId,
        userId: data.garminUserId,
        accessToken: data.garminAccessToken,
        refreshToken: data.garminRefreshToken,
        tokenExpiresAt: data.garminTokenExpiresAt,
      },
      subscription: {
        tier: data.subscriptionTier,
        status: data.subscriptionStatus,
        expiresAt: data.subscriptionExpiresAt,
        autoRenewing: false,
      },
    });
  } catch (error) {
    console.error('Failed to initialize user store:', error);
  }
}

/**
 * Persist user state to storage
 */
export async function persistUserState(): Promise<void> {
  try {
    const state = useUserStore.getState();
    const { updateUserData } = await import('@/services/storage');

    await updateUserData({
      garminUserId: state.garminConnection.userId,
      garminAccessToken: state.garminConnection.accessToken,
      garminRefreshToken: state.garminConnection.refreshToken,
      garminTokenExpiresAt: state.garminConnection.tokenExpiresAt,
      subscriptionTier: state.subscription.tier,
      subscriptionStatus: state.subscription.status,
      subscriptionExpiresAt: state.subscription.expiresAt,
    });
  } catch (error) {
    console.error('Failed to persist user state:', error);
  }
}
