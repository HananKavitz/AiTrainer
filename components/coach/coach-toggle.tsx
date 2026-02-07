import React from 'react';
import { Switch, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

interface CoachToggleProps {
  isOn: boolean;
  onToggle: (value: boolean) => void;
  disabled?: boolean;
}

export function CoachToggle({ isOn, onToggle, disabled }: CoachToggleProps) {
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');

  return (
    <ThemedView style={styles.container}>
      <View style={styles.row}>
        <ThemedText style={[styles.label, disabled && styles.disabled]}>
          Coach {isOn ? 'ON' : 'OFF'}
        </ThemedText>
        <Switch
          value={isOn}
          onValueChange={onToggle}
          disabled={disabled}
          trackColor={{ false: '#767577', true: tintColor }}
          thumbColor={isOn ? '#fff' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});
