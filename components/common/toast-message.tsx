import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastMessageProps {
  message: string;
  type?: ToastType;
  duration?: number;
  visible: boolean;
  onDismiss: () => void;
}

export function ToastMessage({
  message,
  type = 'info',
  duration = 3000,
  visible,
  onDismiss,
}: ToastMessageProps) {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        dismiss();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const dismiss = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => onDismiss());
  };

  if (!visible) return null;

  const icon = getIconForType(type);
  const backgroundColor = getBackgroundColor(type);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, backgroundColor }]}>
      <IconSymbol name={icon} size={20} color="#fff" />
      <ThemedText style={styles.message}>{message}</ThemedText>
    </Animated.View>
  );
}

function getIconForType(type: ToastType): string {
  switch (type) {
    case 'success':
      return 'check-circle';
    case 'error':
      return 'cancel';
    case 'warning':
      return 'warning';
    case 'info':
    default:
      return 'info';
  }
}

function getBackgroundColor(type: ToastType): string {
  switch (type) {
    case 'success':
      return '#34C759';
    case 'error':
      return '#FF3B30';
    case 'warning':
      return '#FF9500';
    case 'info':
    default:
      return '#0070f3';
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  message: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
});
