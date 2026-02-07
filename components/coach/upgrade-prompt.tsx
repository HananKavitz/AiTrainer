import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

interface UpgradePromptProps {
  visible: boolean;
  onClose: () => void;
  onSubscribe: () => void;
  isLoading?: boolean;
}

export function UpgradePrompt({ visible, onClose, onSubscribe, isLoading }: UpgradePromptProps) {
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({ light: '#0070f3', dark: '#0a84ff' }, 'tint');

  const benefits = [
    'Unlimited coaching sessions',
    'Multiple coach tones',
    'Advanced coaching features',
    'Priority support',
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <ThemedView style={styles.container}>
          <View style={styles.header}>
            <IconSymbol name="crown.fill" size={40} color="#FFD700" />
            <ThemedText type="title" style={styles.title}>
              Upgrade to Pro
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              You've used your free coaching sessions this week
            </ThemedText>
          </View>

          <View style={styles.benefits}>
            {benefits.map((benefit, index) => (
              <View key={index} style={styles.benefit}>
                <IconSymbol name="checkmark.circle.fill" size={20} color={tintColor} />
                <ThemedText style={styles.benefitText}>{benefit}</ThemedText>
              </View>
            ))}
          </View>

          <View style={styles.price}>
            <ThemedText type="subtitle">€7.99/month</ThemedText>
            <ThemedText style={styles.priceNote}>Cancel anytime</ThemedText>
          </View>

          <View style={styles.buttons}>
            <Pressable
              style={({ pressed }) => [
                styles.subscribeButton,
                { backgroundColor },
                pressed && styles.pressed,
              ]}
              onPress={onSubscribe}
              disabled={isLoading}>
              {isLoading ? (
                <ThemedText style={styles.subscribeText}>Loading...</ThemedText>
              ) : (
                <ThemedText style={styles.subscribeText}>Subscribe Now</ThemedText>
              )}
            </Pressable>

            <Pressable style={styles.closeButton} onPress={onClose}>
              <ThemedText style={styles.closeText}>Maybe Later</ThemedText>
            </Pressable>
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    marginTop: 12,
  },
  subtitle: {
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.8,
  },
  benefits: {
    width: '100%',
    marginBottom: 24,
    gap: 12,
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitText: {
    fontSize: 16,
  },
  price: {
    alignItems: 'center',
    marginBottom: 24,
  },
  priceNote: {
    fontSize: 12,
    opacity: 0.7,
  },
  buttons: {
    width: '100%',
    gap: 12,
  },
  subscribeButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  subscribeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeText: {
    fontSize: 14,
    opacity: 0.7,
  },
  pressed: {
    opacity: 0.8,
  },
});
