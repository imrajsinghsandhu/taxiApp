import React, {Component} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import {COLORS, icons, SIZES} from '../constants';
import Icon from 'react-native-vector-icons/Ionicons';

// set up phone verification, and sign up,
// remember to add phone verification to the update phone number too.

import {FONTS, mainFont} from '../constants/theme';

class AboutUs extends Component {
  constructor(props) {
    super(props);
  }

  // back button
  renderBackButton = () => {
    return (
      <View
        style={{
          position: 'absolute',
          top: SIZES.padding * 2,
          left: SIZES.padding * 2.5,
        }}>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.goBack(); // supposed to go to StartUp Screen
          }}>
          <Icon name="arrow-back" size={28} color={COLORS.black} />
        </TouchableOpacity>
      </View>
    );
  };

  // the page title
  // not used
  renderPageTitle = () => {
    return (
      <Text
        style={{
          alignSelf: 'center',
          position: 'absolute',
          marginTop: SIZES.padding,
          fontSize: 21,
          //   fontWeight: 'bold',
        }}>
        About us
      </Text>
    );
  };

  // this will hold main text body
  renderBodyOneText = () => {
    return (
      <View
        style={{
          backgroundColor: COLORS.LightestGreyBase,
          width: '50%',
          height: '18%',
          position: 'absolute',
          top: SIZES.padding * 9.5,
          borderRadius: SIZES.radius,
          right: SIZES.padding * 0.9,
        }}>
        <Text
          style={{
            flexWrap: 'wrap',
            fontFamily: mainFont,
            fontSize: 17,
            padding: SIZES.padding * 1.5,
          }}>
          Nova allows consumers to make an informed decision when booking a
          ride.
        </Text>
      </View>
    );
  };

  renderBodyOnePic = () => {
    return (
      <Image
        source={icons.socialBlue}
        style={{
          width: 212,
          height: 212,
          marginLeft: SIZES.padding,
          top: SIZES.padding * 3.5,
          position: 'absolute',
          right: SIZES.padding * 20.8,
        }}
      />
    );
  };

  renderBodyTwoText = () => {
    return (
      <View
        style={{
          backgroundColor: COLORS.LightestGreyBase,
          width: '50%',
          height: '21%',
          position: 'absolute',
          top: SIZES.padding * 26,
          borderRadius: SIZES.radius,
          left: SIZES.padding * 2,
        }}>
        <Text
          style={{
            flexWrap: 'wrap',
            fontFamily: mainFont,
            fontSize: 17,
            padding: SIZES.padding * 1.4,
          }}>
          Price differences exist, and we want to help you choose, without
          opening multiple apps to compare prices.
        </Text>
      </View>
    );
  };

  renderBodyTwoPic = () => {
    return (
      <Image
        source={icons.bluemanHailing}
        style={{
          height: 180,
          width: 130,
          position: 'absolute',
          top: SIZES.padding * 24.1,
          right: SIZES.padding * 5.5,
        }}
      />
    );
  };

  renderBodyThreeText = () => {
    return (
      <View
        style={{
          backgroundColor: COLORS.DarkerGreyBase,
          width: '50%',
          height: '6.5%',
          position: 'absolute',
          bottom: SIZES.padding * 17.8,
          borderRadius: SIZES.radius,
          right: SIZES.padding,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontFamily: mainFont,
            padding: SIZES.padding,
            fontSize: 17,
            fontWeight: 'bold',
          }}>
          One app, to do it all.
        </Text>
      </View>
    );
  };

  renderBodyThreePic = () => {
    return (
      <Image
        source={icons.motorbikeNoPhone}
        style={{
          height: 230,
          width: 230,
          position: 'absolute',
          bottom: -SIZES.padding * 1.1,
          right: SIZES.padding * 17.5,
        }}
      />
    );
  };

  renderBodyFourText = () => {
    return (
      <View
        style={{
          backgroundColor: COLORS.LightestGreyBase,
          width: '42%',
          height: '14%',
          position: 'absolute',
          bottom: SIZES.padding * 6.8,
          borderRadius: SIZES.radius,
          right: SIZES.padding,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontFamily: mainFont,
            padding: SIZES.padding * 1.3,
            fontSize: 17,
          }}>
          Stay-tuned for more services, and an ever improving app!
        </Text>
      </View>
    );
  };

  renderTitle() {
    return (
      <View
        style={{
          position: 'absolute',
          backgroundColor: COLORS.lightGray,
          alignSelf: 'center',
          top: SIZES.padding * 1.6,
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
            fontWeight: '700',
            ...FONTS.body3,
          }}>
          About Us
        </Text>
      </View>
    );
  }

  render() {
    return (
      <SafeAreaView
        style={{
          backgroundColor: COLORS.white,
          flex: 1,
        }}>
        {this.renderBackButton()}
        {/* {this.renderPageTitle()} */}
        {this.renderBodyOneText()}
        {this.renderBodyOnePic()}
        {this.renderBodyTwoText()}
        {this.renderBodyTwoPic()}
        {this.renderBodyThreeText()}
        {this.renderBodyThreePic()}
        {this.renderBodyFourText()}
        {this.renderTitle()}
      </SafeAreaView>
    );
  }
}

export default AboutUs;
