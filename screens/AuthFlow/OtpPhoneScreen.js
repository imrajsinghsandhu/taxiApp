import React, {useState, Component, useCallback} from 'react';
import auth, {firebase} from '@react-native-firebase/auth';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  View,
  Alert,
} from 'react-native';
import {COLORS, countryCodeData, SIZES} from '../../constants';
import {mainFont} from '../../constants/theme';

class OtpPhoneScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      verCode: null,
      confirmData: props.confirmData,
      combinedNumbers: props.combinedNumbers,
      comingFrom: props.comingFrom || null,
      verificationId: props.verificationId || null,
      diabledBool: true,
    };
  }

  // the title of the page we are on
  renderPageTitle = () => {
    return (
      <View>
        <Text
          style={{
            alignSelf: 'center',
            position: 'absolute',
            marginTop: SIZES.padding * 10,
            fontSize: 25,
            fontWeight: 'bold',
            fontFamily: mainFont,
          }}>
          OTP Verification page
        </Text>

        <View
          style={{
            backgroundColor: COLORS.ContrastColour,
            height: 22,
            width: 275,
            position: 'absolute',
            top: SIZES.padding * 12.1,
            left: SIZES.padding * 7,
            zIndex: -5, // this zIndex will set if the item is at the top or the bottom
            borderTopLeftRadius: SIZES.radius,
            borderBottomRightRadius: SIZES.radius,
          }}
        />
      </View>
    );
  };

  // the textInput for writing down the OTP you received
  renderOtpFiller = () => {
    return (
      <View
        style={{
          marginTop: SIZES.padding * 22,
          alignSelf: 'center',
          width: '37%',
          position: 'absolute',
        }}>
        <View
          style={{
            borderColor: COLORS.black,
            borderWidth: StyleSheet.hairlineWidth,
            borderRadius: SIZES.radius / 5,
          }}>
          {/* // this is the textInput for phoneNumber box */}
          <TextInput
            style={{
              fontSize: 17,
              padding: SIZES.padding,
              color: COLORS.black,
            }}
            value={this.state.verCode}
            onChangeText={input => {
              this.setState({
                verCode: input,
              });
            }}
            placeholder="Verification code"
            maxLength={6} // 6-digit OTP
          />
        </View>
      </View>
    );
  };

  // the button to click to run the verification process
  renderVerifyCodeButton = () => {
    return (
      <TouchableOpacity
        onPress={() => this.confirmVerificationCode(this.state.verCode)} // will run the confirmVerificationCode function upon press
        style={{
          alignSelf: 'center',
          position: 'absolute',
          top: SIZES.padding * 30,
          backgroundColor: COLORS.baseColour,
          borderRadius: SIZES.radius,
        }}>
        <Text
          style={{
            paddingHorizontal: SIZES.padding * 2.2,
            paddingVertical: SIZES.padding * 1.4,
            color: COLORS.white,
            fontWeight: '700',
          }}>
          Verify Code
        </Text>
      </TouchableOpacity>
    );
  };

  // method for resending OTP
  resendOTPMethod = async () => {
    await auth()
      .signInWithPhoneNumber(this.state.combinedNumbers, true) // this one sends the OTP
      .then(details => {
        console.log('the OTP should have been resent by now');
        this.setState({
          confirmData: details.confirm,
          verificationId: details.verificationId, // this should reset the props
          diabledBool: true, // will be rendering the OTP button disabled when the new OTP has already come in
        });
      })
      .catch(error => {
        console.log(error);
        console.log('This is the error code ------', error.code);

        if (error.code == 'auth/invalid-verification-code') {
          Alert.alert(
            'Notice',
            'You have entered the incorrect OTP. Please click the re-send button for another OTP.',
          );
        }
      });
  };

  // the resend OTP button itself
  resendOTPButton = () => {
    return (
      <TouchableOpacity
        disabled={this.state.diabledBool} // will go abled when we get an error message
        onPress={() => {
          console.log('We are pressing the resend button');
          this.resendOTPMethod();
        }}
        style={{
          alignSelf: 'center',
          position: 'absolute',
          top: SIZES.padding * 36,
          backgroundColor: this.state.diabledBool
            ? COLORS.lightGray
            : COLORS.baseColour,
          borderRadius: SIZES.radius,
        }}>
        <Text
          style={{
            paddingHorizontal: SIZES.padding * 2.2,
            paddingVertical: SIZES.padding * 1.4,
            color: this.state.diabledBool ? COLORS.lightGray2 : COLORS.white,
            fontWeight: '700',
          }}>
          Re-send OTP
        </Text>
      </TouchableOpacity>
    );
  };

  // the verificaiton process
  confirmVerificationCode = async code => {
    try {
      // this code confirms the OTP with firebase
      // console.log('This is the confirm data -----', this.state.confirmData);
      await this.state.confirmData.confirm(code);
    } catch (error) {
      console.log(error);
      console.log('This is the error code ------', error.code);

      if (error.code == 'auth/invalid-verification-code') {
        this.setState({
          diabledBool: false,
        });
        Alert.alert(
          'Notice',
          'You have entered the incorrect OTP. Please click the re-send button for another OTP.',
        );
      }
    }
  };

  // ~~~~~~~~~~~~~~ for when we are coming with intention to Link ~~~~~~~~~~~~~~~~~
  renderConfirmOTPLinking = async code => {
    console.log(
      'this is the otp we have input, renderConfirmOTPLinking ----',
      code,
    );
    console.log(
      'this is the VerificationID from props ---',
      this.state.verificationId,
    );

    // we are creating a phone Credential, which we will then use to authenticate with the current User
    const phoneCredential = auth.PhoneAuthProvider.credential(
      this.state.verificationId.toString(),
      code.toString(),
    );

    console.log('This is phoneCredential ---- ', phoneCredential);
    return await auth().currentUser.linkWithCredential(phoneCredential);
  };

  renderVerifyCodeButtonLinking = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (this.state.verCode.length == 6) {
            console.log('Pressed the confirmOTP button');
            this.renderConfirmOTPLinking(this.state.verCode);
          } // will run the confirmVerificationCode function upon press, provided there is a 6 digit OTP typed in
        }}
        style={{
          alignSelf: 'center',
          position: 'absolute',
          top: SIZES.padding * 35,
          backgroundColor: COLORS.lightGray2,
          borderRadius: SIZES.radius / 2,
        }}>
        <Text style={{padding: SIZES.padding * 2}}>Verify Code, Linking</Text>
      </TouchableOpacity>
    );
  };

  // ---------------------------------------------------------------------------------------------------------------------------------------------------------------
  // ------------------------------------------------------------------- render section ----------------------------------------------------------------------------
  // ---------------------------------------------------------------------------------------------------------------------------------------------------------------

  render() {
    if (this.state.comingFrom == 'linking') {
      return (
        <SafeAreaView>
          {this.renderPageTitle()}
          {this.renderOtpFiller()}
          {this.renderVerifyCodeButtonLinking()}
        </SafeAreaView>
      );
    } else {
      return (
        <SafeAreaView>
          {this.resendOTPButton()}
          {this.renderPageTitle()}
          {this.renderOtpFiller()}
          {this.renderVerifyCodeButton()}
        </SafeAreaView>
      );
    }
  }
}

export default OtpPhoneScreen;
