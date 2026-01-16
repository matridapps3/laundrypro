import { View, Text, Image, Pressable, Alert, Platform } from 'react-native'
import React from 'react'
import * as FileSystem from 'expo-file-system/legacy'
import * as Sharing from 'expo-sharing'
import * as DocumentPicker from 'expo-document-picker'
import { useWardrobe } from '@/contexts/WardrobeContext'

const BottomBar = () => {
  const { getAllData, restoreData } = useWardrobe()

  // Export all app data to JSON file for backup
  const handleBackup = async () => {
    try {
      const data = getAllData()
      const jsonString = JSON.stringify(data, null, 2)
      
      // Generate filename with current timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
      const filename = `laundrypro-backup-${timestamp}.json`
      
      // Web: download file directly
      if (Platform.OS === 'web') {
        // Create a blob and trigger download for web
        const blob = new Blob([jsonString], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        return
      }
      
      // Mobile: save file and use native share dialog
      // Note: Mobile platforms require user interaction for security reasons
      // Direct download to Downloads folder without share dialog is not possible
      const tempFileUri = FileSystem.documentDirectory + filename
      await FileSystem.writeAsStringAsync(tempFileUri, jsonString)
      
      // Open native share menu to save/download file
      const isAvailable = await Sharing.isAvailableAsync()
      if (isAvailable) {
        await Sharing.shareAsync(tempFileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Save LaundryPro Backup',
          UTI: 'public.json',
        })
      }
    } catch (error) {
      console.error('Error creating backup:', error)
      Alert.alert('Error', 'Failed to create backup. Please try again.')
    }
  }

  // Import backup JSON file and restore app data
  const handleRestore = async () => {
    try {
      let fileContent;
      
      // Web: use File System Access API or fallback to file input
      if (Platform.OS === 'web') {
        if ('showOpenFilePicker' in window) {
          try {
            const [fileHandle] = await window.showOpenFilePicker({
              types: [{
                description: 'JSON Files',
                accept: { 'application/json': ['.json'] }
              }]
            })
            const file = await fileHandle.getFile()
            fileContent = await file.text()
          } catch (err) {
            if (err.name === 'AbortError') {
              return // User cancelled
            }
            // Fall through to file input fallback
          }
        }
        
        // Fallback: use file input for older browsers
        if (!fileContent) {
          const input = document.createElement('input')
          input.type = 'file'
          input.accept = '.json,application/json'
          
          await new Promise((resolve) => {
            input.onchange = async (e) => {
              const file = e.target.files[0]
              if (file) {
                try {
                  fileContent = await file.text()
                } catch (error) {
                  console.error('Error reading file:', error)
                  Alert.alert('Error', 'Failed to read file.')
                }
              }
              resolve()
            }
            input.click()
          })
        }
      } else {
        // Mobile: use document picker to select JSON file
        const result = await DocumentPicker.getDocumentAsync({
          type: 'application/json',
          copyToCacheDirectory: true,
        })
        
        if (result.canceled) {
          return
        }
        
        if (result.assets && result.assets.length > 0) {
          const fileUri = result.assets[0].uri
          fileContent = await FileSystem.readAsStringAsync(fileUri)
        }
      }
      
      // Parse JSON and restore all app data
      if (fileContent) {
        const backupData = JSON.parse(fileContent)
        restoreData(backupData)
        Alert.alert('Success', 'Data restored successfully!')
      }
    } catch (error) {
      console.error('Error restoring backup:', error)
      Alert.alert('Error', 'Failed to restore backup. Please check the file format.')
    }
  }

  return (
    <View style={{
      height: 80, 
      width: '100%', 
      position: 'absolute', 
      bottom: 0, 
      left: 0, 
      backgroundColor: '#F1F5F9', 
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      paddingLeft: 32, 
      paddingRight: 32,
      borderTopWidth: 1,
      borderTopColor: '#E2E8F0',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5
    }}>
      <Pressable 
        style={({ pressed }) => ({
          flexDirection: 'row', 
          gap: 8, 
          alignItems: 'center',
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 10,
          backgroundColor: pressed ? '#E2E8F0' : 'transparent',
          opacity: pressed ? 0.8 : 1
        })} 
        onPress={handleBackup}
      >
        <Image 
          source={require('../../assets/images/backup.png')} 
          style={{height: 22, width: 22, tintColor: '#475569'}}
        />
        <Text style={{
          fontSize: 15, 
          fontWeight: '600',
          color: '#475569',
          letterSpacing: 0.2
        }}>
          Backup
        </Text>
      </Pressable>
      
      <Pressable 
        style={({ pressed }) => ({
          flexDirection: 'row', 
          gap: 8, 
          alignItems: 'center',
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 10,
          backgroundColor: pressed ? '#E2E8F0' : 'transparent',
          opacity: pressed ? 0.8 : 1
        })} 
        onPress={handleRestore}
      >
        <Image 
          source={require('../../assets/images/restore.png')} 
          style={{height: 22, width: 22, tintColor: '#475569'}}
        />
        <Text style={{
          fontSize: 15, 
          fontWeight: '600',
          color: '#475569',
          letterSpacing: 0.2
        }}>
          Restore
        </Text>
      </Pressable>
    </View>
  )
}

export default BottomBar