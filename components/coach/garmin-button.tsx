import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

interface GarminButtonProps {
  isConnected: boolean;
  isLoading?: boolean;
  onPress: () => void;
  userName?: string;
}

export function GarminButton({ isConnected, isLoading, onPress, userName }: GarminButtonProps) {
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({ light: '#0070f3', dark: '#0a84ff' }, 'tint');

  if (isConnected && userName) {
    return (
      <View style={[styles.container, styles.connectedContainer]}>
        <IconSymbol name="checkmark.circle.fill" size={20} color={tintColor} />
        <ThemedText style={styles.connectedText}>Connected as {userName}</ThemedText>
      </View>
    );
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { backgroundColor },
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      disabled={isLoading}>
      {isLoading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <>
          <IconSymbol name="figure.run" size={20} color="#fff" style={styles.icon} />
          <ThemedText style={styles.buttonText}>Connect Garmin</ThemedText>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  connectedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'transparent',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    minWidth: 200,
  },
  pressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  connectedText: {
    fontSize: 16,
  },
  icon: {
    width: 20,
  },
});
