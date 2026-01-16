import { StyleSheet, Text, View, ScrollView, Platform, Pressable, Alert } from 'react-native'
import React, { useState } from 'react'
import { useWardrobe } from '@/contexts/WardrobeContext'

const send = () => {
  const { wardrobeItems, sendToLaundry } = useWardrobe()
  const [selectedQuantities, setSelectedQuantities] = useState({}) // Track selected quantities per item

  // Only show items that have available quantity
  const availableItems = wardrobeItems.filter(item => item.available > 0)

  // Update selected quantity for an item (clamped between 0 and available)
  const updateQuantity = (itemIndex, delta) => {
    setSelectedQuantities(prev => {
      const current = prev[itemIndex] || 0
      const item = wardrobeItems[itemIndex]
      const newQuantity = Math.max(0, Math.min(item.available, current + delta))
      
      if (newQuantity === 0) {
        const updated = { ...prev }
        delete updated[itemIndex]
        return updated
      }
      
      return { ...prev, [itemIndex]: newQuantity }
    })
  }

  // Create batch and send selected items to laundry
  const handleConfirmSend = () => {
    const batchItems = Object.keys(selectedQuantities)
      .filter(key => selectedQuantities[key] > 0)
      .map(key => ({
        itemIndex: parseInt(key),
        quantity: selectedQuantities[key]
      }))

    if (batchItems.length === 0) {
      Alert.alert('No Items Selected', 'Please select at least one item to send to laundry.')
      return
    }

    sendToLaundry(batchItems)
    setSelectedQuantities({})
    Alert.alert('Success', 'Items sent to laundry successfully!')
  }

  // Calculate total number of items selected across all categories
  const totalSelected = Object.values(selectedQuantities).reduce((sum, qty) => sum + qty, 0)

  return (
    <ScrollView style={{ flex: 1, padding: Platform.OS === 'web' ? 46 : 18, backgroundColor: '#F8FAFC' }}>
      <View style={{borderWidth:1, borderRadius:8, borderColor:'silver', backgroundColor:'white', padding:18, marginBottom: 18, borderLeftWidth: 4, borderLeftColor: '#ccc', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2}}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#1E40AF' }}>Create Batch</Text>
        <View style={{height: 1, backgroundColor: '#ccc', marginBottom:16}}/>

        {availableItems.length === 0 ? (
          <View style={{paddingVertical: 40, alignItems: 'center'}}>
            <Text style={{color: '#666', textAlign: 'center', fontSize: 16, marginBottom: 8}}>
              No items available to send
            </Text>
            <Text style={{color: '#999', textAlign: 'center', fontSize: 14}}>
              Add items in the Wardrobe tab first
            </Text>
          </View>
        ) : (
          <>
            {availableItems.map((item, index) => {
              const originalIndex = wardrobeItems.findIndex(wi => wi.name === item.name)
              const quantity = selectedQuantities[originalIndex] || 0
              const isMaxReached = quantity >= item.available
              
              return (
                <View key={originalIndex} style={{marginBottom: 16}}>
                  <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8}}>
                    <View style={{flex: 1}}>
                      <Text style={{fontSize: 16, fontWeight: '500'}}>{item.name}</Text>
                      <Text style={{fontSize: 12, color: '#666'}}>({item.available} Avail)</Text>
                    </View>
                    
                    {/* Quantity Selector */}
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
                      <Pressable 
                        onPress={() => updateQuantity(originalIndex, -1)}
                        disabled={quantity === 0}
                        style={{
                          width: 32,
                          height: 32,
                          borderWidth: 1,
                          borderColor: quantity === 0 ? '#e5e5e5' : '#ccc',
                          borderRadius: 6,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: quantity === 0 ? '#f5f5f5' : 'white',
                          opacity: quantity === 0 ? 0.5 : 1
                        }}
                      >
                        <Text style={{color: quantity === 0 ? '#999' : 'red', fontSize: 18, fontWeight: 'bold'}}>-</Text>
                      </Pressable>
                      
                      <Text style={{minWidth: 30, textAlign: 'center', fontSize: 16, fontWeight: quantity > 0 ? '600' : '400'}}>{quantity}</Text>
                      
                      <Pressable 
                        onPress={() => updateQuantity(originalIndex, 1)}
                        disabled={isMaxReached}
                        style={{
                          width: 32,
                          height: 32,
                          borderWidth: 1,
                          borderColor: isMaxReached ? '#e5e5e5' : '#ccc',
                          borderRadius: 6,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: isMaxReached ? '#f5f5f5' : 'white',
                          opacity: isMaxReached ? 0.5 : 1
                        }}
                      >
                        <Text style={{color: isMaxReached ? '#999' : 'green', fontSize: 18, fontWeight: 'bold'}}>+</Text>
                      </Pressable>
                    </View>
                  </View>
                  
                  {index < availableItems.length - 1 && (
                    <View style={{height: 1, backgroundColor: '#eee', marginTop: 8}}/>
                  )}
                </View>
              )
            })}

            {/* Summary and Button */}
            {totalSelected > 0 && (
              <View style={{
                marginTop: 20,
                paddingTop: 16,
                borderTopWidth: 1,
                borderTopColor: '#eee'
              }}>
                <Text style={{color: '#666', fontSize: 14, marginBottom: 12, textAlign: 'center'}}>
                  Total Items Selected: <Text style={{fontWeight: 'bold', color: '#2563EB'}}>{totalSelected}</Text>
                </Text>
              </View>
            )}

            <Pressable 
              onPress={handleConfirmSend}
              disabled={totalSelected === 0}
              style={{
                backgroundColor: totalSelected > 0 ? '#2563EB' : '#9CA3AF',
                borderRadius: 8,
                paddingVertical: 12,
                paddingHorizontal: 24,
                alignItems: 'center',
                marginTop: totalSelected > 0 ? 8 : 20,
                alignSelf: 'flex-end',
                opacity: totalSelected === 0 ? 0.6 : 1
              }}
            >
              <Text style={{color: 'white', fontSize: 16, fontWeight: '600'}}>
                Confirm & Send Items {totalSelected > 0 ? `(${totalSelected})` : ''}
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </ScrollView>
  )
}

export default send

const styles = StyleSheet.create({})
