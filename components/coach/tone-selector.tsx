import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { CoachTone } from '@/types/coach';

interface ToneOption {
  value: CoachTone;
  label: string;
  icon: string;
}

interface ToneSelectorProps {
  selectedTone: CoachTone;
  onSelect: (tone: CoachTone) => void;
  disabled?: boolean;
}

const TONES: ToneOption[] = [
  { value: 'encouraging', label: 'Encouraging', icon: 'heart.fill' },
  { value: 'motivational', label: 'Motivational', icon: 'bolt.fill' },
  { value: 'funny', label: 'Funny', icon: 'face.smiling.fill' },
];

export function ToneSelector({ selectedTone, onSelect, disabled }: ToneSelectorProps) {
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({ light: '#e0e0e0', dark: '#333' }, 'text');

  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>Tone</ThemedText>
      <View style={styles.options}>
        {TONES.map((tone) => {
          const isSelected = tone.value === selectedTone;
          const isEncouragingOnly = tone.value !== 'encouraging';
          const isDisabled = disabled || isEncouragingOnly;

          return (
            <Pressable
              key={tone.value}
              style={({ pressed }) => [
                styles.option,
                isSelected && styles.selected,
                isDisabled && styles.disabledOption,
                { borderColor },
                isSelected && { borderColor: tintColor, backgroundColor: `${tintColor}20` },
                pressed && !isDisabled && styles.pressed,
              ]}
              onPress={() => onSelect(tone.value)}
              disabled={isDisabled}>
              <IconSymbol
                name={tone.icon}
                size={20}
                color={isSelected ? tintColor : isDisabled ? '#999' : textColor}
              />
              <ThemedText
                style={[
                  styles.optionLabel,
                  isSelected && styles.selectedLabel,
                  isDisabled && styles.disabledText,
                ]}>
                {tone.label}
              </ThemedText>
              {isEncouragingOnly && (
                <ThemedText style={styles.comingSoon}>Soon</ThemedText>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  options: {
    flexDirection: 'row',
    gap: 12,
  },
  option: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 2,
    position: 'relative',
  },
  selected: {
    borderWidth: 2,
  },
  disabledOption: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.7,
  },
  optionLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  selectedLabel: {
    fontWeight: '700',
  },
  disabledText: {
    opacity: 0.7,
  },
  comingSoon: {
    fontSize: 10,
    position: 'absolute',
    top: 4,
    right: 4,
    opacity: 0.6,
  },
});
