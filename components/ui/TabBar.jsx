import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useRouter, usePathname } from 'expo-router'

const TabBar = () => {
  const router = useRouter()
  const pathname = usePathname()

  const navigateToTab = (tabName) => {
    router.push(`/(tabs)/${tabName}`)
  }

  const isActive = (tabName) => {
    return pathname === `/(tabs)/${tabName}` || pathname === `/${tabName}`
  }

  return (
    <View style={{height:52, width:'100%', color:'white', backgroundColor:'#1E293B', flexDirection: 'row', alignItems:'center', justifyContent:'space-between', paddingLeft:32, paddingRight:32}}>
      <Pressable onPress={() => navigateToTab('overview')}>
        <Text style={{color: isActive('overview') ? '#60A5FA' : 'white', fontSize:17, fontWeight:500}}>Overview</Text>
      </Pressable>
      <Pressable onPress={() => navigateToTab('send')}>
        <Text style={{color: isActive('send') ? '#60A5FA' : 'white', fontSize:17, fontWeight:500}}>Send</Text>
      </Pressable>
      <Pressable onPress={() => navigateToTab('history')}>
        <Text style={{color: isActive('history') ? '#60A5FA' : 'white', fontSize:17, fontWeight:500}}>History</Text>
      </Pressable>
      <Pressable onPress={() => navigateToTab('wardrobe')}>
        <Text style={{color: isActive('wardrobe') ? '#60A5FA' : 'white', fontSize:17, fontWeight:500}}>Wardrobe</Text>
      </Pressable>
    </View>
  )
}

export default TabBar

const styles = StyleSheet.create({})