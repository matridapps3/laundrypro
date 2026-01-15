import { Tabs } from 'expo-router';
import { View } from 'react-native'
import React from 'react';
import Navbar from '../../components/ui/Navbar.jsx';
import TabBar from '../../components/ui/TabBar.jsx';
import BottomBar from '../../components/ui/BottomBar.jsx';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <View style={{flex:1}}>
      <Navbar />
      <TabBar />
    <Tabs
      screenOptions={{
        tabBarStyle: { 
      display: 'none' 
      },
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="overview"
        options={{
          title: 'Overview',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
    </Tabs>
    <BottomBar />
    </View>
  );
}
