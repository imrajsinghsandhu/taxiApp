import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SignUpScreen from '../SignUpScreen';
import ChoiceLogInScreen from '../ChoiceLogInScreen';
import EmailLogInScreen from '../EmailLogInScreen';
import PhoneLogInScreen from '../PhoneLogInScreen';
import {NavigationContainer} from '@react-navigation/native';
import ForgotPasswordScreen from '../ForgotPasswordScreen';
import OtpPhoneScreen from '../OtpPhoneScreen';

const Stack = createStackNavigator();

const StackNavigationAuth = props => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        <Stack.Screen name="ChoiceLogInScreen" component={ChoiceLogInScreen} />
        <Stack.Screen
          name="ForgotPasswordScreen"
          component={ForgotPasswordScreen}
        />
        <Stack.Screen name="EmailLogInScreen" component={EmailLogInScreen} />
        <Stack.Screen name="PhoneLogInScreen" component={PhoneLogInScreen} />
        <Stack.Screen name="OtpPhoneScreen" component={OtpPhoneScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigationAuth;
