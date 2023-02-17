/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Application Imports
import Spotify from './src/Spotify/App'
import Parallax from './src/Parallax'
import StackCarousel from './src/Stack-Carousel'
import FlatlistAnim from './src/Flatlist-Animation/App'
import SpotifyPlayer from './src/Spotify-Player/App'
import Pan from './src/Pan'
import Monzo from './src/MonzoCards/App'
import AirBnb from './src/Airbnb-Intros/App'
import Chrome from './src/Chrome-Refresh/App'
import ClearTodos from './src/Clear-Todos/App'
import Learnji from './src/Learnji/App'
import Safari from './src/Safari-Tabs/App'
import BbcPlayer from './src/Bbc-Iplayer/App'
import AppStore from './src/Appstore-Transition/App'
import Bedtime from './src/Apple-Bedtime/App'
import Flipboard from './src/Flipboard/App'

interface Comp {
  key: number;
  name: string;
  comp: string;
}

type Comps = Array<Comp>

const comps: Comps = [
  { key: 1, name: 'Spotify Scrollable Header', comp: 'Spotify' },
  { key: 2, name: 'Advanced Parallax', comp: 'Parallax' },
  { key: 3, name: 'FlatList stack carousel', comp: 'StackCarousel' },
  { key: 4, name: 'FlatList Animation', comp: 'FlatlistAnim' },
  { key: 5, name: 'Spotify Player', comp: 'SpotifyPlayer' },
  { key: 6, name: 'Monzo Cards', comp: 'Monzo' },
  { key: 7, name: 'AirBnb Intros', comp: 'AirBnb' },
  { key: 16, name: 'Flipboard Animation', comp: 'Flipboard' },
  { key: 8, name: 'Art', comp: 'Pan' },
  { key: 9, name: 'Chrome Drag', comp: 'Chrome' },
  { key: 10, name: 'Clear todos', comp: 'ClearTodos' },
  { key: 11, name: 'Learnji Emojis', comp: 'Learnji' },
  { key: 12, name: 'Safari tabs', comp: 'Safari' },
  { key: 13, name: 'Bbc iplayer', comp: 'BbcPlayer' },
  { key: 14, name: 'Appstore Shared Transition', comp: 'AppStore' },
  { key: 15, name: 'Appstore Bedtime Slider', comp: 'Bedtime' },
]

type HomeScreenProps = {
  navigation: {
    navigate: Function
  }
}

const HomeScreen = ({ navigation }: (HomeScreenProps)) => {
  return (
    <View style={styles.container}>
      <ScrollView>
        {comps.map((comp, i) => (
          <TouchableOpacity key={i} style={styles.btn} onPress={() => navigation.navigate(`${comp.comp}`)}>
            <View>
              <Text style={styles.btnText}>{comp.comp}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

const App = () => {

  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Spotify" component={Spotify} />
        <Stack.Screen name="Parallax" component={Parallax} />
        <Stack.Screen name="StackCarousel" component={StackCarousel} />
        <Stack.Screen name="FlatlistAnim" component={FlatlistAnim} />
        <Stack.Screen name="SpotifyPlayer" component={SpotifyPlayer} />
        <Stack.Screen name="Pan" component={Pan} />
        <Stack.Screen name="Monzo" component={Monzo} />
        <Stack.Screen name="AirBnb" component={AirBnb} />
        <Stack.Screen name="Chrome" component={Chrome} />
        <Stack.Screen name="ClearTodos" component={ClearTodos} />
        <Stack.Screen name="Learnji" component={Learnji} />
        <Stack.Screen name="Safari" component={Safari} />
        <Stack.Screen name="BbcPlayer" component={BbcPlayer} />
        <Stack.Screen name="AppStore" component={AppStore} />
        <Stack.Screen name="Bedtime" component={Bedtime} />
        <Stack.Screen name="Flipboard" component={Flipboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 80,
    paddingHorizontal: 25,
    alignItems: 'stretch'
  },
  btn: {
    borderRadius: 10,
    padding: 10,
    backgroundColor: 'lightgray',
    alignItems: 'center',
    marginBottom: 10
  },
  btnText: {
    fontSize: 24,
    fontWeight: '600'
  }
});

export default App;
