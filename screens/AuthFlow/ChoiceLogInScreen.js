// in this page, users will have the choice to sign in via email or phone number
import React from 'react';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {COLORS, SIZES} from '../../constants';

const ChoiceLogInScreen = props => {
  function renderChoiceButtons() {
    return (
      <View
        style={{
          width: '90%',
          alignSelf: 'center',
          position: 'absolute',
          top: SIZES.padding * 48,
          justifyContent: 'center',
          // alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('EmailLogInScreen')}
          style={{
            backgroundColor: COLORS.baseColour,
            paddingHorizontal: SIZES.padding * 2,
            paddingVertical: SIZES.padding * 1.3,
            borderRadius: SIZES.radius / 1,
            alignItems: 'center',
          }}>
          <Text
            style={{fontSize: 15.8, color: COLORS.white, fontWeight: '700'}}>
            Email Log In
          </Text>
        </TouchableOpacity>

        <View
          style={{
            paddingTop: SIZES.padding * 1.4,
          }}>
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate('PhoneLogInScreen', {
                comingFrom: 'ChoiceLogInScreen', // will send this data to the log in via phone number page so they can do what they need with this data
              })
            }
            style={{
              backgroundColor: COLORS.baseColour,
              paddingHorizontal: SIZES.padding * 2,
              paddingVertical: SIZES.padding * 1.3,
              borderRadius: SIZES.radius / 1,
              alignItems: 'center',
            }}>
            <Text
              style={{fontSize: 15.8, color: COLORS.white, fontWeight: '700'}}>
              Phone Log In
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return <SafeAreaView>{renderChoiceButtons()}</SafeAreaView>;
};

export default ChoiceLogInScreen;
