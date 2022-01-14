// this page will hold the part where you verify the users phone number has been registered or not

// the flow for forgot password should be either

// 1 - You send the email link to the email input if you can check if that email is registered in your database or not
//   - if the email is registered, then you display the Text that a password reset link has been sent to that email
//   - if the email is not registered, then you will give an alert saying that the email has not been registered, no link has been sent out

import React, {Component} from 'react';
import {
  SafeAreaView,
  Text,
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {COLORS, SIZES} from '../../constants';

import auth, {firebase} from '@react-native-firebase/auth';

class ForgotPasswordScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      error: false,
      errorMessage: '',
    };
  }

  isValidEmail = email => {
    var re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  // method for combined checking of email validity
  combinedValidityCheck = () => {
    if (!this.state.email) {
      console.log('its rev');
      // when input is empty

      // ALWAYS FROM NOW ON USE THIS.SETSTATE({...}) TO UPDATE COMPONENTS IN THE CLASSSS!!!!
      this.setState({
        errorMessage: '* Email required',
      });
      return;
      // this block below is checking if the email is valid or not
    } else if (!this.isValidEmail(this.state.email)) {
      this.setState({
        errorMessage: '* Invalid Email',
      });
      return;
    }

    // this bit of code only passes when the email is proper
    console.log('We are now going to send a confirmation email ------');
    this.setState({
      errorMessage: '',
    });
    this.confirmSendEmail(this.state.email);
  };

  // next method from combinedValidityCheck
  confirmSendEmail = async email => {
    await auth()
      .fetchSignInMethodsForEmail(email)
      .then(async details => {
        console.log(`These are the sign-in methods for ${email} ----`, details);

        const len = details.length;
        if (len > 0) {
          await auth().sendPasswordResetEmail(email); // sending password reset link to the email registered
          return Alert.alert(
            'Notice',
            'We have sent a password reset email to the email provided, you may proceed with resetting your password.',
            [
              {
                text: 'Ok',
                onPress: () => {
                  console.log('Ok Button on message pressed');
                },
                style: 'cancel',
              },
            ],
          );
        } else {
          // for when the email isnt even registered
          return Alert.alert(
            'Notice',
            'We do not have any record of an account with the email provided. Please try another email, or create a new account.',
            [
              {
                text: 'Ok',
                onPress: () => {
                  console.log('Ok Button on message pressed');
                },
                style: 'cancel',
              },
            ],
          );
        }
      })
      .catch(error => {
        const errorCode = error.code;

        if (errorCode == 'auth/user-not-found') {
          // for when the email isnt even registered
          return Alert.alert(
            'Notice',
            'We do not have any record of an account with the email provided. Please try another email, or create a new account.',
            [
              {
                text: 'Ok',
                onPress: () => {
                  console.log('Ok Button on message pressed');
                },
                style: 'cancel',
              },
            ],
          );
        }
      });
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

  renderEmailInput = () => {
    return (
      <View
        style={{
          marginTop: SIZES.padding * 22,
          alignSelf: 'center',
          width: '90%',
          position: 'absolute',
        }}>
        <View
          style={{
            borderColor: COLORS.black,
            borderWidth: StyleSheet.hairlineWidth,
            borderRadius: SIZES.radius / 5,
          }}>
          {/* // this is the textInput for Email box */}
          <TextInput
            style={{
              fontSize: 17,
              padding: SIZES.padding,
            }}
            value={this.state.email}
            onChangeText={input => {
              this.setState({
                email: input,
              });
            }}
            placeholder="Email Address"
            keyboardType="email-address"
          />
        </View>
      </View>
    );
  };

  // button for confirming send of email
  renderConfirmButton = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.combinedValidityCheck(this.state.email);
          console.log('Checking for validity of email');
        }}
        style={{
          alignSelf: 'center',
          position: 'absolute',
          top: SIZES.padding * 35,
          backgroundColor: COLORS.lightGray2,
          borderRadius: SIZES.radius / 2,
        }}>
        <Text style={{padding: SIZES.padding * 2}}>Confirm</Text>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <SafeAreaView>
        {this.renderEmailInput()}
        {this.renderConfirmButton()}
        {this.renderErrorMessage()}
      </SafeAreaView>
    );
  }
}

export default ForgotPasswordScreen;
