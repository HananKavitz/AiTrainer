import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useThemeColor } from '@/hooks/use-theme-color';

export interface MainMetricDisplayProps {
  value: string;
  unit: string;
  loading?: boolean;
  progress?: number; // 0-1 for circular progress ring
  subtitle?: string;
}

/**
 * Large circular card showing primary metric (speed/pace) with:
 * - Large value display (64px font)
 * - Unit label below value
 * - Optional circular progress indicator using react-native-svg
 * - Loading state support
 */
export function MainMetricDisplay({
  value,
  unit,
  loading = false,
  progress,
  subtitle,
}: MainMetricDisplayProps) {
  const textInverted = useThemeColor({}, 'textInverted');
  const textInvertedSecondary = useThemeColor({}, 'textInvertedSecondary');

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.circlePlaceholder} />
        <Text style={[styles.valuePlaceholder, { color: textInvertedSecondary }]}>
          Loading...
        </Text>
      </View>
    );
  }

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = progress !== undefined
    ? circumference - (progress * circumference)
    : circumference;

  return (
    <View style={styles.container}>
      <Svg width={200} height={200} style={styles.svg}>
        {/* Background circle */}
        <Circle
          cx="100"
          cy="100"
          r={radius}
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="8"
          fill="transparent"
        />
        {/* Progress circle */}
        {progress !== undefined && (
          <Circle
            cx="100"
            cy="100"
            r={radius}
            stroke="#FFFFFF"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={progressOffset}
            strokeLinecap="round"
            rotation={-90}
            origin="100, 100"
          />
        )}
      </Svg>
      <View style={styles.textContainer}>
        <Text style={[styles.value, { color: textInverted }]}>{value}</Text>
        <Text style={[styles.unit, { color: textInvertedSecondary }]}>{unit}</Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: textInvertedSecondary }]}>{subtitle}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 200,
    position: 'relative',
  },
  svg: {
    position: 'absolute',
  },
  circlePlaceholder: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: -1,
  },
  unit: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 8,
  },
  valuePlaceholder: {
    fontSize: 16,
    fontWeight: '500',
  },
});
