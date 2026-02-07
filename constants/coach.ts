/**
 * Coaching thresholds and configuration
 */
export const COACHING_THRESHOLDS = {
  /** Grade threshold for climb detection (%) */
  GRADE_MIN_PERCENT: 3,

  /** Pace drop percentage vs baseline to trigger coaching (%) */
  PACE_DROP_PERCENT: 7,

  /** HR trend window for heart rate analysis (ms) */
  HR_TREND_WINDOW: 5 * 60 * 1000, // 5 minutes

  /** Minimum cooldown between coaching messages (ms) */
  MESSAGE_COOLDOWN: 60 * 1000, // 60 seconds

  /** Minimum run duration before first coaching (ms) */
  MIN_RUN_DURATION: 5 * 60 * 1000, // 5 minutes
};

/**
 * Audio message paths
 */
export const AUDIO_MESSAGES = {
  CLIMB_1: require('@/assets/audio/encouraging/climb_1.mp3'),
  CLIMB_2: require('@/assets/audio/encouraging/climb_2.mp3'),
  CLIMB_3: require('@/assets/audio/encouraging/climb_3.mp3'),
  CLIMB_4: require('@/assets/audio/encouraging/climb_4.mp3'),
  CLIMB_5: require('@/assets/audio/encouraging/climb_5.mp3'),
} as const;

/**
 * Coaching message text (for display when audio plays)
 */
export const COACHING_MESSAGES = {
  CLIMB_1: 'Ease the pace. Shorten your stride. You\'re doing fine.',
  CLIMB_2: 'This climb counts. Breathe steady.',
  CLIMB_3: 'Slow is strong. Stay tall.',
  CLIMB_4: 'You didn\'t come this far to stop.',
  CLIMB_5: 'Control the effort, not the hill.',
} as const;

/**
 * Free tier limits
 */
export const FREE_TIER_LIMITS = {
  /** Maximum coached runs per week */
  MAX_COACHED_RUNS_PER_WEEK: 2,

  /** Week starts on Monday (ISO week) */
  WEEK_START_DAY: 1, // Monday
};

/**
 * Pro subscription pricing
 */
export const PRO_SUBSCRIPTION = {
  /** Monthly price in cents */
  PRICE_EUROS: 799, // €7.99

  /** Product IDs for different platforms */
  PRODUCT_IDS: {
    IOS_MONTHLY: 'aitrainer.pro.monthly',
    ANDROID_MONTHLY: 'aitrainer_pro_monthly',
  },
};
