import { Image, StyleSheet, Text, View, Platform } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar';

const Navbar = () => {
  return (
    <View style={{height: Platform.OS === 'web' ? 70 : 100, width:'100%', paddingTop: Platform.OS === 'web' ? 0 : 40, backgroundColor:'#1E293B', flexDirection: 'row', alignItems:'center', justifyContent:'flex-start', paddingLeft:20, borderBottomWidth:2, borderBlockColor:'gray'}}>
    <StatusBar 
        style="light" 
      />
      <Image source={require('../../assets/images/logo.png')} style={{width:140, height:24}}></Image>
    </View>
  )
}

export default Navbar

const styles = StyleSheet.create({})