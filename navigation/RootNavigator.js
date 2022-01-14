import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import HomeNavigator from './Home';
import savedNavigator from './savedNavigator';
import CustomDrawer from './CustomDrawer';
import {editSavedPlaces, Home, StartUp} from '../screens';
import AccountStackNav from './AccountStackNav';
import AboutUs from '../screens/AboutUs';

const Drawer = createDrawerNavigator();

const DummyScreen = props => (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Text>{props.name}</Text>
  </View>
);

const RootNavigator = props => {
  return (
    <NavigationContainer>
      <Drawer.Navigator drawerContent={props => <CustomDrawer {...props} />}>
        {/* this will be for the slide drawer navigation, and i will set it to testScreen as the home component */}
        <Drawer.Screen name="Home" component={HomeNavigator} />

        <Drawer.Screen name="StartScreen" component={StartUp} />

        <Drawer.Screen name="Saved Places" component={savedNavigator} />

        <Drawer.Screen name="Account" component={AccountStackNav} />

        <Drawer.Screen name="AboutUs" component={AboutUs} />

        {/* <Drawer.Screen name="Account">
          {() => <DummyScreen name={'Settings'} />}
        </Drawer.Screen> */}
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
