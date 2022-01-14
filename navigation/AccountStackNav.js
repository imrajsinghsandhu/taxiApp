import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import UpdateEmailScreen from '../screens/UpdateEmailScreen';
import AccountDetailScreen from '../screens/AccountDetailScreen';
import UpdatePhoneNumber from '../screens/UpdatePhoneNumber';

const Stack = createStackNavigator();

const AccountStackNav = props => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="AccountDetailScreen"
        component={AccountDetailScreen}
      />
      <Stack.Screen name="UpdateEmailScreen" component={UpdateEmailScreen} />
      <Stack.Screen name="UpdatePhoneNumber" component={UpdatePhoneNumber} />
    </Stack.Navigator>
  );
};

export default AccountStackNav;
