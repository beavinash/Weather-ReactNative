import * as React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { Constants } from 'expo'
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation'

import homeScreen from './app/screens/HomeScreen.js'
import searchScreen from './app/screens/CitySearchScreen.js'
import zipCodeSearchScreen from './app/screens/ZipCodeSearchScreen.js'

// You can import from local files
// import AssetExample from './components/AssetExample';

// or any pure javascript modules available in npm
// import { Card } from 'react-native-elements'; // Version can be specified in package.json

const App = createBottomTabNavigator({
  ZipCode: { screen: zipCodeSearchScreen },
  Home: { screen: homeScreen },
  Search: { screen: searchScreen }
},
{
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false,
  }
});

export default App;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingTop: Constants.statusBarHeight,
//     backgroundColor: '#ecf0f1',
//   },
//   paragraph: {
//     margin: 24,
//     fontSize: 18,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     color: '#34495e',
//   },
// })
