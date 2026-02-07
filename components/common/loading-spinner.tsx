import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  message?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({ size = 'large', message, fullScreen }: LoadingSpinnerProps) {
  const tintColor = useThemeColor({}, 'tint');

  const content = (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={tintColor} />
      {message && (
        <ThemedText style={styles.message}>{message}</ThemedText>
      )}
    </View>
  );

  if (fullScreen) {
    return (
      <ThemedView style={styles.fullScreen}>
        {content}
      </ThemedView>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  message: {
    marginTop: 12,
    fontSize: 16,
    opacity: 0.7,
  },
  fullScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
