import { StyleSheet, Text, View, ScrollView, Platform } from 'react-native'
import React from 'react'
import { useWardrobe } from '@/contexts/WardrobeContext'

const overview = () => {
  const { wardrobeItems } = useWardrobe();
  
  // Transform wardrobe items for display
  const data = wardrobeItems.map((item) => ({
    category: item.name,
    total: item.total,
    available: item.available,
    inLaundry: item.inLaundry,
  }));

  // Calculate totals across all categories
  const totalItems = data.reduce((sum, item) => sum + item.total, 0);
  const totalAvailable = data.reduce((sum, item) => sum + item.available, 0);
  const totalInLaundry = data.reduce((sum, item) => sum + item.inLaundry, 0);

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      {/* Scrollable Content */}
      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={{ 
          padding: Platform.OS === 'web' ? 46 : 18,
          paddingBottom: Platform.OS === 'web' ? 260 : 240 // Padding for summary section (~100px) + bottom bar (80px) + extra spacing
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
          Current Status
        </Text>

        <View style={{height: 1, backgroundColor: '#ccc', marginBottom:16}}/>

        {data.length === 0 ? (
          <View style={{
            borderWidth: 1,
            borderRadius: 8,
            borderColor: 'silver',
            backgroundColor: 'white',
            padding: 40,
            alignItems: 'center',
            marginTop: 20
          }}>
            <Text style={{color: '#666', fontSize: 16, marginBottom: 8}}>No items yet</Text>
            <Text style={{color: '#999', fontSize: 14, textAlign: 'center'}}>
              Add items in the Wardrobe tab to get started
            </Text>
          </View>
        ) : (
          <>
            {/* Header */}
            <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: '#ccc', paddingBottom: 8, marginBottom: 8 }}>
              <Text style={{ flex: 1.2, fontWeight: 'bold', paddingRight:4}}>CATEGORY</Text>
              <Text style={{ flex: 1, fontWeight: 'bold'}}>TOTAL</Text>
              <Text style={{ flex: 1, fontWeight: 'bold', color: '#10B981' }}>AVAIL.</Text>
              <Text style={{ flex: 1, fontWeight: 'bold', color: '#2563EB' }}>LAUNDRY</Text>
            </View>

            {/* Rows */}
            {data.map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderColor: '#eee',
                  backgroundColor: index % 2 === 0 ? 'white' : '#FAFAFA',
                  paddingHorizontal: 4,
                  borderRadius: 4,
                  marginBottom: 4
                }}
              >
                <Text style={{ flex: 1.2, fontWeight: '500' }}>{item.category}</Text>
                <Text style={{ flex: 1, fontWeight: 'bold'}}>{item.total}</Text>
                <Text style={{ flex: 1, color: '#10B981', fontWeight: '500' }}>{item.available}</Text>
                <Text style={{ flex: 1, color: '#2563EB', fontWeight: '500' }}>{item.inLaundry}</Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      {/* Fixed Summary at Bottom */}
      {data.length > 0 && (
        <View style={{
          position: 'absolute',
          bottom: Platform.OS === 'web' ? 80 : 80, // Account for BottomBar height (80px) on both web and mobile
          left: 0,
          right: 0,
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          backgroundColor: 'white',
          padding: Platform.OS === 'web' ? 16 : 12,
          paddingBottom: Platform.OS === 'web' ? 16 : 12,
        }}>
          <View style={{
            borderWidth: 1,
            borderRadius: 8,
            borderColor: '#2563EB',
            backgroundColor: '#EFF6FF',
            padding: 12
          }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10, color: '#1E40AF' }}>
              Summary
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={{ color: '#666', fontSize: 13 }}>Total Items:</Text>
              <Text style={{ fontWeight: 'bold', color: '#1E40AF', fontSize: 13 }}>{totalItems}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={{ color: '#666', fontSize: 13 }}>Available:</Text>
              <Text style={{ fontWeight: 'bold', color: '#10B981', fontSize: 13 }}>{totalAvailable}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: '#666', fontSize: 13 }}>In Laundry:</Text>
              <Text style={{ fontWeight: 'bold', color: '#2563EB', fontSize: 13 }}>{totalInLaundry}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

export default overview

const styles = StyleSheet.create({})