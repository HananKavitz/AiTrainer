import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { GradientBackground } from '@/components/ui/gradient-background';
import { GlassCard } from '@/components/ui/glass-card';
import { ActionButton } from '@/components/ui/action-button';
import { MainMetricDisplay } from '@/components/run/main-metric-display';
import { SecondaryMetricCard } from '@/components/run/secondary-metric-card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { UpgradePrompt } from '@/components/coach/upgrade-prompt';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { useCoachStore, persistCoachState , initCoachStore } from '@/stores/coach-store';
import { useUserStore, persistUserState , initUserStore } from '@/stores/user-store';
import { initAudioPlayer } from '@/audio/player';

interface RunMetrics {
  speed: string;
  heartRate: string;
  distance: string;
  duration: string;
  elevation: string;
}

interface TrendData {
  heartRate?: { value: number; isGood?: boolean };
  distance?: { value: number; isGood?: boolean };
}

export default function HomeScreen() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [metrics, setMetrics] = useState<RunMetrics>({
    speed: '--',
    heartRate: '--',
    distance: '0.00',
    duration: '00:00',
    elevation: '0',
  });
  const [trends, setTrends] = useState<TrendData>({});

  const coachStatus = useCoachStore((state) => state.status);
  const setCoachStatus = useCoachStore((state) => state.setCoachStatus);

  const garminConnected = useUserStore((state) => state.garminConnection.isConnected);
  const garminUserId = useUserStore((state) => state.garminConnection.userId);
  const setGarminConnection = useUserStore((state) => state.setGarminConnection);
  const subscriptionTier = useUserStore((state) => state.subscription.tier);
  const [coachedRunsThisWeek, setCoachedRunsThisWeek] = useState(0);

  // Initialize app state
  useEffect(() => {
    async function initialize() {
      try {
        await Promise.all([
          initCoachStore(),
          initUserStore(),
          initAudioPlayer(),
        ]);
        // Load coached runs count from storage
        const { loadUserData, checkWeeklyReset } = await import('@/services/storage');
        await checkWeeklyReset();
        const data = await loadUserData();
        setCoachedRunsThisWeek(data.coachedRunsThisWeek || 0);
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        setIsInitializing(false);
      }
    }
    initialize();
  }, []);

  // Persist coach state when it changes
  useEffect(() => {
    if (!isInitializing) {
      persistCoachState();
    }
  }, [coachStatus, isInitializing]);

  // Simulate run metrics when running
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setMetrics((prev) => {
        const distance = parseFloat(prev.distance) + 0.01;
        const [minutes, seconds] = prev.duration.split(':').map(Number);
        const totalSeconds = minutes * 60 + seconds + 1;
        const newMinutes = Math.floor(totalSeconds / 60);
        const newSeconds = totalSeconds % 60;
        const speed = isRunning ? (6 + Math.random() * 2).toFixed(2) : '--';

        return {
          speed,
          heartRate: isRunning ? Math.floor(120 + Math.random() * 40).toString() : '--',
          distance: distance.toFixed(2),
          duration: `${newMinutes.toString().padStart(2, '0')}:${newSeconds.toString().padStart(2, '0')}`,
          elevation: isRunning ? Math.floor(distance * 5 + Math.random() * 10).toString() : '0',
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  // Handle run toggle
  const handleRunToggle = async () => {
    if (!garminConnected) {
      // Show connect Garmin prompt
      await handleGarminConnect();
      return;
    }

    if (coachStatus === 'off') {
      // Auto-turn on coach if starting a run
      setCoachStatus('on');
    }

    setIsRunning(!isRunning);

    if (!isRunning) {
      // Starting a run
      setMetrics({
        speed: '0.00',
        heartRate: '--',
        distance: '0.00',
        duration: '00:00',
        elevation: '0',
      });
      setTrends({});
    } else {
      // Stopping a run - check for upgrade prompt
      if (subscriptionTier === 'free' && coachedRunsThisWeek >= 2) {
        setShowUpgradePrompt(true);
      }
    }
  };

  // Handle Garmin connect
  const handleGarminConnect = async () => {
    setIsConnecting(true);
    try {
      // Mock connection - replace with real OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockUserId = 'garmin_user_' + Math.random().toString(36).substr(2, 9);
      setGarminConnection({
        isConnected: true,
        userId: mockUserId,
        accessToken: 'mock_token',
        refreshToken: 'mock_refresh',
        tokenExpiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
      });
      await persistUserState();
    } catch (error) {
      console.error('Failed to connect Garmin:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  // Handle upgrade subscription
  const handleUpgrade = async () => {
    setUpgradeLoading(true);
    try {
      // Mock purchase flow
      await new Promise(resolve => setTimeout(resolve, 2000));
      const { updateUserData } = await import('@/services/storage');
      await updateUserData({
        subscriptionTier: 'pro',
        subscriptionStatus: 'active',
        subscriptionExpiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
      });
      await initUserStore();
      setShowUpgradePrompt(false);
    } catch (error) {
      console.error('Failed to upgrade:', error);
    } finally {
      setUpgradeLoading(false);
    }
  };

  if (isInitializing) {
    return <LoadingSpinner fullScreen message="Loading..." />;
  }

  const runProgress = isRunning ? 0.65 : undefined;

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <ThemedText type="invertedLarge" style={styles.headerTitle}>
              Today&apos;s Run
            </ThemedText>
            <TouchableOpacity
              onPress={() => setCoachStatus(coachStatus === 'on' ? 'off' : 'on')}
              style={styles.coachToggle}
            >
              <IconSymbol
                name={coachStatus === 'on' ? 'speaker.wave.2.fill' : 'speaker.slash.fill'}
                size={20}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>

          {/* Main Metric Display */}
          <View style={styles.mainMetricContainer}>
            <MainMetricDisplay
              value={isRunning ? metrics.speed : '--'}
              unit="km/h"
              loading={!isRunning && garminConnected}
              progress={runProgress}
              subtitle={isRunning ? 'Current Pace' : 'Ready to Run'}
            />
          </View>

          {/* Secondary Metrics Grid */}
          <View style={styles.metricsGrid}>
            <View style={styles.metricsRow}>
              <GlassCard style={styles.metricCard}>
                <SecondaryMetricCard
                  iconName="heart.fill"
                  value={metrics.heartRate}
                  unit="bpm"
                  label="Heart Rate"
                  trend={trends.heartRate}
                  loading={!isRunning}
                />
              </GlassCard>
              <GlassCard style={styles.metricCard}>
                <SecondaryMetricCard
                  iconName="map.fill"
                  value={metrics.distance}
                  unit="km"
                  label="Distance"
                  trend={trends.distance}
                  loading={!isRunning}
                />
              </GlassCard>
            </View>
            <View style={styles.metricsRow}>
              <GlassCard style={styles.metricCard}>
                <SecondaryMetricCard
                  iconName="clock.fill"
                  value={metrics.duration}
                  unit="min"
                  label="Duration"
                  loading={!isRunning}
                />
              </GlassCard>
              <GlassCard style={styles.metricCard}>
                <SecondaryMetricCard
                  iconName="mountain.2.fill"
                  value={metrics.elevation}
                  unit="m"
                  label="Elevation"
                  loading={!isRunning}
                />
              </GlassCard>
            </View>
          </View>

          {/* Coach Status Widget */}
          <GlassCard style={styles.coachWidget}>
            <View style={styles.coachWidgetHeader}>
              <View style={styles.coachWidgetTitleRow}>
                <IconSymbol name="bolt.fill" size={20} color={coachStatus === 'on' ? '#10B981' : '#6B7280'} />
                <ThemedText style={styles.coachWidgetTitle}>
                  AI Coach
                </ThemedText>
              </View>
              <ThemedText
                style={[
                  styles.coachStatusBadge,
                  { color: coachStatus === 'on' ? '#10B981' : '#6B7280' },
                ]}
              >
                {coachStatus === 'on' ? 'ON' : 'OFF'}
              </ThemedText>
            </View>
            <ThemedText style={styles.coachWidgetText}>
              {coachStatus === 'on'
                ? 'Your coach will provide encouragement during uphill climbs.'
                : 'Tap the speaker icon to enable coaching.'}
            </ThemedText>
          </GlassCard>

          {/* Garmin Connection Status */}
          <GlassCard style={styles.garminWidget}>
            <View style={styles.garminWidgetContent}>
              <IconSymbol
                name={garminConnected ? 'checkmark.circle.fill' : 'xmark.circle.fill'}
                size={20}
                color={garminConnected ? '#10B981' : '#EF4444'}
              />
              <View style={styles.garminWidgetText}>
                <ThemedText style={styles.garminWidgetTitle}>
                  {garminConnected ? 'Garmin Connected' : 'Connect Garmin'}
                </ThemedText>
                <ThemedText style={styles.garminWidgetSubtitle}>
                  {garminConnected
                    ? garminUserId
                    : 'Required for live coaching'}
                </ThemedText>
              </View>
              {!garminConnected && (
                <ActionButton
                  title="Connect"
                  loading={isConnecting}
                  onPress={handleGarminConnect}
                  type="secondary"
                  style={styles.connectButton}
                />
              )}
            </View>
          </GlassCard>

          {/* Spacer for fixed button */}
          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Fixed Action Button */}
        <View style={styles.buttonContainer}>
          <ActionButton
            title={isRunning ? 'Stop Run' : garminConnected ? 'Start Run' : 'Connect Garmin'}
            loading={isConnecting}
            onPress={isConnecting ? undefined : handleRunToggle}
            type={isRunning ? 'danger' : 'primary'}
          />
        </View>
      </SafeAreaView>

      <UpgradePrompt
        visible={showUpgradePrompt}
        onClose={() => setShowUpgradePrompt(false)}
        onSubscribe={handleUpgrade}
        isLoading={upgradeLoading}
      />
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  coachToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainMetricContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  metricsGrid: {
    marginBottom: 24,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metricCard: {
    flex: 1,
    marginHorizontal: 4,
  },
  coachWidget: {
    padding: 16,
    marginBottom: 16,
  },
  coachWidgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  coachWidgetTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  coachWidgetTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  coachStatusBadge: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  coachWidgetText: {
    fontSize: 13,
    opacity: 0.8,
  },
  garminWidget: {
    padding: 16,
    marginBottom: 16,
  },
  garminWidgetContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  garminWidgetText: {
    flex: 1,
    marginLeft: 12,
  },
  garminWidgetTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  garminWidgetSubtitle: {
    fontSize: 13,
    opacity: 0.7,
  },
  connectButton: {
    width: 100,
    marginLeft: 12,
  },
  bottomSpacer: {
    height: 20,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'transparent',
    ...(Platform.OS === 'android' && {
      paddingBottom: 30,
    }),
  },
});
