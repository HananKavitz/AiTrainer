import React, { type ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from '@/hooks/use-color-scheme';

export interface GradientBackgroundProps {
  children: ReactNode;
  style?: any;
}

/**
 * Reusable gradient background wrapper using expo-linear-gradient.
 * Automatically adapts to the current theme (light/dark).
 */
export function GradientBackground({ children, style }: GradientBackgroundProps) {
  const colorScheme = useColorScheme();
  const colors: readonly [string, string] =
    colorScheme === 'dark'
      ? ['#1E3A8A', '#581C87'] // Deep blue to purple
      : ['#3B82F6', '#8B5CF6']; // Blue to purple

  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, style]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
