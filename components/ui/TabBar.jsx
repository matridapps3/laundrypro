import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const TabBar = () => {
  return (
    <View style={{height:52, width:'100%', color:'white', backgroundColor:'#1E293B', flexDirection: 'row', alignItems:'center', justifyContent:'space-between', paddingLeft:32, paddingRight:32}}>
      <Pressable><Text style={{color:'white', fontSize:17, fontWeight:500}}>Overview</Text></Pressable>
      <Pressable><Text style={{color:'white', fontSize:17, fontWeight:500}}>Send</Text></Pressable>
      <Pressable><Text style={{color:'white', fontSize:17, fontWeight:500}}>History</Text></Pressable>
      <Pressable><Text style={{color:'white', fontSize:17, fontWeight:500}}>Wardrobe</Text></Pressable>
    </View>
  )
}

export default TabBar

const styles = StyleSheet.create({})