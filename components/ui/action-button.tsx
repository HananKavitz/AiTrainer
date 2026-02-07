import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColor } from '@/hooks/use-theme-color';

export interface ActionButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  type?: 'primary' | 'secondary' | 'danger' | 'success';
}

/**
 * Large, prominent action button with gradient fill, pill shape,
 * loading state with spinner, and full-width layout.
 */
export function ActionButton({
  title,
  loading = false,
  type = 'primary',
  disabled,
  style,
  ...props
}: ActionButtonProps) {
  const gradientStart = useThemeColor({}, 'gradientStart');
  const gradientEnd = useThemeColor({}, 'gradientEnd');

  const getGradientColors = (): readonly [string, string] => {
    if (type === 'danger') {
      return ['#EF4444', '#DC2626'];
    }
    if (type === 'success') {
      return ['#10B981', '#059669'];
    }
    if (type === 'secondary') {
      return ['#6B7280', '#4B5563'];
    }
    return [gradientStart, gradientEnd];
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      disabled={isDisabled}
      activeOpacity={0.8}
      {...props}
    >
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.button,
          isDisabled && styles.buttonDisabled,
        ]}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Text style={styles.buttonText}>{title}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
