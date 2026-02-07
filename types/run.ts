/**
 * Run status - current state of a run session
 */
export type RunStatus = 'not_started' | 'in_progress' | 'paused' | 'completed';

/**
 * Run session - represents a single running session
 */
export interface RunSession {
  id: string;
  startTime: number;
  endTime?: number;
  status: RunStatus;
  distance: number; // meters
  duration: number; // seconds
  averageHeartRate?: number; // BPM
  averagePace?: number; // seconds per km
  coachingEvents: CoachingEvent[];
  isCoached: boolean;
}

/**
 * Run summary - completed run information for display
 */
export interface RunSummary extends Omit<RunSession, 'status'> {
  maxHeartRate?: number;
  totalAscent?: number; // meters
  totalDescent?: number; // meters
  coachMessageCount: number;
}

/**
 * Import CoachingEvent type to avoid circular dependency
 */
import { CoachingEvent } from './coach';
