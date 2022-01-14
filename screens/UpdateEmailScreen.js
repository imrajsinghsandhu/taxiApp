// in this i will get the user to change their email and verify it immediately

import React, {Component} from 'react';
import {
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import {COLORS, SIZES} from '../constants';
import auth, {firebase} from '@react-native-firebase/auth';
import {mainFont} from '../constants/theme';
import Icon from 'react-native-vector-icons/Ionicons';

class UpdateEmailScreen extends Component {
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
    this.confirmSendEmail();
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
            alignSelf: 'center',
            position: 'absolute',
            marginTop: SIZES.padding * 16.7,
            fontSize: 25,
            fontWeight: 'bold',
            fontFamily: mainFont,
            left: SIZES.padding * 5.6,
          }}>
          My new Email is
        </Text>

        <View
          style={{
            backgroundColor: COLORS.ContrastColour,
            height: 18,
            width: 215,
            position: 'absolute',
            top: SIZES.padding * 18.8,
            left: SIZES.padding * 4.5,
            zIndex: -5, // this zIndex will set if the item is at the top or the bottom
            borderTopLeftRadius: SIZES.radius,
            borderBottomRightRadius: SIZES.radius,
          }}
        />
      </View>
    );
  };
  // next method from combinedValidityCheck
  confirmSendEmail = async () => {
    const user = auth().currentUser;

    await user
      .updateEmail(this.state.email)
      .then(() => {
        console.log("User's email has been updated to --- ", this.state.email);
        Alert.alert('Notice', 'Your Email has been updated.');
      })
      .catch(error => {
        console.log('Error has occured while trying to update email', error);
        const errorCode = error.code;

        if (errorCode == 'auth/requires-recent-login') {
          return Alert.alert(
            'Notice',
            'Please re-login and then proceed with updating your email, as this is a security-sensitive operation.',
            [
              {
                text: 'Cancel',
                onPress: () => {
                  console.log('Cancel Button on delete message pressed');
                },
                style: 'cancel',
              },
            ],
          );
        } else if (errorCode == 'auth/email-already-in-use') {
          this.setState({
            email: '',
          }); // this makes the email input section empty
          Alert.alert(
            'Notice',
            'Email already in use. Please input a different email.',
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
          width: '75%',
          position: 'absolute',
        }}>
        <View
          style={{
            borderColor: COLORS.black,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: COLORS.DarkestBase,
          }}>
          {/* // this is the textInput for Email box */}
          <TextInput
            style={{
              fontSize: 17,
              padding: SIZES.padding,
              backgroundColor: COLORS.DarkerGreyBase,
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
          Confirm
        </Text>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <SafeAreaView>
        {this.renderHeader()}
        {this.renderPageTitle()}
        {this.renderEmailInput()}
        {this.renderConfirmButton()}
        {this.renderErrorMessage()}
      </SafeAreaView>
    );
  }
}

export default UpdateEmailScreen;
