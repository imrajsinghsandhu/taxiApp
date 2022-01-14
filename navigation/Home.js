import React from 'react';
import {
  Comparison,
  StartUp,
  Home,
  DropOff,
  savedLocations,
  editSavedPlaces,
  selectViaMaps,
  addPlace,
} from '../screens';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

const Stack = createStackNavigator();

const HomeNavigator = props => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {/* i changed the default screen to editSavedPlaces just to edit the UI first  */}
      <Stack.Screen name="StartUp" component={StartUp} />
      <Stack.Screen name="Comparison" component={Comparison} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="DropOff" component={DropOff} />
      <Stack.Screen name="savedLocations" component={savedLocations} />
      <Stack.Screen name="editSavedPlaces" component={editSavedPlaces} />
      <Stack.Screen name="selectViaMaps" component={selectViaMaps} />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
