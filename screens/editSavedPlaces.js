import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Text,
  FlatList,
  LogBox,
} from 'react-native';
import {COLORS, icons, SIZES} from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {clearAll, key} from './savedLocations';
import Icon from 'react-native-vector-icons/Ionicons';
import {FONTS, mainFont, secFont} from '../constants/theme';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// props is a general parameter that is used to identify all incoming data into this page
// props.navigation would give you the navigation component required for navigation purposes,
// props.savedPlace, allows for access to the transferred data from the page savedLocations,
// when "save Changes" button has been clicked, and goBack(...) is triggered!
const editSavedPlaces = ({navigation, route}) => {
  const [value, setValue] = useState();
  const [testData, setTestData] = useState(null);
  const [incomingData, setIncomingData] = useState(true);

  LogBox.ignoreAllLogs();

  const readItemFromStorage = async () => {
    console.log('Reading from storage');
    const jsonValue = await AsyncStorage.getItem(key);
    const stored = JSON.parse(jsonValue);
    setValue(stored);
  };

  // amazingly this works. Nothing is ever impossible. Nothing at all

  let tester = null;

  // when the incomingData isnt null, it triggers tester variable to take the full new data of the incomingData
  // which will be displayed. Remember, its the FULL data!

  try {
    if (route.params.incomingData != null) {
      console.log('checkitout');
      tester = route.params.incomingData;
    }
  } catch (error) {
    console.log('machakani jeniffer##############');
  }

  useEffect(() => {
    readItemFromStorage();
  }, []);

  function renderHeader() {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: SIZES.padding * 1.8,
          marginHorizontal: SIZES.padding * 1.8,
          paddingBottom: SIZES.padding * 5.5,
          // backgroundColor: COLORS.lightGray,
        }}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            left: SIZES.padding * 1.1,
            paddingBottom: SIZES.padding,
          }}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={28} color={COLORS.black} />
        </TouchableOpacity>

        {/* <Text style={{fontSize: 16.5, fontFamily: mainFont, fontWeight: '800'}}>
          Favourite Places
        </Text> */}
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
          Favourite Places
        </Text>
      </View>
    );
  }

  function renderAddPlaceButton() {
    return (
      <View
        style={{
          position: 'absolute',
          top: SIZES.padding * 2.3,
          right: SIZES.padding * 3,
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('addPlace');
          }}>
          <MaterialIcons name="add" size={33} color={COLORS.black} />
        </TouchableOpacity>
      </View>
    );
  }

  const Item = foo => {
    console.log('This is the id from fooo ----', foo.id);
    return (
      // first major flexBox
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: SIZES.padding * 1.5,
          marginHorizontal: SIZES.padding * 2,
          borderRadius: SIZES.radius,
          borderWidth: 0.7,
          borderColor: COLORS.lightGray2,
        }}>
        <View
          style={{
            padding: SIZES.padding,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-evenly',
          }}>
          {/* first View to hold save icon, name & address */}
          <View>
            {/* this view below will hold the name and icon */}
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: SIZES.padding,
                paddingTop: SIZES.padding,
                alignItems: 'center',
              }}>
              {/* the save label icon (bookmark) */}
              <Icon name="bookmark" size={23} color={COLORS.black} />

              {/* the saved address  */}
              <Text
                numberOfLines={1}
                style={{
                  paddingLeft: SIZES.padding,
                  fontFamily: mainFont,
                  fontWeight: 'bold',
                  fontSize: 15.7,
                }}>
                {foo.description}
              </Text>
            </View>

            <View
              style={{
                paddingLeft: SIZES.padding * 1.5,
                paddingVertical: SIZES.padding,
              }}>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: mainFont,
                  color: '#6c6c6c',
                  // color: COLORS.primary,
                }}>
                {foo.displayed}
              </Text>
            </View>
          </View>
        </View>
        {/* BUTTON - second View to hold the icon they tap to go to edit the data */}

        <View
          style={{
            paddingRight: SIZES.padding * 3,
          }}>
          <TouchableOpacity
            onPress={() => {
              console.log(
                'This is the displayed data from editSavedPlaces page master list: ------------',
                foo.displayed,
              );
              navigation.navigate('savedLocations', {
                nameText: foo.description,
                selectedID: foo.id,
                displayed: foo.displayed,
              });
            }}
            style={{
              flexDirection: 'row',
            }}>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={35}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderSeparator = () => {
    return (
      <View
        style={{
          width: '90%',
          // remember this hairlinewidth, meant to make the separators all consistent!!
          height: StyleSheet.hairlineWidth,
          backgroundColor: COLORS.black,
          alignSelf: 'center',
        }}
      />
    );
  };

  function renderEmptyShow() {
    return (
      <View
        style={{
          justifyContent: 'center',
          paddingTop: SIZES.padding * 5,
        }}>
        <Text
          style={{
            alignSelf: 'center',
            fontSize: 15,
          }}>
          You have not saved any places
        </Text>
        <Text
          style={{
            alignSelf: 'center',
            fontSize: 15,
            paddingVertical: SIZES.padding,
          }}>
          Tap the "Add a Place" button above
        </Text>
      </View>
    );
  }

  function flatlistcomponent() {
    console.log('I want value to not be null ----', value);
    if (tester || value) {
      return (
        <FlatList
          refreshing
          // onRefresh
          // refreshControl={<RefreshControlComponent />}
          scrollEnabled
          ListEmptyComponent={renderEmptyShow()}
          data={tester || value}
          renderItem={({item}) => (
            <Item
              description={item.description}
              id={item.id}
              displayed={item.displayed}
            />
          )}
          key={item => item.id.toString()}
          keyExtractor={item => item.id.toString()}
          // ItemSeparatorComponent={renderSeparator}
          style={{
            width: '100%',
            backgroundColor: COLORS.white,
            alignSelf: 'center',
            // borderRadius: SIZES.radius / 1.5,
          }}></FlatList>
      );
    }
  }

  function renderFlatList() {
    return flatlistcomponent();
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderTitle()}
      {renderAddPlaceButton()}
      {renderFlatList()}
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
    shadowOpacity: 1,
    shadowRadius: 2,
    // elevation is the effect to make an element pop out even more.
    elevation: 3.4,
  },
});

export default editSavedPlaces;
