import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { RunSummary } from '@/types/run';

interface SummaryCardProps {
  summary: RunSummary;
  onPress?: () => void;
}

export function SummaryCard({ summary, onPress }: SummaryCardProps) {
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(2)}km`;
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formattedDate = formatDate(summary.startTime);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [pressed && styles.pressed]}>
      <ThemedView style={styles.card}>
        <View style={styles.header}>
          <View style={styles.dateSection}>
            <IconSymbol name="figure.run" size={20} color={tintColor} />
            <ThemedText style={styles.date}>{formattedDate}</ThemedText>
          </View>
          {summary.isCoached && (
            <View style={styles.coachedBadge}>
              <IconSymbol name="speaker.wave.2.fill" size={14} color="#fff" />
              <ThemedText style={styles.coachedText}>Coach</ThemedText>
            </View>
          )}
        </View>

        <View style={styles.metrics}>
          <View style={styles.metric}>
            <ThemedText style={styles.metricValue}>{formatDistance(summary.distance)}</ThemedText>
            <ThemedText style={styles.metricLabel}>Distance</ThemedText>
          </View>

          <View style={styles.metric}>
            <ThemedText style={styles.metricValue}>{formatDuration(summary.duration)}</ThemedText>
            <ThemedText style={styles.metricLabel}>Duration</ThemedText>
          </View>

          {summary.averageHeartRate && (
            <View style={styles.metric}>
              <ThemedText style={styles.metricValue}>{summary.averageHeartRate}</ThemedText>
              <ThemedText style={styles.metricLabel}>Avg HR</ThemedText>
            </View>
          )}

          {summary.isCoached && (
            <View style={styles.metric}>
              <ThemedText style={styles.metricValue}>{summary.coachMessageCount}</ThemedText>
              <ThemedText style={styles.metricLabel}>Tips</ThemedText>
            </View>
          )}
        </View>

        {summary.coachingEvents.length > 0 && (
          <View style={styles.events}>
            <ThemedText style={styles.eventsLabel}>Coach spoke during climbs</ThemedText>
            {summary.coachingEvents.slice(0, 2).map((event) => (
              <ThemedText key={event.id} style={styles.eventMessage} numberOfLines={1}>
                "{event.message}"
              </ThemedText>
            ))}
            {summary.coachingEvents.length > 2 && (
              <ThemedText style={styles.moreEvents}>
                +{summary.coachingEvents.length - 2} more
              </ThemedText>
            )}
          </View>
        )}
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  pressed: {
    opacity: 0.8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
  },
  coachedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0070f3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  coachedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  metrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  metric: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  metricLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  events: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 12,
  },
  eventsLabel: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 8,
  },
  eventMessage: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  moreEvents: {
    fontSize: 12,
    opacity: 0.6,
  },
});
