import * as Haptics from 'expo-haptics';
import { GarminRunDataPoint } from '@/types/garmin';
import { CoachingEvent, CoachingEventType } from '@/types/coach';
import { COACHING_THRESHOLDS } from '@/constants/coach';

/**
 * Coach engine - detects when to deliver coaching messages
 */
export class CoachEngine {
  private isActive = false;
  private runId: string;
  private dataHistory: GarminRunDataPoint[] = [];
  private lastMessageTime = 0;
  private basePace: number | null = null;
  private eventCallbacks: ((event: CoachingEvent) => void)[] = [];

  constructor(runId: string) {
    this.runId = runId;
  }

  /**
   * Start the coach engine
   */
  start(): void {
    this.isActive = true;
    this.dataHistory = [];
    this.lastMessageTime = 0;
    this.basePace = null;
  }

  /**
   * Stop the coach engine
   */
  stop(): void {
    this.isActive = false;
  }

  /**
   * Register event callback
   */
  onEvent(callback: (event: CoachingEvent) => void): void {
    this.eventCallbacks.push(callback);
  }

  /**
   * Process a new data point and determine if coaching is needed
   */
  process(dataPoint: GarminRunDataPoint): void {
    if (!this.isActive) {
      return;
    }

    this.dataHistory.push(dataPoint);

    // Keep only recent history (last 10 minutes)
    const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
    this.dataHistory = this.dataHistory.filter(d => d.timestamp > tenMinutesAgo);

    // Set base pace from first data point with valid pace
    if (this.basePace === null && dataPoint.pace) {
      this.basePace = dataPoint.pace;
    }

    // Check for coaching triggers
    this.checkClimbTrigger(dataPoint);
  }

  /**
   * Check if climb coaching is needed
   */
  private checkClimbTrigger(dataPoint: GarminRunDataPoint): void {
    const now = Date.now();

    // Check cooldown period
    if (now - this.lastMessageTime < COACHING_THRESHOLDS.MESSAGE_COOLDOWN) {
      return;
    }

    // Check grade threshold
    if (!dataPoint.grade || dataPoint.grade < COACHING_THRESHOLDS.GRADE_MIN_PERCENT) {
      return;
    }

    // Check pace drop
    if (!dataPoint.pace || !this.basePace) {
      return;
    }

    const paceDropPercent = ((dataPoint.pace - this.basePace) / this.basePace) * 100;

    if (paceDropPercent < COACHING_THRESHOLDS.PACE_DROP_PERCENT) {
      return;
    }

    // All conditions met - trigger coaching
    const message = this.getClimbMessage();
    this.triggerEvent('climb', message);
  }

  /**
   * Get a random climb coaching message
   */
  private getClimbMessage(): string {
    const messages = [
      'Ease the pace. Shorten your stride. You\'re doing fine.',
      'This climb counts. Breathe steady.',
      'Slow is strong. Stay tall.',
      'You didn\'t come this far to stop.',
      'Control the effort, not the hill.',
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  /**
   * Trigger a coaching event
   */
  private triggerEvent(type: CoachingEventType, message: string): void {
    const event: CoachingEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      message,
      timestamp: Date.now(),
      runId: this.runId,
    };

    this.lastMessageTime = event.timestamp;

    // Trigger haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(console.error);

    // Notify callbacks
    this.eventCallbacks.forEach(callback => callback(event));
  }

  /**
   * Get coaching events for this run session
   */
  getEvents(): CoachingEvent[] {
    // In a real implementation, this would return the events that were triggered
    // For now, return empty array - events are handled via callbacks
    return [];
  }
}

/**
 * Create a new coach engine instance
 */
export function createCoachEngine(runId: string): CoachEngine {
  return new CoachEngine(runId);
}
