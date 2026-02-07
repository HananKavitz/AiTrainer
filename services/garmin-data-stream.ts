import { GarminRunDataPoint } from '@/types/garmin';

/**
 * Configuration for data streaming
 */
interface DataStreamConfig {
  pollInterval?: number; // milliseconds
  onDataPoint?: (data: GarminRunDataPoint) => void;
  onError?: (error: Error) => void;
}

/**
 * Garmin data stream - handles real-time data from Garmin watches
 */
export class GarminDataStream {
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private isActive = false;
  private config: DataStreamConfig;
  private mockMode = true;

  constructor(config: DataStreamConfig = {}) {
    this.config = {
      pollInterval: 1000, // 1 second default
      ...config,
    };
  }

  /**
   * Start streaming data
   */
  async start(): Promise<void> {
    if (this.isActive) {
      console.warn('Data stream already active');
      return;
    }

    this.isActive = true;

    // In mock mode, start generating mock data
    if (this.mockMode) {
      this.startMockStream();
    } else {
      // In production, start real Garmin Connect API polling
      await this.startRealStream();
    }
  }

  /**
   * Stop streaming data
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isActive = false;
  }

  /**
   * Check if stream is active
   */
  isRunning(): boolean {
    return this.isActive;
  }

  /**
   * Start mock data stream for testing
   */
  private startMockStream(): void {
    let lastPace = 300; // 5:00 min/km
    let lastHR = 140;
    let currentGrade = 0;
    let mockRunStartTime = Date.now();

    this.intervalId = setInterval(() => {
      const now = Date.now();
      const elapsed = now - mockRunStartTime;

      // Simulate climb detection with varying grades
      if (elapsed > 30000 && elapsed < 60000) {
        currentGrade = 5; // 5% grade
      } else if (elapsed > 120000 && elapsed < 150000) {
        currentGrade = 8; // 8% grade
      } else {
        currentGrade = Math.random() * 2 - 1; // Small variations
      }

      // Adjust pace based on grade
      if (currentGrade > 3) {
        lastPace = lastPace * (1 + Math.random() * 0.02); // Slow down
        lastHR = Math.min(180, lastHR + Math.random() * 2); // HR increases
      } else {
        lastPace = Math.max(250, lastPace * (1 - Math.random() * 0.01)); // Recover
        lastHR = Math.max(120, lastHR - Math.random() * 0.5);
      }

      const dataPoint: GarminRunDataPoint = {
        timestamp: now,
        latitude: 37.7749 + Math.random() * 0.01,
        longitude: -122.4194 + Math.random() * 0.01,
        elevation: 100 + Math.random() * 50 + (currentGrade * elapsed / 1000),
        heartRate: Math.round(lastHR),
        pace: Math.round(lastPace),
        grade: Math.round(currentGrade * 10) / 10,
        distance: Math.round((elapsed / 1000) * (1000 / lastPace) * 1000),
        speed: 1000 / lastPace,
      };

      this.config.onDataPoint?.(dataPoint);
    }, this.config.pollInterval);
  }

  /**
   * Start real Garmin Connect API data stream
   * This requires implementing the Garmin Connect Health API
   */
  private async startRealStream(): Promise<void> {
    // TODO: Implement real Garmin Connect API integration
    // This would involve:
    // 1. Fetching activities via Garmin Connect API
    // 2. Polling for real-time activity data during active runs
    // 3. Parsing activity JSON response
    console.warn('Real Garmin stream not yet implemented - using mock mode');
    this.startMockStream();
  }
}

/**
 * Create a new data stream instance
 */
export function createDataStream(config: DataStreamConfig): GarminDataStream {
  return new GarminDataStream(config);
}
