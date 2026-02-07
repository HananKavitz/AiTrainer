import { create } from 'zustand';
import { RunSession, RunStatus, RunSummary } from '@/types/run';
import { CoachingEvent } from '@/types/coach';

interface RunStore {
  // Current run
  currentRun: RunSession | null;
  runHistory: RunSummary[];

  // Actions
  startRun: (id: string, isCoached: boolean) => void;
  updateRun: (updates: Partial<RunSession>) => void;
  addCoachingEvent: (event: CoachingEvent) => void;
  completeRun: () => void;
  pauseRun: () => void;
  resumeRun: () => void;
  addRunToHistory: (summary: RunSummary) => void;
  clearCurrentRun: () => void;
}

/**
 * Run store - manages run sessions and history
 */
export const useRunStore = create<RunStore>((set) => ({
  // Initial state
  currentRun: null,
  runHistory: [],

  // Actions
  startRun: (id, isCoached) =>
    set({
      currentRun: {
        id,
        startTime: Date.now(),
        status: 'in_progress',
        distance: 0,
        duration: 0,
        coachingEvents: [],
        isCoached,
      },
    }),

  updateRun: (updates) =>
    set((state) => {
      if (!state.currentRun) return state;
      return {
        currentRun: { ...state.currentRun, ...updates },
      };
    }),

  addCoachingEvent: (event) =>
    set((state) => {
      if (!state.currentRun) return state;
      return {
        currentRun: {
          ...state.currentRun,
          coachingEvents: [...state.currentRun.coachingEvents, event],
        },
      };
    }),

  completeRun: () =>
    set((state) => {
      if (!state.currentRun) return state;
      return {
        currentRun: {
          ...state.currentRun,
          status: 'completed',
          endTime: Date.now(),
        },
      };
    }),

  pauseRun: () =>
    set((state) => {
      if (!state.currentRun) return state;
      return {
        currentRun: { ...state.currentRun, status: 'paused' },
      };
    }),

  resumeRun: () =>
    set((state) => {
      if (!state.currentRun) return state;
      return {
        currentRun: { ...state.currentRun, status: 'in_progress' },
      };
    }),

  addRunToHistory: (summary) =>
    set((state) => ({
      runHistory: [summary, ...state.runHistory],
    })),

  clearCurrentRun: () =>
    set({
      currentRun: null,
    }),
}));

/**
 * Generate a unique run ID
 */
export function generateRunId(): string {
  return `run_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Convert current run to summary
 */
export function runToSummary(): RunSummary | null {
  const { currentRun } = useRunStore.getState();
  if (!currentRun || currentRun.status !== 'completed') {
    return null;
  }

  return {
    ...currentRun,
    endTime: currentRun.endTime || Date.now(),
    coachMessageCount: currentRun.coachingEvents.length,
  };
}

/**
 * Increment coached runs counter for the week
 */
export async function incrementCoachedRunsCount(): Promise<void> {
  const { updateUserData, checkWeeklyReset } = await import('@/services/storage');
  await checkWeeklyReset();

  const data = await import('@/services/storage').then(m => m.loadUserData());
  await updateUserData({
    coachedRunsThisWeek: (data.coachedRunsThisWeek || 0) + 1,
  });
}

/**
 * Check if user has reached weekly limit for coached runs
 */
export async function hasReachedWeeklyLimit(): Promise<boolean> {
  const { checkWeeklyReset } = await import('@/services/storage');
  await checkWeeklyReset();

  const data = await import('@/services/storage').then(m => m.loadUserData());
  return data.coachedRunsThisWeek >= 2; // Free tier limit: 2 runs per week
}
