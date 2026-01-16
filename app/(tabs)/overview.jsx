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

  // Calculate percentage for visual indicators
  const getPercentage = (value, total) => total > 0 ? (value / total) * 100 : 0;

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      {/* Scrollable Content */}
      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={{ 
          padding: Platform.OS === 'web' ? 46 : 18,
          paddingBottom: Platform.OS === 'web' ? 200 : 180 // Padding for summary section (~80px) + bottom bar (80px) + extra spacing
        }}
      >
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1E293B', marginBottom: 6 }}>
            Current Status
          </Text>
          <Text style={{ fontSize: 14, color: '#64748B' }}>
            Overview of your wardrobe inventory
          </Text>
        </View>

        {data.length === 0 ? (
          <View style={{
            borderWidth: 1,
            borderRadius: 12,
            borderColor: '#E2E8F0',
            backgroundColor: 'white',
            padding: 40,
            alignItems: 'center',
            marginTop: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 3,
            elevation: 2
          }}>
            <Text style={{color: '#475569', fontSize: 16, marginBottom: 8, fontWeight: '600'}}>No items yet</Text>
            <Text style={{color: '#94A3B8', fontSize: 14, textAlign: 'center'}}>
              Add items in the Wardrobe tab to get started
            </Text>
          </View>
        ) : (
          <View style={{ gap: 12 }}>
            {data.map((item, index) => {
              const availablePercent = getPercentage(item.available, item.total);
              const laundryPercent = getPercentage(item.inLaundry, item.total);
              
              return (
                <View
                  key={index}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 12,
                    padding: 16,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.08,
                    shadowRadius: 4,
                    elevation: 3,
                    borderWidth: 1,
                    borderColor: '#F1F5F9'
                  }}
                >
                  {/* Category Header */}
                  <View style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: '#1E293B' }}>
                      {item.category}
                    </Text>
                  </View>

                  {/* Stats Grid */}
                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    {/* Total Card */}
                    <View style={{
                      flex: 1,
                      backgroundColor: '#F8FAFC',
                      borderRadius: 10,
                      padding: 12,
                      borderWidth: 1,
                      borderColor: '#E2E8F0'
                    }}>
                      <Text style={{ fontSize: 11, color: '#475569', fontWeight: '600', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Total
                      </Text>
                      <Text style={{ fontSize: 20, fontWeight: '700', color: '#1E293B', marginBottom: 6 }}>
                        {item.total}
                      </Text>
                      {/* Progress Bar */}
                      <View style={{
                        height: 4,
                        backgroundColor: '#E2E8F0',
                        borderRadius: 2,
                        overflow: 'hidden'
                      }}>
                        <View style={{
                          width: '100%',
                          height: '100%',
                          backgroundColor: '#64748B',
                          borderRadius: 2
                        }} />
                      </View>
                    </View>

                    {/* Available Card */}
                    <View style={{
                      flex: 1,
                      backgroundColor: '#F0FDF4',
                      borderRadius: 10,
                      padding: 12,
                      borderWidth: 1,
                      borderColor: '#D1FAE5'
                    }}>
                      <Text style={{ fontSize: 11, color: '#059669', fontWeight: '600', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Available
                      </Text>
                      <Text style={{ fontSize: 20, fontWeight: '700', color: '#10B981', marginBottom: 6 }}>
                        {item.available}
                      </Text>
                      {/* Progress Bar */}
                      <View style={{
                        height: 4,
                        backgroundColor: '#D1FAE5',
                        borderRadius: 2,
                        overflow: 'hidden'
                      }}>
                        <View style={{
                          width: `${availablePercent}%`,
                          height: '100%',
                          backgroundColor: '#10B981',
                          borderRadius: 2
                        }} />
                      </View>
                    </View>

                    {/* In Laundry Card */}
                    <View style={{
                      flex: 1,
                      backgroundColor: '#EFF6FF',
                      borderRadius: 10,
                      padding: 12,
                      borderWidth: 1,
                      borderColor: '#DBEAFE'
                    }}>
                      <Text style={{ fontSize: 11, color: '#2563EB', fontWeight: '600', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        In Laundry
                      </Text>
                      <Text style={{ fontSize: 20, fontWeight: '700', color: '#2563EB', marginBottom: 6 }}>
                        {item.inLaundry}
                      </Text>
                      {/* Progress Bar */}
                      <View style={{
                        height: 4,
                        backgroundColor: '#DBEAFE',
                        borderRadius: 2,
                        overflow: 'hidden'
                      }}>
                        <View style={{
                          width: `${laundryPercent}%`,
                          height: '100%',
                          backgroundColor: '#2563EB',
                          borderRadius: 2
                        }} />
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Fixed Summary at Bottom */}
      <View style={{
          position: 'absolute',
          bottom: Platform.OS === 'web' ? 80 : 80, // Account for BottomBar height (80px) on both web and mobile
          left: 0,
          right: 0,
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          backgroundColor: 'white',
          padding: Platform.OS === 'web' ? 8 : 6,
          paddingBottom: Platform.OS === 'web' ? 8 : 6,
        }}>
          <View style={{
            borderWidth: 1,
            borderRadius: 10,
            borderColor: '#2563EB',
            backgroundColor: '#EFF6FF',
            padding: 10
          }}>
            <Text style={{ fontSize: 13, fontWeight: 'bold', marginBottom: 8, color: '#1E40AF', textAlign: 'center' }}>
              Wardrobe Overview
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-start', paddingHorizontal: 4 }}>
              {/* Total Items Column */}
              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{ color: '#64748B', fontSize: 12, marginBottom: 4, fontWeight: '500' }}>Total Items</Text>
                <Text style={{ fontWeight: '700', color: '#1E40AF', fontSize: 18 }}>{totalItems}</Text>
              </View>
              {/* Divider */}
              <View style={{ width: 1, height: 32, backgroundColor: '#DBEAFE', marginHorizontal: 6 }} />
              {/* Available Column */}
              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{ color: '#64748B', fontSize: 12, marginBottom: 4, fontWeight: '500' }}>Available</Text>
                <Text style={{ fontWeight: '700', color: '#10B981', fontSize: 18 }}>{totalAvailable}</Text>
              </View>
              {/* Divider */}
              <View style={{ width: 1, height: 32, backgroundColor: '#DBEAFE', marginHorizontal: 6 }} />
              {/* In Laundry Column */}
              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{ color: '#64748B', fontSize: 12, marginBottom: 4, fontWeight: '500' }}>In Laundry</Text>
                <Text style={{ fontWeight: '700', color: '#2563EB', fontSize: 18 }}>{totalInLaundry}</Text>
              </View>
            </View>
          </View>
        </View>
    </View>
  )
}

export default overview

const styles = StyleSheet.create({})