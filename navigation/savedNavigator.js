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

const Stack = createStackNavigator();

const savedNavigator = props => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="editSavedPlaces" component={editSavedPlaces} />
      <Stack.Screen name="savedLocations" component={savedLocations} />
      <Stack.Screen name="selectViaMaps" component={selectViaMaps} />
      <Stack.Screen name="addPlace" component={addPlace} />
    </Stack.Navigator>
  );
};

export default savedNavigator;
