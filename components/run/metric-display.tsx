import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

interface MetricDisplayProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: string;
  highlight?: boolean;
}

export function MetricDisplay({ label, value, unit, icon, highlight }: MetricDisplayProps) {
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({ light: '#e0e0e0', dark: '#333' }, 'text');

  return (
    <View style={[styles.container, { borderColor }]}>
      {icon && (
        <View style={styles.iconContainer}>
          <ThemedText style={styles.icon}>{icon}</ThemedText>
        </View>
      )}
      <View style={styles.content}>
        <ThemedText style={styles.label}>{label}</ThemedText>
        <View style={styles.valueRow}>
          <ThemedText style={[styles.value, highlight && styles.highlight]}>{value}</ThemedText>
          {unit && <ThemedText style={styles.unit}>{unit}</ThemedText>}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  iconContainer: {
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
  },
  highlight: {
    color: '#0070f3',
  },
  unit: {
    fontSize: 14,
    marginLeft: 4,
    opacity: 0.7,
  },
});
