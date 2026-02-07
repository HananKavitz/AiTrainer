/**
 * Garmin user profile data
 */
export interface GarminUserProfile {
  userId: string;
  displayName: string;
  email?: string;
  avatarUrl?: string;
}

/**
 * Garmin connection status
 */
export interface GarminConnection {
  isConnected: boolean;
  userId: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  tokenExpiresAt: number | null;
}

/**
 * Garmin run data point - single data point from a run
 */
export interface GarminRunDataPoint {
  timestamp: number;
  latitude?: number;
  longitude?: number;
  elevation?: number;
  heartRate?: number; // BPM
  pace?: number; // seconds per km
  grade?: number; // percentage
  distance?: number; // meters
  speed?: number; // meters per second
}

/**
 * Garmin run data - collection of data points for a run
 */
export interface GarminRunData {
  runId: string;
  startTime: number;
  endTime: number;
  dataPoints: GarminRunDataPoint[];
}
