import { Image } from 'expo-image';
import { Platform, StyleSheet, View } from 'react-native'
import Navbar from '../../components/ui/Navbar.jsx'
import TabBar from '../../components/ui/TabBar.jsx';
import BottomBar from '../../components/ui/BottomBar.jsx';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={{height:'100%', flex:1}}>
      <Navbar />
      <TabBar />
      <BottomBar />
    </View>
  );
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
