// Warning: AsyncStorage has been extracted from react-native core and will be removed in a future release.
// It can now be installed and imported from '@react-native-community/async-storage' instead of 'react-native'.
// See https://github.com/react-native-community/async-storage

// have yet to do the styling for placerow screen, account screen
// About Screen

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import {COLORS, SIZES, icons} from '../constants';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {key} from './savedLocations';

// UI stuff
import Icon from 'react-native-vector-icons/Ionicons';

navigator.geolocation = require('@react-native-community/geolocation');

const Home = ({navigation}) => {
  const [currentLocLat, setCurrentLocLat] = useState(null);
  const [currentLocLng, setCurrentLocLng] = useState(null);
  const [region, setRegion] = useState(null);
  const [savedData, setSavedData] = useState(null); // to hold the array of saved data, from key 'savedplaces'

  // THIS LADIES AND GENTLEMEN IS HOW YOU SET THE INITIAL LOCATION TO THE USER LOCATION!!! WOOHOOOOOO!!!!

  useEffect(() => {
    console.log('Getting current location');
    Geolocation.getCurrentPosition(
      info => {
        let currentLocLat = info.coords.latitude;
        console.log('This is the currentLocLat value:', currentLocLat);
        let currentLocLng = info.coords.longitude;
        console.log('This is the currentLocLng value:', currentLocLng);
        let region = {
          latitude: currentLocLat,
          longitude: currentLocLng,
          latitudeDelta: 0.00422,
          longitudeDelta: 0.0121,
        };
        console.log('This is the region value:', region);
        setCurrentLocLat(currentLocLat);
        setCurrentLocLng(currentLocLng);
        setRegion(region);
      },
      error => {
        alert(error);
        console.log(error);
      },

      // you should keep enableHighAccuracy to true, as it will request for GPS location
      // keeping it to false will only request the location from wifi, and your emulator isnt connected to wifi
      {enableHighAccuracy: true, timeout: 10000, maximumAge: 10000},
    );
  }, [currentLocLat, currentLocLng]);

  // this will be the drawer open button
  function renderHeader() {
    return (
      <View
        style={{
          position: 'absolute',
          top: SIZES.padding * 2.5,
          left: SIZES.padding * 2.5,
        }}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Icon name="ios-options-sharp" size={30} color={COLORS.black} />
        </TouchableOpacity>
      </View>
    );
  }

  function renderBackButton() {
    return (
      <View
        style={{
          position: 'absolute',
          top: SIZES.padding * 7,
          left: SIZES.padding * 2.5,
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack(); // supposed to go to StartUp Screen
          }}>
          <Icon name="arrow-back" size={33} color={COLORS.black} />
        </TouchableOpacity>
      </View>
    );
  }

  function renderMap() {
    return (
      <MapView
        style={{
          flex: 1,
        }}
        provider={PROVIDER_GOOGLE}
        initialRegion={region}
        showsUserLocation={true}
        showsMyLocationButton={false}
      />
    );
  }

  // the popUp has to be a list that shows the past few searches
  // you can import that data set into this page and check if its null, if it is, then display nothing,
  // if not null, map the latest 3 searches into the area below "Where To?", and give this component originally no height element!

  function renderPopUp() {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: COLORS.DarkestGreyBase,
          width: '95%',
          flexDirection: 'row',
          marginVertical: SIZES.padding * 1.2,
          alignSelf: 'center',
          borderRadius: SIZES.radius / 3.5,
          justifyContent: 'center',
          padding: SIZES.padding,
          position: 'absolute',
          bottom: SIZES.padding * 6,
        }}
        onPress={async () => {
          // setIsTouch(true);
          const jsonValue = await AsyncStorage.getItem(key);
          const stored = JSON.parse(jsonValue); // this is the json data from savedplaces, in array form
          console.log('This is stored from Home -------------------', stored);
          navigation.navigate('DropOff', {
            incomingData: stored, // this outgoing data to the next page holds the latest list of saved data
          });
        }}>
        <Text
          style={{
            alignSelf: 'center',
            fontSize: 20,
            fontFamily: 'SF-UI-Display-Bold',
            padding: SIZES.padding / 3,
          }}>
          Where to?
        </Text>
      </TouchableOpacity>
    );
  }

  // function renderPopUp() {
  //   return (
  //     <View
  //       style={{
  //         position: 'absolute',
  //         bottom: 0,
  //         backgroundColor: COLORS.white,
  //         width: '100%',
  //         borderTopLeftRadius: SIZES.radius / 1.5,
  //         borderTopRightRadius: SIZES.radius / 1.5,
  //         height: SIZES.padding * 22,
  //       }}>
  //       <TouchableOpacity
  //         style={{
  //           backgroundColor: COLORS.DarkerGreyBase,
  //           width: '85%',
  //           flexDirection: 'row',
  //           marginVertical: SIZES.padding * 1.2,
  //           alignSelf: 'center',
  //           borderRadius: SIZES.radius,
  //           justifyContent: 'center',
  //           padding: SIZES.padding,
  //           position: 'absolute',
  //           bottom: SIZES.padding * 15.1,
  //         }}
  //         onPress={async () => {
  //           const jsonValue = await AsyncStorage.getItem(key);
  //           const stored = JSON.parse(jsonValue); // this is the json data from savedplaces, in array form
  //           console.log('This is stored from Home -------------------', stored);
  //           navigation.navigate('DropOff', {
  //             incomingData: stored, // this outgoing data to the next page holds the latest list of saved data
  //           });
  //         }}>
  //         <Text
  //           style={{
  //             alignSelf: 'center',
  //             fontSize: 20,
  //             fontFamily: 'SFProDisplay-Regular',
  //           }}>
  //           Where to?
  //         </Text>
  //       </TouchableOpacity>
  //     </View>
  //   );
  // }

  return (
    <SafeAreaView style={styles.container}>
      {renderMap()}
      {renderPopUp()}
      {renderHeader()}
      {renderBackButton()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backNavArrow: {
    width: 20,
    height: 20,
    tintColor: COLORS.white,
    marginLeft: SIZES.padding * 1.3,
    marginTop: SIZES.padding * 1.3,
  },
  backNavCircle: {
    backgroundColor: COLORS.primary,
    height: 45,
    width: 45,
    borderRadius: SIZES.radius,
    marginLeft: SIZES.padding * 2,
    marginTop: SIZES.padding * 2,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
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

export default Home;
