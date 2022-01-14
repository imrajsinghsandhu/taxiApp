import React from 'react';
import {
  SafeAreaView,
  Image,
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import {COLORS, FONTS, icons, SIZES} from '../constants';
import Icon from 'react-native-vector-icons/Ionicons';
import {mainFont} from '../constants/theme';
import auth, {firebase} from '@react-native-firebase/auth';

const StartUp = ({navigation}) => {
  function renderText() {
    return (
      <View
        style={{
          margin: SIZES.padding * 2,
          flex: 1,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: COLORS.lightGray2,
          justifyContent: 'center',
        }}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Icon name="ios-options-sharp" size={30} color={COLORS.primary} />
        </TouchableOpacity>
        <View
          style={{
            paddingTop: SIZES.padding,
            paddingBottom: SIZES.padding * 1.5,
          }}>
          <Text
            style={{
              fontFamily: mainFont,
              fontSize: 19,
            }}>
            Hi there!
          </Text>

          <Text
            style={{
              fontFamily: mainFont,
              fontSize: 22,
              fontWeight: '800',
            }}>
            How can we help you today?
          </Text>
        </View>
      </View>
    );
  }

  function renderChoice() {
    return (
      <View
        style={{
          // margin: SIZES.padding *,
          flex: 1.5,
          backgroundColor: COLORS.LightestGreyBase,
          width: '93%',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          paddingTop: SIZES.padding,
          borderRadius: SIZES.radius * 0.8,
          alignSelf: 'center',
        }}>
        {/* ride comparison */}
        <TouchableOpacity
          style={{
            height: '92%',
            width: '35%',
            backgroundColor: COLORS.LightestGreyBase,
            borderRadius: SIZES.radius / 2,
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: SIZES.padding * 0.6,
          }}
          onPress={() => {
            console.log('we have pressed the button to go home');
            navigation.navigate('Home');
          }}>
          <Image
            source={icons.blueCar}
            style={{
              height: 145,
              width: 145,
            }}
          />

          <Text
            style={{
              fontFamily: mainFont,
              fontSize: 15,
              position: 'absolute',
              bottom: 0,
            }}>
            Ride Comparison
          </Text>
        </TouchableOpacity>

        {/* delivery option */}
        <TouchableOpacity
          disabled
          style={{
            height: '100%',
            width: '35%',
            backgroundColor: COLORS.LightestGreyBase,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: SIZES.radius / 2,
            paddingBottom: SIZES.padding * 0.6,
          }}>
          <Image
            source={icons.blueDeliveryCar}
            style={{
              height: 125,
              width: 125,
            }}
          />

          <Text
            style={{
              fontFamily: mainFont,
              fontSize: 15,
              position: 'absolute',
              bottom: SIZES.padding * 1.3,
            }}>
            Coming Soon!
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function renderAdArea() {
    return (
      <View
        style={{
          flex: 3,
          width: '100%',
          backgroundColor: COLORS.lightGray2,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: SIZES.padding,
          // marginRight: SIZES.padding,
        }}>
        <Text>Ads will be placed here</Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
        // margin: SIZES.padding,
      }}>
      {renderText()}
      {renderChoice()}
      {renderAdArea()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    margin: SIZES.padding,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 2,
    shadowRadius: 5,
    // elevation is the effect to make an element pop out even more.
    elevation: 4.5,
  },
});

export default StartUp;
