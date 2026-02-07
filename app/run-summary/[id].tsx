import React from 'react';
import { StyleSheet, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { SummaryCard } from '@/components/run/summary-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRunStore } from '@/stores/run-store';
import { useThemeColor } from '@/hooks/use-theme-color';
import { RunSummary } from '@/types/run';

interface RunSummaryScreenProps {
  id: string;
}

export default function RunSummaryScreen({ id }: RunSummaryScreenProps) {
  const runHistory = useRunStore((state) => state.runHistory);
  const tintColor = useThemeColor({}, 'tint');
  const [summary, setSummary] = React.useState<RunSummary | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadSummary() {
      setIsLoading(true);
      // Find the run in history
      const run = runHistory.find(r => r.id === id);
      if (run) {
        setSummary(run);
      } else {
        // Mock summary for demo if not found in history
        setSummary(createMockSummary(id));
      }
      setIsLoading(false);
    }
    loadSummary();
  }, [id, runHistory]);

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading summary..." />;
  }

  if (!summary) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Run Not Found
        </ThemedText>
        <ThemedText>Unable to load run summary.</ThemedText>
      </ThemedView>
    );
  }

  const coachMessageCount = summary.coachingEvents.length;
  const climbEvents = summary.coachingEvents.filter(e => e.type === 'climb');

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Run Summary
      </ThemedText>

      <SummaryCard summary={summary} />

      <ThemedView style={styles.coachingSection}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Coaching Summary
        </ThemedText>

        <ThemedView style={styles.statRow}>
          <View style={styles.stat}>
            <IconSymbol name="speaker.wave.2.fill" size={24} color={tintColor} />
            <ThemedText style={styles.statValue}>{coachMessageCount}</ThemedText>
            <ThemedText style={styles.statLabel}>Tips</ThemedText>
          </View>

          <View style={styles.stat}>
            <IconSymbol name="figure.stand" size={24} color={tintColor} />
            <ThemedText style={styles.statValue}>{climbEvents.length}</ThemedText>
            <ThemedText style={styles.statLabel}>Climbs</ThemedText>
          </View>
        </ThemedView>

        {coachMessageCount > 0 && (
          <ThemedView style={styles.messageList}>
            <ThemedText style={styles.listTitle}>What your coach said:</ThemedText>
            {summary.coachingEvents.map((event) => (
              <ThemedView key={event.id} style={styles.messageItem}>
                <ThemedText style={styles.messageText}>"{event.message}"</ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        )}

        {coachMessageCount === 0 && (
          <ThemedView style={styles.noMessages}>
            <ThemedText style={styles.noMessagesText}>
              Your coach didn't speak during this run. You did great!
            </ThemedText>
          </ThemedView>
        )}
      </ThemedView>
    </ThemedView>
  );
}

/**
 * Create a mock run summary for demo purposes
 */
function createMockSummary(id: string): RunSummary {
  return {
    id,
    startTime: Date.now() - 30 * 60 * 1000,
    endTime: Date.now(),
    distance: 5000, // 5km
    duration: 30 * 60, // 30 minutes
    averageHeartRate: 145,
    averagePace: 360, // 6:00 min/km
    coachingEvents: [
      {
        id: 'event_1',
        type: 'climb',
        message: 'Ease the pace. Shorten your stride. You\'re doing fine.',
        timestamp: Date.now() - 25 * 60 * 1000,
        runId: id,
      },
      {
        id: 'event_2',
        type: 'climb',
        message: 'This climb counts. Breathe steady.',
        timestamp: Date.now() - 15 * 60 * 1000,
        runId: id,
      },
      {
        id: 'event_3',
        type: 'climb',
        message: 'Slow is strong. Stay tall.',
        timestamp: Date.now() - 5 * 60 * 1000,
        runId: id,
      },
    ],
    isCoached: true,
    coachMessageCount: 3,
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 20,
  },
  coachingSection: {
    marginTop: 20,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  stat: {
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  messageList: {
    gap: 12,
  },
  listTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  messageItem: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  messageText: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  noMessages: {
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  noMessagesText: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
});
