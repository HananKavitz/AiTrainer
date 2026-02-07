/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    // Gradient colors
    gradientStart: '#3B82F6',
    gradientEnd: '#8B5CF6',
    // Card colors (glassmorphism)
    card: 'rgba(255, 255, 255, 0.9)',
    cardBorder: 'rgba(0, 0, 0, 0.08)',
    // Metric colors
    primaryMetric: '#111827',
    secondaryMetric: '#374151',
    metricUnit: '#6B7280',
    // Status colors
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    // Inverted text (for dark backgrounds)
    textInverted: '#FFFFFF',
    textInvertedSecondary: 'rgba(255, 255, 255, 0.8)',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    // Gradient colors
    gradientStart: '#1E3A8A',
    gradientEnd: '#581C87',
    // Card colors (glassmorphism)
    card: 'rgba(255, 255, 255, 0.08)',
    cardBorder: 'rgba(255, 255, 255, 0.1)',
    // Metric colors
    primaryMetric: '#FFFFFF',
    secondaryMetric: '#E5E7EB',
    metricUnit: '#9CA3AF',
    // Status colors
    success: '#34D399',
    warning: '#FBBF24',
    danger: '#F87171',
    // Inverted text (for dark backgrounds)
    textInverted: '#FFFFFF',
    textInvertedSecondary: 'rgba(255, 255, 255, 0.8)',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
