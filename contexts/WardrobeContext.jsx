import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WardrobeContext = createContext();

const STORAGE_KEY = '@wardrobe_items';
const BATCHES_STORAGE_KEY = '@laundry_batches';

export const useWardrobe = () => {
  const context = useContext(WardrobeContext);
  if (!context) {
    throw new Error('useWardrobe must be used within a WardrobeProvider');
  }
  return context;
};

export const WardrobeProvider = ({ children }) => {
  const [wardrobeItems, setWardrobeItems] = useState([]); // All wardrobe items with counts
  const [batches, setBatches] = useState([]); // Laundry batches (active and completed)
  const [isLoading, setIsLoading] = useState(true);

  // Load saved data from AsyncStorage when app starts
  useEffect(() => {
    loadWardrobeData();
  }, []);

  const loadWardrobeData = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data !== null) {
        setWardrobeItems(JSON.parse(data));
      }
      
      const batchesData = await AsyncStorage.getItem(BATCHES_STORAGE_KEY);
      if (batchesData !== null) {
        setBatches(JSON.parse(batchesData));
      }
    } catch (error) {
      console.error('Error loading wardrobe data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save data to AsyncStorage whenever wardrobeItems changes
  useEffect(() => {
    if (!isLoading) {
      const saveWardrobeData = async () => {
        try {
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(wardrobeItems));
        } catch (error) {
          console.error('Error saving wardrobe data:', error);
        }
      };
      saveWardrobeData();
    }
  }, [wardrobeItems, isLoading]);

  // Save batches to AsyncStorage whenever batches changes
  useEffect(() => {
    if (!isLoading) {
      const saveBatchesData = async () => {
        try {
          await AsyncStorage.setItem(BATCHES_STORAGE_KEY, JSON.stringify(batches));
        } catch (error) {
          console.error('Error saving batches data:', error);
        }
      };
      saveBatchesData();
    }
  }, [batches, isLoading]);

  // Add a new item category to wardrobe (starts with 0 counts)
  const addItem = useCallback((item) => {
    if (item && item.trim() !== '') {
      setWardrobeItems((prev) => {
        const newItems = [...prev, {
          name: item.trim(),
          total: 0,
          available: 0,
          inLaundry: 0
        }];
        return newItems;
      });
    }
  }, []);

  // Remove an item category completely
  const deleteItem = useCallback((index) => {
    setWardrobeItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Increment: Add new item (increases total and available)
  const incrementItem = useCallback((index) => {
    setWardrobeItems((prev) => 
      prev.map((item, i) => 
        i === index 
          ? { 
              ...item, 
              total: item.total + 1, 
              available: item.available + 1,
              // Ensure: total = available + inLaundry
            }
          : item
      )
    );
  }, []);

  // Decrement: Remove item (decreases total, removes from available first, then laundry)
  const decrementItem = useCallback((index) => {
    setWardrobeItems((prev) => 
      prev.map((item, i) => {
        if (i !== index || item.total === 0) return item;
        
        // If available > 0, decrease from available
        if (item.available > 0) {
          return { 
            ...item, 
            total: item.total - 1, 
            available: item.available - 1 
          };
        }
        // Otherwise, decrease from laundry
        else if (item.inLaundry > 0) {
          return { 
            ...item, 
            total: item.total - 1, 
            inLaundry: item.inLaundry - 1 
          };
        }
        return item;
      })
    );
  }, []);

  // Generate category code from name (e.g., "Underwear" -> "UWR", "Socks" -> "SCK")
  const generateCategoryCode = (name) => {
    const trimmed = name.trim();
    const words = trimmed.split(/\s+/);
    
    if (words.length > 1) {
      // Multi-word: take first letter of each word
      const code = words.map(w => w.charAt(0).toUpperCase()).join('');
      if (code.length >= 3) {
        return code.substring(0, 3);
      }
      // If less than 3, pad with letters from the first word
      const firstWord = words[0];
      let padded = code;
      for (let i = 1; i < firstWord.length && padded.length < 3; i++) {
        padded += firstWord.charAt(i).toUpperCase();
      }
      return padded.substring(0, 3);
    }
    
    // Single word: try to create a meaningful 3-letter code
    if (trimmed.length >= 3) {
      const first = trimmed.charAt(0).toUpperCase();
      const second = trimmed.length > 1 ? trimmed.charAt(1).toUpperCase() : first;
      const third = trimmed.length > 2 ? trimmed.charAt(2).toUpperCase() : first;
      return first + second + third;
    }
    
    // Fallback: pad with first letter
    return trimmed.toUpperCase().padEnd(3, trimmed.charAt(0).toUpperCase());
  };

  // Create a batch and move items from available to laundry (total unchanged)
  const sendToLaundry = useCallback((batchItems) => {
    // batchItems format: [{ itemIndex, quantity }]
    const currentDate = new Date();
    const dateString = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
    const batchId = Date.now();
    
    // Update wardrobe items and create batch record
    setWardrobeItems((prev) => {
      const batchText = [];
      const batchItemIds = [];
      const batchItemsData = [];
      
      const updated = prev.map((item, i) => {
        const batchItem = batchItems.find(bi => bi.itemIndex === i);
        if (batchItem && item.available >= batchItem.quantity) {
          batchText.push(`${batchItem.quantity} ${item.name}`);
          batchItemsData.push({
            itemIndex: i,
            quantity: batchItem.quantity,
            itemName: item.name
          });
          
          // Generate item IDs for this batch
          const code = generateCategoryCode(item.name);
          // Calculate starting ID based on current state
          const currentAvailable = item.available;
          const currentInLaundry = item.inLaundry;
          const startId = item.total - currentAvailable - currentInLaundry + 1;
          
          for (let j = 0; j < batchItem.quantity; j++) {
            batchItemIds.push(`${code}-${startId + currentAvailable + j}`);
          }
          
          return {
            ...item,
            available: item.available - batchItem.quantity,
            inLaundry: item.inLaundry + batchItem.quantity
          };
        }
        return item;
      });
      
      // Create batch if there are items to send
      if (batchText.length > 0) {
        const newBatch = {
          id: batchId,
          d: dateString,
          txt: batchText,
          ids: batchItemIds,
          act: true,
          items: batchItemsData
        };
        
        // Update batches separately
        setBatches((prevBatches) => [...prevBatches, newBatch]);
      }
      
      return updated;
    });
  }, []);

  // Mark batch as returned: move items from laundry back to available
  const markBatchReturned = useCallback((batchId) => {
    setBatches((prevBatches) => {
      const batch = prevBatches.find(b => b.id === batchId);
      
      if (batch && batch.act && batch.items) {
        // Update counts: move from laundry to available
        setWardrobeItems((prevItems) => {
          return prevItems.map((item, i) => {
            const batchItem = batch.items.find(bi => bi.itemIndex === i);
            if (batchItem && item.inLaundry >= batchItem.quantity) {
              return {
                ...item,
                available: item.available + batchItem.quantity,
                inLaundry: item.inLaundry - batchItem.quantity
              };
            }
            return item;
          });
        });
        
        // Mark batch as inactive (removes from history)
        return prevBatches.map(b => 
          b.id === batchId 
            ? { ...b, act: false }
            : b
        );
      }
      
      return prevBatches;
    });
  }, []);


  // Export all data in backup format (config, inventory, batches)
  const getAllData = useCallback(() => {
    // Map category names to their 3-letter codes
    const config = {};
    wardrobeItems.forEach(item => {
      if (item.name && item.name.trim()) {
        config[item.name] = generateCategoryCode(item.name);
      }
    });

    // Create inventory array with individual item records
    const inv = [];
    wardrobeItems.forEach(item => {
      if (!item.name) return;
      
      const code = config[item.name];
      let itemCounter = 1;
      
      // Add available items (status: "av")
      for (let i = 0; i < item.available; i++) {
        inv.push({
          id: `${code}-${itemCounter}`,
          c: item.name,
          s: 'av'
        });
        itemCounter++;
      }
      
      // Add items in laundry (status: "out")
      for (let i = 0; i < item.inLaundry; i++) {
        inv.push({
          id: `${code}-${itemCounter}`,
          c: item.name,
          s: 'out'
        });
        itemCounter++;
      }
    });

    // Use stored batches instead of generating them
    return {
      config,
      inv,
      batches: batches.filter(b => b.act === true) // Only include active batches in backup
    };
  }, [wardrobeItems, batches]);

  // Import and restore data from backup JSON file
  const restoreData = useCallback((backupData) => {
    try {
      // Parse backup format and convert to wardrobe items
      const { config, inv, batches: backupBatches } = backupData;
      
      if (!config || !inv) {
        throw new Error('Invalid backup format');
      }

      // Group inventory items by category
      const categoryMap = {};
      inv.forEach(item => {
        if (!categoryMap[item.c]) {
          categoryMap[item.c] = {
            name: item.c,
            total: 0,
            available: 0,
            inLaundry: 0
          };
        }
        categoryMap[item.c].total++;
        if (item.s === 'av') {
          categoryMap[item.c].available++;
        } else if (item.s === 'out') {
          categoryMap[item.c].inLaundry++;
        }
      });

      // Convert to array
      const restoredItems = Object.values(categoryMap);
      setWardrobeItems(restoredItems);
      
      // Restore batches if they exist
      if (backupBatches && Array.isArray(backupBatches)) {
        setBatches(backupBatches);
      }
      
      return true;
    } catch (error) {
      console.error('Error restoring data:', error);
      throw error;
    }
  }, []);

  // Get active batches only
  const getActiveBatches = useCallback(() => {
    return batches.filter(batch => batch.act === true);
  }, [batches]);

  // Reset all application data to initial state
  const resetAllData = useCallback(async () => {
    try {
      // Clear state
      setWardrobeItems([]);
      setBatches([]);
      
      // Clear AsyncStorage
      await AsyncStorage.removeItem(STORAGE_KEY);
      await AsyncStorage.removeItem(BATCHES_STORAGE_KEY);
    } catch (error) {
      console.error('Error resetting data:', error);
      throw error;
    }
  }, []);

  return (
    <WardrobeContext.Provider value={{ 
      wardrobeItems, 
      batches,
      activeBatches: getActiveBatches(),
      addItem, 
      deleteItem, 
      incrementItem, 
      decrementItem, 
      sendToLaundry,
      markBatchReturned,
      isLoading, 
      getAllData, 
      restoreData,
      resetAllData
    }}>
      {children}
    </WardrobeContext.Provider>
  );
};
