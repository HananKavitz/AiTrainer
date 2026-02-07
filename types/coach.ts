/**
 * Coach status - whether the coach is currently active
 */
export type CoachStatus = 'on' | 'off';

/**
 * Coach tone - different coaching styles
 */
export type CoachTone = 'encouraging' | 'motivational' | 'funny';

/**
 * Coach state - maintains the current state of the AI coach
 */
export interface CoachState {
  status: CoachStatus;
  tone: CoachTone;
  isSpeaking: boolean;
  lastCoachingEvent: number | null;
}

/**
 * Coaching event type - type of coaching message triggered
 */
export type CoachingEventType = 'climb' | 'pace' | 'fatigue' | 'finish';

/**
 * Coaching event - represents a single coaching interaction
 */
export interface CoachingEvent {
  id: string;
  type: CoachingEventType;
  message: string;
  timestamp: number;
  runId: string;
}
