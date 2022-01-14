import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Text,
} from 'react-native';
import {COLORS, icons, SIZES} from '../constants';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import googleAPIKey from '../config';
import PlaceRow from './PlaceRow';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {key} from './savedLocations';

// UI stuff
import Icon from 'react-native-vector-icons/Ionicons';
import {FONTS, mainFont} from '../constants/theme';

// You will have the search boxes up top
// and then have a scroll-list below the search fields

// left to find out how to connect the search fields to the selectViaMaps function.

const DropOff = props => {
  const [originPlace, setOriginPlace] = useState(null);
  const [destinationPlace, setDestinationPlace] = useState(null);
  const [storage, setStorage] = useState(null); // the one that holds all the data of the key = 'savedPlaces'
  const [addressState, setAddressState] = useState(true);
  const [displayText, setDisplayText] = useState('');
  const [toText, setToText] = useState(''); // for the to destination display text

  // console.log('This will indicate the no. characters', displayText.length); // you will need to use displaytext next time
  // selectViaMaps will not be accessible via DropOff, unless the originPlace or DestinationPlace fields are empty

  const readItemFromStorage = async () => {
    console.log('Reading localStorage via AsyncStorage');
    const jsonValue = await AsyncStorage.getItem(key);
    const stored = JSON.parse(jsonValue);
    setStorage(stored);
  };

  // this will hold the 'DropOff' tag, indicating the data is coming into the dropoff page

  function nullCheck() {
    return props.route.params.whereFrom === undefined
      ? null
      : props.route.params.whereFrom;
  }

  const comingFor = nullCheck(); // runs a function that checks if incoming selectedAddress is null or undefined or smth else

  const checkBang = useRef({
    value: null,
  });

  useEffect(() => {
    // we read the saved local data storage for the whole data structure
    readItemFromStorage();
  }, []);

  useEffect(() => {
    checkIfAble();
    try {
      // that means there is an intent coming in from DropOff, with data in route.params
      if (checkBang.current.value == null && comingFor == 'DropOff') {
        const coordObj = {
          data: {
            description: props.route.params.selectedAddress,
            structured_formatting: {
              main_text: props.route.params.selectedAddress,
            },
          },
          details: {
            geometry: {
              location: {
                lat: props.route.params.lat,
                lng: props.route.params.lng,
              },
            },
          },
        };

        // this if-else statement allows for us to check if either originPlace or destinationPlace is null
        if (originPlace == null) {
          setOriginPlace(coordObj);
          setDisplayText(props.route.params.selectedAddress);
          checkBang.current.value = false;
        } else if (destinationPlace == null) {
          setDestinationPlace(coordObj);
          setToText(props.route.params.selectedAddress);
          checkBang.current.value = false;
        }
      }
    } catch (error) {}
  });

  // navigates automatically to Comparison page with the parameters of originPlace, and destinationPlace
  // yet to find out the data structures of the parameters being passed...same as homePlace and workPlace?
  const checkNavigation = () => {
    console.log(
      '///////////////////////////// this is originPlace data:',
      originPlace, // this originPlace is verified to be one big object, with alot of data!
    );
    if (originPlace && destinationPlace) {
      props.navigation.navigate('Comparison', {
        originPlace: originPlace,
        destinationPlace: destinationPlace,
      });
    }
  };

  const checkOrigin = () => {
    if (originPlace === null) {
      return 0;
    } else {
      return SIZES.radius;
    }
  };

  const checkDestination = () => {
    if (destinationPlace === null) {
      return 0;
    } else {
      return SIZES.radius;
    }
  };

  useEffect(() => {
    checkNavigation(); // this checkNavigation() allows for us to automatically navigate to the comparison page, the moment originPlace, and destinationPlace are filled
    checkOrigin();
    checkDestination();
  }, [originPlace, destinationPlace]);

  const [able, setAble] = useState(false);

  function checkIfAble() {
    if (displayText && toText) {
      setAble(true);
    } else {
    }
  }

  function renderHeader() {
    return (
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: SIZES.padding * 2.5,
          marginBottom: SIZES.padding / 1.5,
        }}>
        {/* in this i will have the back button on the top left, followed by select via maps on the top right */}

        <TouchableOpacity
          style={{
            marginLeft: SIZES.padding * 2.1,
          }}
          onPress={() => props.navigation.goBack()}>
          <Icon name="arrow-back" size={30} color={COLORS.black} />
        </TouchableOpacity>

        {/* <Text
          style={{
            fontFamily: mainFont,
            fontSize: 17,
          }}>
          PickUp/DropOff locations
        </Text> */}
        <TouchableOpacity
          disabled={able}
          onPress={() => {
            props.navigation.navigate('selectViaMaps', {
              from: 'DropOff',
            });
            checkBang.current.value = null;
          }}
          style={{
            marginRight: SIZES.padding * 3.4,
            marginTop: SIZES.padding * 0.2,
          }}>
          {displayText.length == 0 || toText.length == 0 ? (
            <Icon name="map" size={24} color={COLORS.black} />
          ) : (
            <Icon name="map" size={24} color={COLORS.lightGray2} />
          )}
        </TouchableOpacity>
      </View>
    );
  }

  function renderRightButtonWhereFrom() {
    return displayText.length > 0 ? (
      <TouchableOpacity
        onPress={() => {
          setDisplayText('');
          setOriginPlace(null);
        }}
        style={{
          position: 'absolute',
          right: SIZES.padding * 1.4,
          top: SIZES.padding * 1.6,
        }}>
        <Icon name="close-circle" size={22} color={COLORS.lightGray2} />
        {/* <Image
          style={{
            height: 15,
            width: 15,
          }}
          source={icons.fire}
        /> */}
      </TouchableOpacity>
    ) : null;
  }

  function renderRightButtonWhereTo() {
    return toText.length > 0 ? (
      <TouchableOpacity
        onPress={() => {
          setToText('');
          setDestinationPlace(null);
        }}
        style={{
          position: 'absolute',
          right: SIZES.padding * 1.4,
          top: SIZES.padding * 1.6,
        }}>
        <Icon name="close-circle" size={22} color={COLORS.lightGray2} />

        {/* <Image
          style={{
            height: 15,
            width: 15,
          }}
          source={icons.fire}
        /> */}
      </TouchableOpacity>
    ) : null;
  }

  function renderSearch() {
    return (
      <View
        style={{
          marginTop: SIZES.padding * 0.5,
        }}>
        {/* in this i will have 2 search boxes and then a icon shape thingy on the left, basically another view component. Build the search fields first! */}

        <View
          style={{
            position: 'absolute',
            left: SIZES.padding * 1.5,
            top: SIZES.padding * 2,
            alignItems: 'center',
          }}>
          {/* here i will have the two easy to make icons that will denote start and end, connected by a thin link */}
          <View
            style={{
              backgroundColor: COLORS.DarkestBase,
              height: 10,
              width: 10,
              borderRadius: checkOrigin(),
            }}
          />

          <View
            style={{
              backgroundColor: COLORS.black,
              width: 0.75,
              paddingVertical: SIZES.padding * 2.1,
            }}
          />

          <View
            style={{
              backgroundColor: COLORS.LighterContrastColour,
              height: 10,
              width: 10,
              borderRadius: checkDestination(),
            }}
          />
        </View>

        <View>
          <GooglePlacesAutocomplete
            textInputProps={{
              value: displayText,
              onChangeText: setDisplayText,
              placeholder: 'Where From?',
            }}
            renderRightButton={() => renderRightButtonWhereFrom()}
            onPress={(data, details = null) => {
              console.log('this is current location data:', data);
              setOriginPlace({data, details});
              if (data.description == undefined) {
                setDisplayText(data.vicinity);
              } else {
                setDisplayText(data.description);
              }
            }}
            enablePoweredByContainer={false}
            suppressDefaultStyles
            currentLocation={true}
            currentLocationLabel="Current Location"
            styles={{
              textInput: {
                padding: SIZES.padding,
                marginLeft: 20,
                fontSize: 17,
                backgroundColor: COLORS.white,
                marginRight: SIZES.padding * 2.5,
              },
              container: {
                position: 'absolute',
                top: 0,
                left: SIZES.padding,
                right: SIZES.padding,
              },
              listView: {
                position: 'absolute',
                top: 105,
              },
              separator: {
                backgroundColor: '#efefef',
                height: 1,
              },
            }}
            fetchDetails
            query={{
              key: googleAPIKey,
              language: 'en',
              components: 'country:sg',
            }}
            renderRow={data => (
              <PlaceRow
                data={data}
                incomingData={props.route.params.incomingData}
                from={'DropOff'}
              />
            )}
            renderDescription={data => data.description || data.vicinity}
            predefinedPlaces={props.route.params.incomingData} // from here we can see that predefinedPlaces takes in an array of savedData
          />

          {/* this is the separator between the two text fields */}
          <View
            style={{
              height: 0.6,
              backgroundColor: COLORS.black,
              position: 'absolute',
              top: SIZES.padding * 5,
              left: SIZES.padding * 4,
              right: SIZES.padding * 3,
            }}></View>

          {/* this is the "Where to?" part  */}

          <GooglePlacesAutocomplete
            textInputProps={{
              onChangeText: setToText,
              value: toText,
              placeholder: 'Where To?',
            }}
            onPress={(data, details = null) => {
              setDestinationPlace({data, details});
              setToText(data.description); // updates the value of toText
            }}
            enablePoweredByContainer={false}
            suppressDefaultStyles
            renderRightButton={() => renderRightButtonWhereTo()}
            styles={{
              textInput: {
                padding: SIZES.padding,
                marginLeft: 20,
                fontSize: 17,
                backgroundColor: COLORS.white,
                marginRight: SIZES.padding * 2.5,
              },
              container: {
                position: 'absolute',
                left: 10,
                right: 10,
                top: 55,
              },
              separator: {
                backgroundColor: '#efefef',
                height: 1,
              },
            }}
            fetchDetails
            query={{
              key: googleAPIKey,
              language: 'en',
              components: 'country:sg',
            }}
            renderRow={data => (
              <PlaceRow
                data={data}
                incomingData={props.route.params.incomingData}
                from={'DropOff'}
              />
            )}
            predefinedPlaces={props.route.params.incomingData}
          />
        </View>
      </View>
    );
  }

  const renderTitle = () => {
    return (
      <View
        style={{
          position: 'absolute',
          backgroundColor: COLORS.lightGray,
          alignSelf: 'center',
          top: SIZES.padding * 1.8,
          borderRadius: SIZES.radius,
          alignItems: 'center',
          justifyContent: 'center',
          // ...styles.shadow,
        }}>
        <Text
          style={{
            fontSize: 17,
            padding: SIZES.padding * 1.1,
            paddingHorizontal: SIZES.padding * 2,
            justifyContent: 'center',
            ...FONTS.body3,
            fontWeight: '700',
          }}>
          PickUp/DropOff
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderSearch()}
      {renderTitle()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  spinnerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DropOff;
