import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import React, { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

export default function CustomSplashScreen({ onFinish }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const backgroundColor = isDark ? '#1E293B' : '#F8FAFC';
  const textColor = isDark ? '#FFFFFF' : '#1E293B';

  useEffect(() => {
    // Hide native splash screen immediately
    SplashScreen.hideAsync().catch(() => {});
    
    // Show custom splash screen for a brief moment
    const timer = setTimeout(() => {
      if (onFinish) {
        onFinish();
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.text, { color: textColor }]}>LaundryPro</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 36,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
