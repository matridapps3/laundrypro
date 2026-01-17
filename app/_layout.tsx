import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React, { useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { WardrobeProvider } from '@/contexts/WardrobeContext';
import CustomSplashScreen from '@/components/CustomSplashScreen';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {isSplashVisible ? (
        <CustomSplashScreen onFinish={() => setIsSplashVisible(false)} />
      ) : (
        <WardrobeProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            </Stack>
            <StatusBar style="light" />
          </ThemeProvider>
        </WardrobeProvider>
      )}
    </GestureHandlerRootView>
  );
}
