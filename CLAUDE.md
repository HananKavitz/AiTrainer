# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AiTrainer is an Expo (React Native) application using the latest Expo SDK (~54.0) and Expo Router for file-based routing. The app uses TypeScript with strict mode enabled and supports both light and dark themes with automatic color scheme detection.

## Commands

### Development
- `npm start` - Start the Expo development server (press `w` for web, `a` for Android, `i` for iOS)
- `npm run android` - Start with Android emulator
- `npm run ios` - Start with iOS simulator
- `npm run web` - Start web version
- `npm run lint` - Run ESLint

### Reset
- `npm run reset-project` - Moves the starter code to `app-example` and creates a blank `app` directory

## Architecture

### File-Based Routing (Expo Router)
The app uses Expo Router with file-based routing:

- `app/_layout.tsx` - Root layout with Stack navigator, handles theme provider
- `app/(tabs)/_layout.tsx` - Tab navigation layout (Bottom Tabs)
- `app/(tabs)/index.tsx` - Home tab screen
- `app/(tabs)/explore.tsx` - Explore tab screen
- `app/modal.tsx` - Modal screen with presentation mode

Routes are grouped using parentheses `(tabs)` for file organization without affecting URL structure.

### Theme System
The app supports automatic light/dark theme switching:

- `constants/theme.ts` - Defines `Colors` and `Fonts` for both light and dark modes
- `hooks/use-color-scheme.ts` - Wrapper around `useColorScheme` from react-native
- `hooks/use-theme-color.ts` - Hook to access theme colors, supports prop overrides
- `components/themed-view.tsx` and `components/themed-text.tsx` - Components that automatically adapt to current theme

### Component Library
Reusable components in `components/`:

- `themed-view.tsx`, `themed-text.tsx` - Theme-aware base components
- `parallax-scroll-view.tsx` - ScrollView with parallax header effect (uses react-native-reanimated)
- `haptic-tab.tsx` - Tab bar button with haptic feedback
- `hello-wave.tsx` - Animated greeting component
- `external-link.tsx` - External link handling
- `ui/icon-symbol.tsx` - Icon component using SF Symbols
- `ui/collapsible.tsx` - Collapsible/accordion component

### TypeScript Configuration
- Uses `@/*` path alias mapped to project root (configured in `tsconfig.json`)
- Strict mode enabled
- Extends `expo/tsconfig.base`

### Key Technologies
- **Expo Router** - File-based navigation with Stack and Tabs navigators
- **React Native Reanimated** - Animations and gesture handling
- **expo-haptics** - Haptic feedback
- **expo-symbols** - SF Symbols for icons (iOS)

### Expo Configuration
Located in `app.json`:
- New Architecture enabled (`newArchEnabled: true`)
- Typed routes enabled (`experiments.typedRoutes`)
- React Compiler enabled (`experiments.reactCompiler`)
- Automatic UI style for theme switching
- Deep linking scheme: `aitrainer://`

### Platform-Specific Files
- `hooks/use-color-scheme.web.ts` - Web-specific implementation (platform files can use `.web`, `.ios`, `.android` extensions)
- `components/ui/icon-symbol.ios.tsx` - iOS-specific icon implementation
