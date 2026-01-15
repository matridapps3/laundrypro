import { StyleSheet, Text, View, ScrollView, TextInput, Pressable, Image } from 'react-native'
import React, { useState } from 'react'
import { useWardrobe } from '@/contexts/WardrobeContext'

const Wardrobe = () => {
  const[input, setInput] = useState("")
  const { wardrobeItems, addItem, deleteItem, incrementItem, decrementItem } = useWardrobe()

  const handleDelete = (i) => {
    deleteItem(i)
  }

  const handleAdd = () => {
    addItem(input)
    setInput("")
  }

  return (
    <ScrollView>
      <View style={{ flex: 1, padding: 18, backgroundColor: '#F8FAFC', gap:18}}>
        <View style={{borderWidth:1, borderRadius:8, borderColor:'silver', height:140, backgroundColor:'white', padding:18}}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Add New Item Type</Text>

           {/*This is a horizontal line for partition*/}
           <View style={{height: 1, backgroundColor: '#ccc', marginBottom:16}}/>

          <View style={{flexDirection:'row', gap:8}}>
            <TextInput style={{width:200, paddingLeft:6, paddingRight:6, height:40, borderWidth:1, borderRadius:8, borderColor:'silver'}} placeholder='e.g. Trousers' value={input} onChangeText={e => setInput(e)} />
            <Pressable style={{width:70, backgroundColor:'#2563EB', borderRadius:8, justifyContent:'center', alignItems:'center'}} onPress={handleAdd}><Text style={{ color:'white'}}>Add</Text></Pressable>
          </View>
        </View>

        <View style={{borderWidth:1, borderRadius:8, borderColor:'silver', height:'auto', backgroundColor:'white', padding:18}}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Manage Inventory</Text>

          {
            wardrobeItems.map((item, i) => {
              return(
                <View key={i}>
                <View style={{height: 1, backgroundColor: '#ccc', marginBottom:16}}/>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom:14}}>
                  <View style={{flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1}}>
                    <Text style={{flex: 1}}>{item.name}</Text>
                    <Pressable onPress={() => handleDelete(i)} style={{ width:22, height:22}}>
                      <Image source={require('../../assets/images/delete.png')} style={{height:22, width:22}}></Image>
                    </Pressable>
                  </View>
                  
                  {/* Counter Widget */}
                  <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                    {/* Decrement Button */}
                    <Pressable 
                      onPress={() => decrementItem(i)}
                      style={{
                        width: 32,
                        height: 32,
                        borderWidth: 1,
                        borderColor: '#ccc',
                        borderRadius: 6,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'white'
                      }}
                    >
                      <Text style={{color: 'red', fontSize: 18, fontWeight: 'bold'}}>-</Text>
                    </Pressable>
                    
                    {/* Quantity Display */}
                    <Text style={{minWidth: 30, textAlign: 'center', fontSize: 16}}>{item.total}</Text>
                    
                    {/* Increment Button */}
                    <Pressable 
                      onPress={() => incrementItem(i)}
                      style={{
                        width: 32,
                        height: 32,
                        borderWidth: 1,
                        borderColor: '#ccc',
                        borderRadius: 6,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'white'
                      }}
                    >
                      <Text style={{color: 'green', fontSize: 18, fontWeight: 'bold'}}>+</Text>
                    </Pressable>
                  </View>
                </View>
                </View>
              )
            })
          }
        </View>
      </View>


      <View style={{height:400}}></View>
    </ScrollView>
  )
}

export default Wardrobe

const styles = StyleSheet.create({})