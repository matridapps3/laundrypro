import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useRouter, usePathname } from 'expo-router'

const TabBar = () => {
  const router = useRouter()
  const pathname = usePathname()

  // Navigate to specified tab
  const navigateToTab = (tabName) => {
    router.push(`/(tabs)/${tabName}`)
  }

  // Check if a tab is currently active
  const isActive = (tabName) => {
    // Overview tab matches multiple paths (root, index, etc.)
    if (tabName === 'overview') {
      return pathname === `/(tabs)/overview` || pathname === `/overview` || pathname === `/(tabs)` || pathname === `/` || pathname === `/index`
    }
    return pathname === `/(tabs)/${tabName}` || pathname === `/${tabName}`
  }

  // Reusable tab button component with active state styling
  const TabButton = ({ tabName, label }) => {
    const active = isActive(tabName)
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', height: '100%', position: 'relative'}}>
        <Pressable 
          onPress={() => navigateToTab(tabName)} 
          style={({ pressed }) => ({
            paddingVertical: 10,
            paddingHorizontal: 12,
            borderRadius: 8,
            opacity: pressed ? 0.7 : 1,
            backgroundColor: active ? 'rgba(96, 165, 250, 0.1)' : 'transparent',
            minWidth: 80,
            alignItems: 'center'
          })}
        >
          <Text style={{
            color: active ? '#60A5FA' : '#94A3B8', 
            fontSize: 15, 
            fontWeight: active ? '600' : '500',
            letterSpacing: 0.3
          }}>
            {label}
          </Text>
        </Pressable>
        {active && (
          <View style={{
            position: 'absolute', 
            bottom: 0, 
            left: '20%', 
            right: '20%', 
            height: 3, 
            backgroundColor: '#60A5FA', 
            borderRadius: 2,
            shadowColor: '#60A5FA',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.5,
            shadowRadius: 4,
            elevation: 3
          }} />
        )}
      </View>
    )
  }

  return (
    <View style={{
      height: 56, 
      width: '100%', 
      backgroundColor: '#1E293B', 
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      paddingLeft: 16, 
      paddingRight: 16,
      position: 'relative', 
      overflow: 'visible',
      borderBottomWidth: 1,
      borderBottomColor: '#334155',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3
    }}>
      <TabButton tabName="overview" label="Overview" />
      <TabButton tabName="send" label="Send" />
      <TabButton tabName="history" label="History" />
      <TabButton tabName="wardrobe" label="Wardrobe" />
    </View>
  )
}

export default TabBar

const styles = StyleSheet.create({})