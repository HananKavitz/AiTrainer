import { create } from 'zustand';
import { CoachState, CoachTone, CoachStatus } from '@/types/coach';

interface CoachStore extends CoachState {
  setCoachStatus: (status: CoachStatus) => void;
  setCoachTone: (tone: CoachTone) => void;
  setIsSpeaking: (isSpeaking: boolean) => void;
  setLastCoachingEvent: (timestamp: number | null) => void;
}

/**
 * Coach store - manages coach state
 */
export const useCoachStore = create<CoachStore>((set) => ({
  // Initial state
  status: 'off',
  tone: 'encouraging',
  isSpeaking: false,
  lastCoachingEvent: null,

  // Actions
  setCoachStatus: (status) => set({ status }),
  setCoachTone: (tone) => set({ tone }),
  setIsSpeaking: (isSpeaking) => set({ isSpeaking }),
  setLastCoachingEvent: (lastCoachingEvent) => set({ lastCoachingEvent }),
}));

/**
 * Initialize coach store from storage
 */
export async function initCoachStore(): Promise<void> {
  try {
    const { loadUserData } = await import('@/services/storage');
    const data = await loadUserData();

    useCoachStore.setState({
      status: data.coachStatus,
      tone: data.coachTone,
    });
  } catch (error) {
    console.error('Failed to initialize coach store:', error);
  }
}

/**
 * Persist coach state to storage
 */
export async function persistCoachState(): Promise<void> {
  try {
    const state = useCoachStore.getState();
    const { updateUserData } = await import('@/services/storage');

    await updateUserData({
      coachStatus: state.status,
      coachTone: state.tone,
    });
  } catch (error) {
    console.error('Failed to persist coach state:', error);
  }
}
