// it is in this page where we set the drop down list of saved locations

import React from 'react';
import {View, Image, Text} from 'react-native';
import {COLORS, icons, SIZES} from '../constants';
import Icon from 'react-native-vector-icons/Octicons';
import Icons from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {mainFont} from '../constants/theme';

// now all the required data will be coming in from the previous page, removing the need for me
// to keep on calling the readitemfromstorage function, which slows down operations.

const PlaceRow = ({data, incomingData, from}) => {
  // console.log('This is the incoming data', data, incomingData);

  function puller() {
    const len = incomingData.length; // finds the array length, which is always 1 more than the last id position
    let count = 0; // this count will keep track on the position of the array we are in
    let arr = []; // the array that will hold all the output names in the data structure

    while (count < len) {
      arr[count] = incomingData[count].description;
      count++;
    }

    return arr; // return the array of data.description
  }

  function tester() {
    // console.log('Tester is working now');
    try {
      return data.structured_formatting.main_text;
    } catch (error) {
      return data.vicinity;
    }
  }

  function checker() {
    // console.log(
    //   'Puller is working ##################################################',
    // );

    puller();

    if (data.description === 'Current Location') {
      return data.description;
    } else if (puller().includes(data.description)) {
      return data.description;
    } else {
      try {
        return data.structured_formatting.main_text;
      } catch (error) {
        return data.vicinity;
      }
    }
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 15,
        marginLeft: SIZES.padding / 2,
      }}>
      {data.description === 'Home' ? (
        <Icons name="home" size={15} color={COLORS.black} />
      ) : // <Image source={icons.like} style={{height: 15, width: 15}} />
      data.description === 'Work' ? (
        <MaterialIcon name="work" size={15} />
      ) : (
        // (<Image source={icons.fire} style={{height: 15, width: 15}} />))
        <Icons name="location" size={12.5} color={COLORS.DarkestBase} />
      )}
      <Text
        style={{
          paddingLeft: SIZES.padding,
          fontSize: 15,
          fontFamily: mainFont,
        }}>
        {/* you choose the data to be shown by studying the console.log(data) output */}

        {from === 'addPlace'
          ? tester()
          : from === 'savedLocations'
          ? tester()
          : checker()}
      </Text>
    </View>
  );
};

export default PlaceRow;
