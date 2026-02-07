import React, { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

export interface GlassCardProps {
  children: ReactNode;
  style?: any;
}

/**
 * Elevated card with semi-transparent background and subtle border
 * for glassmorphism effect. Automatically adapts to the current theme.
 */
export function GlassCard({ children, style }: GlassCardProps) {
  const cardBackground = useThemeColor({}, 'card');
  const cardBorder = useThemeColor({}, 'cardBorder');

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: cardBackground,
          borderColor: cardBorder,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    // Glassmorphism shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
});
