import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function Index() {
  return <Redirect href="/(tabs)/overview" />;
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
});
