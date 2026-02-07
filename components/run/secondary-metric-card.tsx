import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

export interface TrendIndicator {
  value: number; // Positive or negative percentage
  isGood?: boolean; // Whether the trend is good or bad
}

export interface SecondaryMetricCardProps {
  iconName: string;
  value: string;
  unit: string;
  label: string;
  trend?: TrendIndicator;
  loading?: boolean;
}

/**
 * Smaller cards for secondary metrics (heart rate, distance, duration, elevation):
 * - Icon for visual identification
 * - Value and unit display
 * - Optional trend indicator
 * - Grid-friendly layout
 */
export function SecondaryMetricCard({
  iconName,
  value,
  unit,
  label,
  trend,
  loading = false,
}: SecondaryMetricCardProps) {
  const primaryMetric = useThemeColor({}, 'primaryMetric');
  const secondaryMetric = useThemeColor({}, 'secondaryMetric');
  const metricUnit = useThemeColor({}, 'metricUnit');
  const success = useThemeColor({}, 'success');
  const danger = useThemeColor({}, 'danger');

  const renderTrend = () => {
    if (!trend) return null;

    const trendColor = trend.isGood !== false ? success : danger;
    const trendSymbol = trend.value >= 0 ? '▲' : '▼';
    const trendValue = Math.abs(trend.value);

    return (
      <View style={styles.trendContainer}>
        <Text style={[styles.trendSymbol, { color: trendColor }]}>
          {trendSymbol}
        </Text>
        <Text style={[styles.trendValue, { color: trendColor }]}>
          {trendValue}%
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <IconSymbol name={iconName} size={24} color={metricUnit} style={styles.icon} />
        <View style={styles.values}>
          <Text style={[styles.loadingValue, { color: secondaryMetric }]}>--</Text>
          <Text style={[styles.unit, { color: metricUnit }]}>{unit}</Text>
        </View>
        <Text style={[styles.label, { color: metricUnit }]}>{label}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconSymbol name={iconName} size={24} color={metricUnit} style={styles.icon} />
        {renderTrend()}
      </View>
      <View style={styles.values}>
        <Text style={[styles.value, { color: primaryMetric }]}>{value}</Text>
        <Text style={[styles.unit, { color: metricUnit }]}>{unit}</Text>
      </View>
      <Text style={[styles.label, { color: metricUnit }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'flex-start',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  icon: {
    opacity: 0.7,
  },
  values: {
    marginBottom: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: -0.5,
  },
  unit: {
    fontSize: 12,
    fontWeight: '500',
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    opacity: 0.7,
  },
  loadingValue: {
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: -0.5,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendSymbol: {
    fontSize: 12,
    fontWeight: '600',
    marginRight: 2,
  },
  trendValue: {
    fontSize: 12,
    fontWeight: '600',
  },
});
