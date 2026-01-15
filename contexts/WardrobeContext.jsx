import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WardrobeContext = createContext();

const STORAGE_KEY = '@wardrobe_items';

export const useWardrobe = () => {
  const context = useContext(WardrobeContext);
  if (!context) {
    throw new Error('useWardrobe must be used within a WardrobeProvider');
  }
  return context;
};

export const WardrobeProvider = ({ children }) => {
  const [wardrobeItems, setWardrobeItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from AsyncStorage on mount
  useEffect(() => {
    loadWardrobeData();
  }, []);

  const loadWardrobeData = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data !== null) {
        setWardrobeItems(JSON.parse(data));
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

  const deleteItem = useCallback((index) => {
    setWardrobeItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const incrementItem = useCallback((index) => {
    setWardrobeItems((prev) => 
      prev.map((item, i) => 
        i === index 
          ? { ...item, total: item.total + 1, available: item.available + 1 }
          : item
      )
    );
  }, []);

  const decrementItem = useCallback((index) => {
    setWardrobeItems((prev) => 
      prev.map((item, i) => 
        i === index && item.total > 0
          ? { ...item, total: item.total - 1, available: item.available > 0 ? item.available - 1 : 0 }
          : item
      )
    );
  }, []);

  return (
    <WardrobeContext.Provider value={{ wardrobeItems, addItem, deleteItem, incrementItem, decrementItem, isLoading }}>
      {children}
    </WardrobeContext.Provider>
  );
};
