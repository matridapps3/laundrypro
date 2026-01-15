import { View, Text, Image, Pressable } from 'react-native'
import React from 'react'

const BottomBar = () => {
  return (
    <View style={{height:80, width:'100%', position:'absolute', bottom:0, left:0, color:'white', backgroundColor:'#e0e2e9', flexDirection: 'row', alignItems:'center', justifyContent:'space-between', paddingLeft:28, paddingRight:28}}>
      <Pressable style={{flexDirection:'row', gap:4, alignItems:'center'}}>
        <Image source={require('../../assets/images/backup.png')} style={{height:24, width:24}}></Image>
        <Text style={{fontSize:16, fontWeight:500}}>Backup</Text>
      </Pressable>
      
      <Pressable style={{flexDirection:'row', gap:4, alignItems:'center'}}>
        <Image source={require('../../assets/images/restore.png')} style={{height:24, width:24}}></Image>
        <Text style={{fontSize:16, fontWeight:500}}>Restore</Text>
      </Pressable>
    </View>
  )
}

export default BottomBar