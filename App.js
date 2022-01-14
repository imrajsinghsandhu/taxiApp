import React, {useEffect} from 'react';
import {PermissionsAndroid, Platform, StatusBar} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import RootNavigator from './navigation/RootNavigator';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {LoadingScreen} from './screens';
import StackNavigationAuth from './screens/AuthFlow/authNavigation/StackNavigationAuth';
import PhoneLogInScreen from './screens/AuthFlow/PhoneLogInScreen';

// importing the screens
// this page is how you allow for navigation between screens! You then have to add the parameter {navigation} in your individual screen lambda functions!

// const NavContainer = NavigationContainer(StackNavigationAuth);

const AppSwitchNavigator = createSwitchNavigator({
  loadScreen: LoadingScreen,
  SignUpScreen: StackNavigationAuth,
  MainScreen: RootNavigator,
  PhoneSignUp: PhoneLogInScreen,
});

const AppNavigator = createAppContainer(AppSwitchNavigator);

navigator.geolocation = require('@react-native-community/geolocation');

const App = props => {
  const androidPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'myTaxi location Permission',
          message:
            'myTaxi needs access to your location ' +
            'so you can take awesome rides on my cock.',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the location');
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  // this hook will only run when you open the app!
  useEffect(() => {
    if (Platform.OS === 'android') {
      androidPermission();
    } else {
      // request for iOS
      Geolocation.requestAuthorization();
    }
  }, []);

  return (
    <AppNavigator>
      <StatusBar barStyle="dark-content" />
      <RootNavigator />
    </AppNavigator>
  );
};

export default App;
