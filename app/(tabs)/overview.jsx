import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'
import { useWardrobe } from '@/contexts/WardrobeContext'

const overview = () => {
  const { wardrobeItems } = useWardrobe();
  
  // Use wardrobe items directly with their counts
  const data = wardrobeItems.map((item) => ({
    category: item.name,
    total: item.total,
    available: item.available,
    inLaundry: item.inLaundry,
  }));

  return (
    <ScrollView style={{ flex: 1.2, padding: 16, backgroundColor: '#F8FAFC' }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
        Current Status
      </Text>

      <View style={{height: 1, backgroundColor: '#ccc', marginBottom:16}}/>

      {/* Header */}
      <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: '#ccc', paddingBottom: 8 }}>
        <Text style={{ flex: 1.2, fontWeight: 'bold'}}>CATEGORY</Text>
        <Text style={{ flex: 1, fontWeight: 'bold'}}>TOTAL</Text>
        <Text style={{ flex: 1, fontWeight: 'bold', color: 'green' }}>AVAIL.</Text>
        <Text style={{ flex: 1, fontWeight: 'bold', color: 'blue' }}>LAUNDARY</Text>
      </View>

      {/* Rows */}
      {data.map((item, index) => (
        <View
          key={index}
          style={{
            flexDirection: 'row',
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderColor: '#eee',
            marginBottom: 8
          }}
        >
          <Text style={{ flex: 1.2 }}>{item.category}</Text>
          <Text style={{ flex: 1, fontWeight: 'bold'}}>{item.total}</Text>
          <Text style={{ flex: 1, color: 'green' }}>{item.available}</Text>
          <Text style={{ flex: 1, color: 'blue' }}>{item.inLaundry}</Text>
        </View>
      ))}
    </ScrollView>
  )
}

export default overview

const styles = StyleSheet.create({})