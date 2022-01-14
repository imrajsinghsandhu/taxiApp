import React, {useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  LogBox,
} from 'react-native';
import {COLORS, SIZES, icons} from '../constants';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import googleAPIKey from '../config';
import PlaceRow from './PlaceRow';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {key, getLength, clearAll} from './savedLocations';

// UI stuff
import Icon from 'react-native-vector-icons/Ionicons';
import {FONTS, mainFont} from '../constants/theme';

const addPlace = props => {
  LogBox.ignoreAllLogs();

  const [savedAddress, setSavedAddress] = useState(null);
  const [nameText, setNameText] = useState(null);
  const [savedData, setSavedData] = useState(null); // for the savedPlaces data, array type
  const [displayedName, setDisplayedName] = useState(null);
  const [addressState, setAddressState] = useState(true);

  // for textInputbelow
  const [textInputItems, setTextInput] = useState('');

  // this useRef is a very helpful piece of code that helps me maintain initialstate of the entire component!
  const checkBang = useRef({
    value: null,
  });

  // this hook is to specifically mantain the updated state.
  const [updated, setUpdated] = useState(false);

  const [able, setAble] = useState(true);

  function checkIfAble() {
    if (nameText && textInputItems.length > 1) {
      setAble(false);
    } else {
      setAble(true);
    }
  }
  useEffect(() => {
    checkIfAble();
  }, [nameText, savedAddress]);

  const readItemFromStorage = async () => {
    const jsonValue = await AsyncStorage.getItem(key);
    const stored = JSON.parse(jsonValue); // this is the json data from savedplaces, in array form
    setSavedData(stored);
  };

  // on mount
  useEffect(() => {
    setUpdated(false); // the updated status should always be set to false upon start of an adding session!
    readItemFromStorage();
  }, []);

  let testcoords = null;

  useEffect(() => {
    // checkIfAble();
    if (checkBang.current.value == null) {
      try {
        if (props.route.params.selectedAddress != null || undefined) {
          tester();
          const coordObj = {
            details: {
              geometry: {
                location: {
                  lat: props.route.params.Lat,
                  lng: props.route.params.Lng,
                },
              },
            },
          };
          testcoords = coordObj;
          checkBang.current?.setAddressText({
            checkBang: false,
          }); // lets see if this works?
        }
      } catch (error) {
        console.log(error);

        checkBang.current.value = false; // lets see if this works?
      }
    }
    return function baby() {};
  });

  function tester() {
    const check = props.route.params.selectedAddress; // could be null
    console.log('This is check data', check);

    return setTextInput(check);
  }

  const checkOrigin = () => {
    // the "" allows us to catch the instance where the nameText is an empty string
    // and then from there return the appropriate radius
    if (nameText === '') {
      return 0;
    } else if (nameText === null) {
      return 0;
    } else {
      return SIZES.radius;
    }
  };

  const checkDestination = () => {
    if (savedAddress === null) {
      return 0;
    } else {
      return SIZES.radius;
    }
  };

  async function isDataUpdated(foo) {
    try {
      // this part is forming the data to send into the array
      const len = await getLength({key: foo.key});
      const lastElementPos = len == 0 ? 0 : len - 1;
      const old_jsonValue = await AsyncStorage.getItem(foo.key); // LITERALLY JUST COS I DIDNT HAVE THIS AWAIT I COULDNT DO ANYTHING ELSE!!!!
      let old_data = JSON.parse(old_jsonValue);

      // getting last element id and then converting the string result to a number, so we can add/subtract

      function lenCheck() {
        if (len == 0) {
          return 0;
        } else {
          const lastElementID = old_data[lastElementPos].id;
          const numTypeID = parseInt(lastElementID);
          const newDataID = numTypeID + 1;
          return newDataID;
        }
      }

      const new_data = {
        id: lenCheck(),
        description: foo.description,
        displayed: foo.displayed,
        geometry: {
          location: {
            lat: foo.lat,
            lng: foo.lng,
          },
        },
      };

      // this part we have to get the entire whole array with the corressponding key value
      // warning, this old_data could be empty and this would mean that the length could return undefined?
      // const old_jsonValue = await AsyncStorage.getItem(foo.key); // LITERALLY JUST COS I DIDNT HAVE THIS AWAIT I COULDNT DO ANYTHING ELSE!!!!
      // let old_data = JSON.parse(old_jsonValue);

      // assignment statement to add new_data to the end of the old_data array
      if (old_data === null) {
        const jsonValue = JSON.stringify([new_data]);
        await AsyncStorage.setItem(foo.key, jsonValue);
        console.log('Data has been added, where there was originally none');
        return setUpdated(true);
      } else {
        old_data[len] = new_data;
        let consolidated_data = old_data;
        const jsonValue = JSON.stringify(consolidated_data);

        // sending new data to the key... i wonder if there would be a difference in doing this vs merge_items abstraction! TEST
        await AsyncStorage.setItem(foo.key, jsonValue);
        console.log('Data has been added to the stored array');

        return props.navigation.navigate('editSavedPlaces', {
          incomingData: consolidated_data,
        });
      }
    } catch (e) {
      console.log(`Error while trying to add Data into an array: ${e}`);
    }
  }

  function disabledColourChecker() {
    if (nameText && savedAddress) {
      return COLORS.green;
    } else {
      return COLORS.lightGray2;
    }
  }

  function renderHeader() {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: SIZES.padding * 5,
          marginHorizontal: SIZES.padding / 2,
          paddingBottom: SIZES.padding,
          // borderBottomWidth:0.9
        }}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            left: SIZES.padding * 2.1,
            paddingBottom: SIZES.padding * 2.9,
          }}
          onPress={() => props.navigation.goBack()}>
          <Icon name="arrow-back" size={27} color={COLORS.black} />
          {/* <Image
            source={icons.back}
            style={{height: 23, width: 23}}
            color={COLORS.ContrastColour}
          /> */}
        </TouchableOpacity>

        {/* <Text style={{fontSize: 16.5, fontFamily: mainFont}}>
          Add to Saved Places
        </Text> */}

        <TouchableOpacity
          style={{
            position: 'absolute',
            right: SIZES.padding * 7.1,
            bottom: SIZES.padding * 0.8,
          }}
          onPress={() => {
            props.navigation.navigate('selectViaMaps', {
              from: 'addPlace',
            });
            checkBang.current.value = null;
          }}>
          <Icon name="map" size={22} color={COLORS.black} />
        </TouchableOpacity>

        {/* place the confirmation button at the top right */}
        {/* only appears when the nameText and savedAddress has been fulfilled  */}
        {/* will be a tick button */}
        {/* pressable only when the nameText and savedAddress fields have been filled */}
        <TouchableOpacity
          disabled={able}
          onPress={async () => {
            if (savedData === null) {
              // for when there isnt already any saved data in the key
              // and if the coordinate data
              if (testcoords === null) {
                const new_data = [
                  {
                    id: 0,
                    description: nameText,
                    displayed: displayedName,
                    geometry: {
                      location: savedAddress.details.geometry.location, // this contains lat & lng data
                    },
                  },
                ];
                const jsonValue = JSON.stringify(new_data);
                await AsyncStorage.setItem(key, jsonValue);
                console.log('New data has been added');
                props.navigation.goBack();
                // now a new data has been added
              } else {
                const new_data = [
                  {
                    id: 0,
                    description: nameText,
                    displayed: displayedName,
                    geometry: {
                      location: testcoords.details.geometry.location, // this contains lat & lng data
                    },
                  },
                ];
                const jsonValue = JSON.stringify(new_data);
                await AsyncStorage.setItem(key, jsonValue);
                console.log('New data has been added');
                props.navigation.goBack();
                // now a new data has been added
              }
            } else {
              if (testcoords === null) {
                await isDataUpdated({
                  key: key,
                  description: nameText,
                  displayed: savedAddress.data.structured_formatting.main_text,
                  lat: savedAddress.details.geometry.location.lat,
                  lng: savedAddress.details.geometry.location.lng,
                });
              } else {
                await isDataUpdated({
                  key: key,
                  description: nameText,
                  displayed: props.route.params.selectedAddress,
                  lat: testcoords.details.geometry.location.lat,
                  lng: testcoords.details.geometry.location.lng,
                });
              }
            }
          }}
          style={{
            position: 'absolute',
            right: SIZES.padding * 2.2,
            bottom: SIZES.padding * 0.5,
          }}>
          <Icon name="checkmark" size={30} color={disabledColourChecker()} />
        </TouchableOpacity>
      </View>
    );
  }

  function renderSearchField() {
    return (
      <View
        style={{
          width: '100%',
          justifyContent: 'center',
          paddingHorizontal: SIZES.padding,
        }}>
        <View
          style={{
            marginHorizontal: SIZES.padding * 1.8,
          }}>
          <TextInput
            maxLength={30}
            value={nameText}
            onChangeText={setNameText}
            placeholder="Name"
            style={{
              fontSize: 17,
              paddingHorizontal: SIZES.padding * 1.2,
            }}></TextInput>
        </View>

        <View
          style={{
            height: StyleSheet.hairlineWidth,
            width: '86%',
            backgroundColor: COLORS.black,
            alignSelf: 'center',
          }}
        />

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
              paddingVertical: SIZES.padding * 2,
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

        <GooglePlacesAutocomplete
          // this ref method is how you make a prefilled item in the search bar! WOOHOO!!
          // ref={ref}
          // placeholder="Address"
          textInputProps={{
            onChangeText: setTextInput,
            value: textInputItems,
            placeholder: 'Address',
          }}
          onPress={(data, details = null) => {
            console.log('this is saved address data:', data);
            setSavedAddress({data, details});
            testcoords = null; // resetting this
            if (data.description == undefined) {
              setTextInput(data.vicinity);
            } else {
              setTextInput(data.description);
            }
          }}
          enablePoweredByContainer={false}
          suppressDefaultStyles
          styles={{
            textInput: {
              padding: SIZES.padding,
              marginLeft: 20,
              fontSize: 17,
              backgroundColor: COLORS.white,
            },
            container: {
              position: 'absolute',
              left: 10,
              right: 20,
              top: 50,
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
          renderRow={data => <PlaceRow data={data} from={'addPlace'} />}
          renderDescription={data => data.description || data.vicinity}
          renderRightButton={() => renderRightButton()}
        />
      </View>
    );
  }

  function renderRightButton() {
    return textInputItems.length > 0 ? (
      <TouchableOpacity
        onPress={() => {
          setTextInput('');
          setSavedAddress(null);
          setSavedData(null);
        }}
        style={{
          position: 'absolute',
          right: SIZES.padding * 1.4,
          top: SIZES.padding * 1.6,
        }}>
        <Icon name="close-circle" size={22} color={COLORS.lightGray2} />
      </TouchableOpacity>
    ) : null;
  }

  function renderTitle() {
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
          Add to Saved Places
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderSearchField()}
      {renderTitle()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    // margin: SIZES.padding/1.5
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
    elevation: 0,
  },
});

export default addPlace;
