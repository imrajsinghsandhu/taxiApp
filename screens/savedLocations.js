// in this page, we edit the specific savedPlace, or completely delete it

import React, {useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {COLORS, SIZES, icons, FONTS} from '../constants';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import googleAPIKey from '../config';
import PlaceRow from './PlaceRow';
import AsyncStorage from '@react-native-async-storage/async-storage';

// UI stuff
import Icon from 'react-native-vector-icons/Ionicons';
import {mainFont} from '../constants/theme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// requires key : <string>
export const getLength = async props => {
  try {
    const jsonValue = await AsyncStorage.getItem(props.key);
    // assuming that stored_data is of array type
    const stored_data =
      JSON.parse(jsonValue) != null ? JSON.parse(jsonValue) : undefined;
    const len = stored_data != undefined || null ? stored_data.length : 0;
    console.log(`Array length of stored_data: ${len}`);
    return len;
  } catch (e) {
    console.log('Error getting the length of the array_data');
  }
};

// requires key, description, lat, lng, displayed : <string>,
export const addData = async props => {
  try {
    // this part is forming the data to send into the array
    const len = await getLength({key: props.key});
    const new_data = {
      id: len.toString(),
      description: props.description,
      displayed: props.displayed,
      geometry: {
        location: {
          lat: props.lat,
          lng: props.lng,
        },
      },
    };

    // this part we have to get the entire whole array with the corressponding key value
    // warning, this old_data could be empty and this would mean that the length could return undefined?
    const old_jsonValue = await AsyncStorage.getItem(props.key); // LITERALLY JUST COS I DIDNT HAVE THIS AWAIT I COULDNT DO ANYTHING ELSE!!!!
    let old_data = JSON.parse(old_jsonValue);

    // assignment statement to add new_data to the end of the old_data array
    if (old_data === null) {
      const jsonValue = JSON.stringify([new_data]);
      await AsyncStorage.setItem(props.key, jsonValue);
      console.log('Data has been added, where there was originally none');
      return;
    } else {
      old_data[len] = new_data;
      let consolidated_data = old_data;
      const jsonValue = JSON.stringify(consolidated_data);

      // sending new data to the key... i wonder if there would be a difference in doing this vs merge_items abstraction! TEST
      await AsyncStorage.setItem(props.key, jsonValue);
      console.log('Data has been added to the stored array');
    }
  } catch (e) {
    console.log(`Error while trying to add Data into an array: ${e}`);
  }
};

// requires key, selectedId(when user presses the button) : <string>
// for testing purposes this function will only for now try to delete the id:1 data from savedplaces array
export const deleteData = async props => {
  try {
    // this is assuming the data object is already an array
    // and that there has to be minimally one data in array for the
    // delete button to appear
    const old_jsonValue = await AsyncStorage.getItem(props.key);
    const stored = JSON.parse(old_jsonValue);
    // stored is now an array and to access items in the array you have to O(1) access them via stored[x]
    const new_arr = stored.filter(item => item.id != props.id); // this returns only items in the array that are not id:0

    // remember to check and see what happens if you send a null back to the savedplaces key
    // does the key now hold a null value? or does it not change at all? WORKS PERFECTLY!!! YAY!!! :D

    // for case where new_arr != null
    // posting the new_arr to replace savedplaces value
    const jsonValue = JSON.stringify(new_arr);
    await AsyncStorage.setItem(props.key, jsonValue);
    console.log('An item from the list has been deleted successfully');
  } catch (error) {
    console.log('Error while deleting data:', error);
  }
};

// empty the ENTIRE AsyncStorage
export const clearAll = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    // clear error
  }

  console.log('Done.');
};

export const getAllKeys = async () => {
  let keys = [];
  try {
    keys = await AsyncStorage.getAllKeys();
  } catch (e) {
    // read key error
  }

  console.log(keys);
  // example console.log result:
  // ['@MyApp_user', '@MyApp_key']
};

export const key = 'savedplaces';

const savedLocations = ({navigation, route}) => {
  const [savedAddress, setSavedAddress] = useState(null);
  const [nameText, setNameText] = useState(null);
  const [savedData, setSavedData] = useState(null); // for the savedPlaces data, array type
  const [selectedID, setselectedID] = useState(null); // this is for the id of the option you have picked in the previous page

  const [addressState, setAddressState] = useState(true);

  const readItemFromStorage = async () => {
    const jsonValue = await AsyncStorage.getItem(key);
    const stored = JSON.parse(jsonValue); // this is the json data from savedplaces, in array form
    setSavedData(stored);
    console.log('This is the stored data *********************', stored);
  };

  // this is going to run upon mounting
  useEffect(() => {
    readItemFromStorage();
    let {nameText, selectedID} = route.params;
    setNameText(nameText);
    setselectedID(selectedID); // this will set the ID variable upon rendering of screen
    // console.log('This is who you selected ----------', nameText);
    // console.log('This is their selected ID', selectedID);
    // console.log('This is their displayed address', displayed);
  }, []);

  const checkOrigin = () => {
    if (nameText === null) {
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

  // this is the brilliant function that allows for the list in the
  // previous screen to be updated.
  async function isDeleted(foo) {
    try {
      // this is assuming the data object is already an array
      // and that there has to be minimally one data in array for the
      // delete button to appear
      const old_jsonValue = await AsyncStorage.getItem(foo.key);
      const stored = JSON.parse(old_jsonValue);
      // stored is now an array and to access items in the array you have to O(1) access them via stored[x]
      const new_arr = stored.filter(item => item.id != foo.id); // this returns only items in the array that are not id:0

      // remember to check and see what happens if you send a null back to the savedplaces key
      // does the key now hold a null value? or does it not change at all? WORKS PERFECTLY!!! YAY!!! :D

      // for case where new_arr != null
      // posting the new_arr to replace savedplaces value
      const jsonValue = JSON.stringify(new_arr);
      await AsyncStorage.setItem(foo.key, jsonValue);
      console.log('An item from the list has been deleted successfully');

      return navigation.navigate('editSavedPlaces', {
        incomingData: new_arr,
      });
    } catch (error) {
      console.log('Error while deleting data:', error);
    }
  }

  // copy paste from addPlace screen,
  // this function creates the new object data, and then puts this new data at the
  // end of the entire array of the key value foo.key

  // so to modify this function to suit our needs, we just assign new_data to array[id],
  // then follow suit in creating consolidated_data!
  // this function will now take in an "id" parameter too!
  async function isDataUpdated(foo) {
    try {
      // this part is forming the data to send into the array
      const new_data = {
        id: foo.id,
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
      const old_jsonValue = await AsyncStorage.getItem(foo.key); // LITERALLY JUST COS I DIDNT HAVE THIS AWAIT I COULDNT DO ANYTHING ELSE!!!!
      let old_data = JSON.parse(old_jsonValue);

      // assignment statement to replace old_data with new_data
      old_data[foo.id] = new_data;
      let consolidated_data = old_data;
      const jsonValue = JSON.stringify(consolidated_data);

      // sending new data to the key
      await AsyncStorage.setItem(foo.key, jsonValue);
      console.log('Data has been added to the stored array');

      return navigation.navigate('editSavedPlaces', {
        incomingData: consolidated_data,
      });
    } catch (e) {
      console.log(`Error while trying to add Data into an array: ${e}`);
    }
  }

  async function onlyUpdateName(props) {
    try {
      const new_name = props.description;

      const old_jsonValue = await AsyncStorage.getItem(props.key);
      let old_data = JSON.parse(old_jsonValue);

      // okay now you have the old data
      // now you will access the correct array element, save object to target_object
      const target_object = old_data[props.id];
      const new_data = {
        id: props.id,
        description: new_name,
        displayed: target_object.displayed,
        geometry: target_object.geometry,
      };

      // now that i have built the new_data, i will go on to replace the array element with this new data
      old_data[props.id] = new_data;

      let consolidated_data = old_data;
      const jsonValue = JSON.stringify(consolidated_data);

      await AsyncStorage.setItem(props.key, jsonValue);
      console.log('Data has changed nameText');

      return navigation.navigate('editSavedPlaces', {
        incomingData: consolidated_data,
      });
    } catch (error) {
      console.log(
        `Error while updating the changed name of the data structure: ${error}`,
      );
    }
  }

  function renderHeader() {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: SIZES.padding * 1.8,
          marginHorizontal: SIZES.padding / 2,
          paddingBottom: SIZES.padding,
          // backgroundColor: COLORS.ContrastColour,
          height: 58,
        }}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            left: SIZES.padding * 2,
            paddingBottom: SIZES.padding,
          }}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={27} color={COLORS.black} />
        </TouchableOpacity>

        {/* this is the delete button, do find the correct button to represent this icon */}
        <TouchableOpacity
          style={{
            position: 'absolute',
            right: SIZES.padding * 2.5,
            paddingBottom: SIZES.padding * 1.3,
          }}
          onPress={async () => {
            await isDeleted({
              key: key,
              id: selectedID,
            });
          }}>
          <MaterialIcons name="delete" size={28} />
        </TouchableOpacity>
      </View>
    );
  }

  function renderAddingLocation() {
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
          // textInputProps={{
          //   placeholder: 'prefilled',
          //   placeholderTextColor: COLORS.primary, // find a lighter color for the placeholder
          // }}
          placeholder={route.params.displayed}
          onPress={(data, details = null) => {
            console.log('this is saved address data:', data);
            setSavedAddress({data, details});
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
              right: 10,
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
          renderRow={data => <PlaceRow data={data} from={'savedLocations'} />}
          renderDescription={data => data.description || data.vicinity}
        />
      </View>
    );
  }

  function renderSavedChanges() {
    return (
      <View
        style={{
          position: 'absolute',
          justifyContent: 'center',
          alignItems: 'center',
          bottom: SIZES.padding * 1.8,
          width: '95%',
          alignSelf: 'center',
        }}>
        <TouchableOpacity
          //   onPress will route to selectAddress screen!
          // hopefully this method passes the required information to the previous screen --> which will be editSavedPlaces.js!
          onPress={async () => {
            // case where nameText has value, and savedAddress has been ammended
            if (nameText && savedAddress) {
              // will update both the nameText and savedAddres information, covering 2 scenarios alr
              await isDataUpdated({
                key: key,
                id: selectedID,
                description: nameText,
                displayed: savedAddress.data.structured_formatting.main_text,
                geometry: {
                  location: savedAddress.details.geometry.location, // this contains lat & lng data
                },
              });
              // case where nameText has value, and only nameText has been ammended, savedAddress remains the same, untouched
            } else if (nameText) {
              // update only the name for the data structure
              await onlyUpdateName({
                key: key,
                id: selectedID,
                description: nameText,
                // rest of the fields not required since only mending name of saved place!
              });
            } else {
            }
          }}
          style={{
            width: '91%',
            backgroundColor: COLORS.DarkestBase, // remember that it will be grey first, then change to blue when the contents have been filled
            borderRadius: SIZES.radius / 1.1,
            alignItems: 'center',
          }}
          // I want the onPress colour to change from grey to some shade of blue - TAKE NOTE!
        >
          <Text
            style={{
              fontSize: 17,
              fontWeight: '700',
              color: '#ffffff',
              fontFamily: mainFont,
              padding: SIZES.padding,
            }}>
            Save Changes
          </Text>
        </TouchableOpacity>
      </View>
    );
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
          Saved Location
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderTitle()}
      {renderHeader()}
      {renderAddingLocation()}
      {renderSavedChanges()}
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

export default savedLocations;
