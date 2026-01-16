import { StyleSheet, Text, View, ScrollView, TextInput, Pressable, Image, Platform, Alert, Keyboard } from 'react-native'
import React, { useState } from 'react'
import { useWardrobe } from '@/contexts/WardrobeContext'

const Wardrobe = () => {
  const[input, setInput] = useState("")
  const { wardrobeItems, addItem, deleteItem, incrementItem, decrementItem } = useWardrobe()

  // Show confirmation dialog before deleting item
  const handleDelete = (i) => {
    const item = wardrobeItems[i]
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete "${item.name}"? This will remove all ${item.total} items.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteItem(i)
        }
      ]
    )
  }

  // Validate and add new item type to wardrobe
  const handleAdd = () => {
    Keyboard.dismiss() // Dismiss keyboard first to ensure button press works
    
    const trimmedInput = input.trim()
    if (!trimmedInput) {
      Alert.alert('Invalid Input', 'Please enter an item name')
      return
    }
    
    // Prevent duplicate item names (case-insensitive)
    const isDuplicate = wardrobeItems.some(item => 
      item.name.toLowerCase() === trimmedInput.toLowerCase()
    )
    
    if (isDuplicate) {
      Alert.alert('Duplicate Item', 'This item already exists in your wardrobe')
      return
    }
    
    addItem(trimmedInput)
    setInput("")
  }

  return (
    <ScrollView 
      contentContainerStyle={{
        paddingBottom: Platform.OS === 'web' ? 100 : 100 // Padding to prevent content from hiding behind bottom bar (80px)
      }}
    >
      <View style={{ flex: 1, padding : Platform.OS === 'web' ? 46 : 18, gap:18}}>
        <View style={{borderWidth:1, borderRadius:8, borderColor:'silver', height:140, backgroundColor:'white', padding:18}}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Add New Item Type</Text>

           {/*This is a horizontal line for partition*/}
           <View style={{height: 1, backgroundColor: '#ccc', marginBottom:16}}/>

          <View style={{flexDirection:'row', gap:8}}>
            <TextInput 
              style={{
                flex: 1,
                paddingLeft: 12,
                paddingRight: 12,
                height: 40,
                borderWidth: 1,
                borderRadius: 8,
                borderColor: input.trim() ? '#2563EB' : 'silver',
                backgroundColor: 'white'
              }} 
              placeholder='e.g. Trousers' 
              value={input} 
              onChangeText={setInput}
              onSubmitEditing={handleAdd}
              returnKeyType="done"
              blurOnSubmit={true}
            />
            <Pressable 
              style={({ pressed }) => ({
                width: 70,
                backgroundColor: input.trim() ? '#2563EB' : '#9CA3AF',
                borderRadius: 8,
                justifyContent: 'center',
                alignItems: 'center',
                opacity: pressed ? 0.8 : 1
              })} 
              onPress={handleAdd}
              disabled={!input.trim()}
            >
              <Text style={{ color: 'white', fontWeight: '600' }}>Add</Text>
            </Pressable>
          </View>
        </View>

        <View style={{borderWidth:1, borderRadius:8, borderColor:'silver', height:'auto', backgroundColor:'white', padding:18, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2}}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Manage Inventory</Text>

          {wardrobeItems.length === 0 ? (
            <View style={{paddingVertical: 30, alignItems: 'center'}}>
              <Text style={{color: '#666', fontSize: 14, textAlign: 'center'}}>
                No items yet. Add your first item above!
              </Text>
            </View>
          ) : (
            wardrobeItems.map((item, i) => {
              return(
                <View key={i}>
                  {i > 0 && <View style={{height: 1, backgroundColor: '#eee', marginBottom:16, marginTop: 8}}/>}
                  <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: i < wardrobeItems.length - 1 ? 14 : 0}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1}}>
                      <View style={{flex: 1}}>
                        <Text style={{fontSize: 16, fontWeight: '500', marginBottom: 4}}>{item.name}</Text>
                        <Text style={{fontSize: 12, color: '#666'}}>
                          {item.available} available, {item.inLaundry} in laundry
                        </Text>
                      </View>
                      <Pressable 
                        onPress={() => handleDelete(i)} 
                        style={({ pressed }) => ({
                          width: 28,
                          height: 28,
                          marginRight: 12,
                          opacity: pressed ? 0.6 : 1,
                          justifyContent: 'center',
                          alignItems: 'center'
                        })}
                      >
                        <Image source={require('../../assets/images/delete.png')} style={{height:22, width:22}}></Image>
                      </Pressable>
                    </View>
                    
                    {/* Counter Widget */}
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                      {/* Decrement Button */}
                      <Pressable 
                        onPress={() => decrementItem(i)}
                        disabled={item.total === 0}
                        style={({ pressed }) => ({
                          width: 32,
                          height: 32,
                          borderWidth: 1,
                          borderColor: item.total === 0 ? '#e5e5e5' : '#ccc',
                          borderRadius: 6,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: item.total === 0 ? '#f5f5f5' : 'white',
                          opacity: item.total === 0 ? 0.5 : (pressed ? 0.7 : 1)
                        })}
                      >
                        <Text style={{color: item.total === 0 ? '#999' : 'red', fontSize: 18, fontWeight: 'bold'}}>-</Text>
                      </Pressable>
                      
                      {/* Quantity Display */}
                      <Text style={{minWidth: 30, textAlign: 'center', fontSize: 16, fontWeight: '600'}}>{item.total}</Text>
                      
                      {/* Increment Button */}
                      <Pressable 
                        onPress={() => incrementItem(i)}
                        style={({ pressed }) => ({
                          width: 32,
                          height: 32,
                          borderWidth: 1,
                          borderColor: '#ccc',
                          borderRadius: 6,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: 'white',
                          opacity: pressed ? 0.7 : 1
                        })}
                      >
                        <Text style={{color: 'green', fontSize: 18, fontWeight: 'bold'}}>+</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              )
            })
          )}
        </View>
      </View>
    </ScrollView>
  )
}

export default Wardrobe

const styles = StyleSheet.create({})