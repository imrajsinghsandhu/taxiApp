// in this i will get the user to change their Phone number and verify it immediately
// AIYAAAAA fuck this shit bro dont care about this component, knn screw this come back next time nabei

import React, {Component} from 'react';
import {
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Alert,
  FlatList,
} from 'react-native';
import {COLORS, countryCodeData, SIZES} from '../constants';
import auth, {firebase} from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';
import {mainFont} from '../constants/theme';
import {Modal} from 'react-native-paper';

// this page needs to connect to OTPVerifyScreen page to verify the OTP
class UpdatePhoneNumber extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      errorMessage: '',
      modal: false,
      selectedCode: null,
      phoneNumber: null,
      confirm: null,
      joinedNums: null,
      verificationId: null,
      OTPLinkingState: false,
      disabledBool: false,
    };
  }

  renderModal = () => {
    // sample of what each item holds
    // {
    //   name: 'Afghanistan',
    //   dial_code: '+93',
    //   code: 'AF',
    // },

    // how you are going to display each item
    const Item = props => {
      return (
        <TouchableOpacity
          onPress={() => {
            console.log('An item has been selected');
            // setSelectedCode(props.dialCode); // the code you will save to the state to be shown in the previous screen
            // setModal(false);
            this.setState({
              selectedCode: props.dialCode,
            });
            this.setState({
              modal: false,
            });
          }}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginVertical: SIZES.padding * 1,
            marginHorizontal: SIZES.padding * 2,
            paddingLeft: SIZES.padding / 2,
          }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: mainFont,
              flexWrap: 'wrap',
            }}>
            {props.name}
          </Text>

          <Text
            style={{
              paddingRight: SIZES.padding,
              fontSize: 15,
              flexWrap: 'wrap',
            }}>
            {props.dialCode}
          </Text>
        </TouchableOpacity>
      );
    };

    return (
      <Modal visible={this.state.modal}>
        <FlatList
          scrollEnabled
          ListEmptyComponent={this.renderEmptyShow()}
          data={countryCodeData} // need to add data
          renderItem={({item}) => (
            <Item
              name={item.name} // name of the country
              dialCode={item.dial_code} // the dial code e.g. +65
              countryCode={item.code} // the short form of the country i.e. SG
            />
          )}
          keyExtractor={item => item.name}
          ItemSeparatorComponent={this.renderSeparator()}
          style={{
            width: '100%',
            backgroundColor: COLORS.white,
            alignSelf: 'center',
          }}
        />
      </Modal>
    );
  };

  // what to show when the list is empty, which it shouldnt be lol
  renderEmptyShow = () => {
    return (
      <Text
        style={{
          alignSelf: 'center',
          justifyContent: 'center',
        }}>
        No country to pick motherfucker
      </Text>
    );
  };

  // the separator in between each item in the list
  renderSeparator = () => {
    return (
      <View
        style={{
          width: '90%',
          // remember this hairlinewidth, meant to make the separators all consistent!!
          height: 1.2,
          backgroundColor: COLORS.lightGray2,
          alignSelf: 'center',
        }}
      />
    );
  };

  // accepts both 10 & 11 digit numbers
  // uses regex to check if the combinedNumber is correct expression
  isPhoneNumberValid = inputtxt => {
    var tenDigit = /^\+?[-. ]?([0-9]{10})$/; // works for both cases of +6586686144 and +65 86686144
    var elevenDigit = /^\+?[-. ]?([0-9]{11})$/;

    return tenDigit.test(String(inputtxt))
      ? true
      : elevenDigit.test(String(inputtxt)); // if tenDigit test returns false, we will run the elevenDigit test
  };

  // function that helps to combine the country code with the input number
  // then goes on to pass on to combinedChecker()
  combineTheNumbers = () => {
    const combinedNumber =
      this.state.selectedCode + '' + this.state.phoneNumber;

    this.setState({
      joinedNums: combinedNumber,
    });
    // setJoinedNums(combinedNumber);
    return combinedChecker(combinedNumber);
  };

  // making an all in one validity checker for the input of the phone number, and then pushing off to another function (OTPLinking)
  combinedChecker = number => {
    console.log('Running combined checker');
    if (!number) {
      return alert('Not a valid phone number');
    } else if (!this.isPhoneNumberValid(number)) {
      return alert('Not a valid phone number');
    }
    // this block will pass when there is no error left, and into OTPLinking
    this.OTPLinking(number);
  };

  // this is triggered from pressing "send code" button above
  // this function is the one that will trigger the sending of the code, plus trigger converting the page into an OTPLinking page
  OTPLinking = async number => {
    await auth()
      .verifyPhoneNumber(number.toString(), true)
      .on('state_changed', phoneAuthSnapshot => {
        console.log('State: ', phoneAuthSnapshot.state);

        // setOTPLinkingState(true); // this will trigger to show all the OTPLinkingState components and method
        // setVerificationId(phoneAuthSnapshot.verificationId); // added to state
        this.state({
          verificationId: phoneAuthSnapshot.verificationId,
          OTPLinkingState: true,
        });
        console.log('We should be displaying the OTP screen now');
      })
      .catch(error => {
        console.error('Error ----- : ', error);
        console.error('This is the errorcode ---', error.code);
      });
  };

  // method for linking, which will run when the user clicks on the button to confirm OTP
  // can also be configured to automatically run when there are 6 digits in the input box for OTP
  renderConfirmOTPLinking = async code => {
    console.log('this is the otp we have input ----', code);

    const phoneCredential = auth.PhoneAuthProvider.credential(
      this.state.verificationId.toString(),
      code.toString(),
    );

    console.log('This is phoneCredential ---- ', phoneCredential);
    return await auth()
      .currentUser.linkWithCredential(phoneCredential)
      .then(async () => {
        await auth().currentUser.updatePhoneNumber(phoneCredential);
      })
      .catch(error => {
        console.log(error);
        console.log('This is the error code ------', error.code);

        if (error.code == 'auth/invalid-verification-code') {
          // setDisabledBool(true);
          this.setState({
            disabledBool: true,
          });
          Alert.alert(
            'Notice',
            'You have entered the incorrect OTP. Please click the re-send button for another OTP.',
          );
        }
      });
  };

  renderHeader = () => {
    return (
      <View
        style={{
          position: 'absolute',
          top: SIZES.padding * 2.3,
          left: SIZES.padding * 2.1,
        }}>
        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
          <Icon name="arrow-back" size={30} color={COLORS.black} />
        </TouchableOpacity>
      </View>
    );
  };

  // the title of the page we are on
  renderPageTitle = () => {
    return (
      <View>
        <Text
          style={{
            position: 'absolute',
            marginTop: SIZES.padding * 13,
            fontSize: 30,
            fontWeight: 'bold',
            fontFamily: mainFont,
            left: SIZES.padding * 4,
          }}>
          My number is
        </Text>

        <View
          style={{
            backgroundColor: COLORS.ContrastColour,
            height: 17,
            width: 200,
            position: 'absolute',
            top: SIZES.padding * 15.65,
            left: SIZES.padding * 3.1,
            zIndex: -5, // this zIndex will set if the item is at the top or the bottom
            borderTopLeftRadius: SIZES.radius,
            borderBottomRightRadius: SIZES.radius,
          }}
        />
      </View>
    );
  };

  renderFillIn = () => {
    return (
      <View
        style={{
          marginTop: SIZES.padding * 18,
          alignSelf: 'center',
          width: '60%',
          position: 'absolute',
          paddingVertical: SIZES.padding,
          left: SIZES.padding * 12.1,
        }}>
        <View
          style={{
            // borderColor: COLORS.black,
            backgroundColor: COLORS.DarkerGreyBase,
            borderBottomColor: COLORS.DarkestBase,
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}>
          {/* // this is the textInput for phoneNumber box */}
          <TextInput
            style={{
              fontSize: 17,
              padding: SIZES.padding,
              color: COLORS.black,
            }}
            value={this.state.phoneNumber}
            onChangeText={input => {
              this.setState({
                phoneNumber: input,
              });
            }}
            placeholder="Phone number"
          />
        </View>
      </View>
    );
  };

  // the box that holds the country code and the down arrow button
  renderCountryCodeButton = () => {
    return (
      <View
        style={{
          position: 'absolute',
          top: SIZES.padding * 19,
          left: SIZES.padding * 4.2,
          width: 70,
        }}>
        <TouchableOpacity
          style={{
            borderBottomColor: COLORS.DarkestBase,
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
          onPress={() => {
            // setModal(true);
            this.setState({
              modal: true,
            });
            console.log(
              'The country code button has been pressed, opening Modal now ---',
              this.state.modal,
            );
          }}>
          <View
            style={{
              padding: SIZES.padding * 1.18,
              backgroundColor: COLORS.DarkerGreyBase,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: 47.1,
            }}>
            <Text
              style={{
                fontSize: 15,
                paddingRight: SIZES.padding / 2,
              }}>
              {this.state.selectedCode}
            </Text>

            <Icon
              name="caret-down-outline"
              size={15}
              style={{
                position: 'absolute',
                right: SIZES.padding / 3,
              }}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  renderErrorMessage = () => {
    return (
      <View
        style={{
          alignSelf: 'center',
          position: 'absolute',
          top: SIZES.padding * 2,
        }}>
        <Text style={{fontSize: 15, color: '#ff2424'}}>
          {this.state.errorMessage}
        </Text>
      </View>
    );
  };

  // button for confirming send of OTP
  renderSendOTPButton = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.combinedValidityCheck(this.state.joinedNums);
          console.log('Checking for validity of email');
        }}
        style={{
          alignSelf: 'center',
          position: 'absolute',
          top: SIZES.padding * 35,
          backgroundColor: COLORS.lightGray2,
          borderRadius: SIZES.radius / 2,
        }}>
        <Text style={{padding: SIZES.padding * 2}}>Send OTP</Text>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <SafeAreaView>
        {this.renderHeader()}
        {this.renderPageTitle()}
        {this.renderFillIn()}
        {this.renderCountryCodeButton()}
        {this.renderSendOTPButton()}
        {this.renderErrorMessage()}
        {this.state.modal && this.renderModal()}
      </SafeAreaView>
    );
  }
}

export default UpdatePhoneNumber;
