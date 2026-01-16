import { StyleSheet, Text, View, ScrollView, Platform, Pressable, Alert } from 'react-native'
import React from 'react'
import { useWardrobe } from '@/contexts/WardrobeContext'

const history = () => {
  const { activeBatches, markBatchReturned } = useWardrobe()

  // Show confirmation before marking batch as returned
  const handleMarkReturned = (batchId) => {
    if (Platform.OS === 'web') {
      // Use browser's native confirm dialog for web
      if (window.confirm('Are you sure you want to mark this batch as returned?')) {
        markBatchReturned(batchId)
        window.alert('Success! Batch marked as returned!')
      }
    } else {
      // Use React Native Alert for mobile
      Alert.alert(
        'Mark as Returned',
        'Are you sure you want to mark this batch as returned?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Confirm',
            onPress: () => {
              markBatchReturned(batchId)
              Alert.alert('Success', 'Batch marked as returned!')
            }
          }
        ]
      )
    }
  }

  // Calculate total items in a batch
  const totalItems = (batch) => {
    return batch.items?.reduce((sum, item) => sum + item.quantity, 0) || batch.ids?.length || 0
  }

  // Convert date string (M/D/YYYY) to readable format (Jan 16, 2026)
  const formatDate = (dateString) => {
    try {
      const [month, day, year] = dateString.split('/');
      const date = new Date(year, month - 1, day);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${months[date.getMonth()]} ${day}, ${year}`;
    } catch {
      return dateString;
    }
  }

  // Sort batches by date with newest batches first
  const sortedBatches = [...activeBatches].sort((a, b) => {
    try {
      const dateA = new Date(a.d.split('/').reverse().join('-'));
      const dateB = new Date(b.d.split('/').reverse().join('-'));
      return dateB - dateA;
    } catch {
      return 0;
    }
  });

  return (
    <ScrollView style={{ flex: 1, padding: Platform.OS === 'web' ? 46 : 18, backgroundColor: '#F8FAFC' }}>
      {sortedBatches.length === 0 ? (
        <View style={{
          borderWidth: 1,
          borderRadius: 8,
          borderColor: 'silver',
          backgroundColor: 'white',
          padding: 18,
          borderLeftWidth: 4,
          borderLeftColor: '#ccc',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2
        }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#1E40AF' }}>
            Active Batches
          </Text>
          <View style={{height: 1, backgroundColor: '#ccc', marginBottom: 16}}/>
          <View style={{paddingVertical: 20, alignItems: 'center'}}>
            <Text style={{color: '#666', fontSize: 16, marginBottom: 8, fontWeight: '500'}}>No active batches</Text>
            <Text style={{color: '#999', fontSize: 14, textAlign: 'center'}}>
              Items sent to laundry will appear here
            </Text>
          </View>
        </View>
      ) : (
        sortedBatches.map((batch) => (
          <View
            key={batch.id}
            style={{
              borderWidth: 1,
              borderRadius: 8,
              borderColor: 'silver',
              backgroundColor: 'white',
              padding: 18,
              marginBottom: 16,
              borderLeftWidth: 4,
              borderLeftColor: '#ccc',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 2
            }}
          >
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12}}>
              <View style={{flex: 1}}>
                <Text style={{fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#1E40AF'}}>
                  {formatDate(batch.d)}
                </Text>
                <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 8}}>
                  {batch.txt?.map((text, idx) => (
                    <View
                      key={idx}
                      style={{
                        backgroundColor: '#E0F2FE',
                        borderRadius: 12,
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        marginBottom: 4
                      }}
                    >
                      <Text style={{color: '#0369A1', fontSize: 12, fontWeight: '500'}}>{text}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <View style={{
                backgroundColor: '#F3F4F6',
                borderRadius: 8,
                paddingHorizontal: 10,
                paddingVertical: 6,
                minWidth: 60,
                alignItems: 'center'
              }}>
                <Text style={{fontSize: 14, color: '#666', fontWeight: '500'}}>
                  {totalItems(batch)} {totalItems(batch) === 1 ? 'Item' : 'Items'}
                </Text>
              </View>
            </View>
            
            <Pressable
              onPress={() => handleMarkReturned(batch.id)}
              style={({ pressed }) => ({
                backgroundColor: '#10B981',
                borderRadius: 8,
                paddingVertical: 12,
                paddingHorizontal: 24,
                alignItems: 'center',
                marginTop: 8,
                opacity: pressed ? 0.8 : 1
              })}
            >
              <Text style={{color: 'white', fontSize: 16, fontWeight: '600'}}>
                Mark Returned
              </Text>
            </Pressable>
          </View>
        ))
      )}
    </ScrollView>
  )
}

export default history

const styles = StyleSheet.create({})
