// This is the sign Up for an account page

import React, {useState, useEffect} from 'react';
import auth, {firebase} from '@react-native-firebase/auth';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {COLORS, SIZES} from '../../constants';
import {mainFont} from '../../constants/theme';

const SignUpScreen = props => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isvalid, setValid] = useState(true);
  const [authenticated, setAuthenticated] = useState();

  // heres the function that validates the email and password
  const isValidEmail = email => {
    var re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  // checks if the user is actually authenticated already, and if it is, then it returns a uid value, in user
  // following which, you can now use this user value to change onAuthStateChanged, and hence call the switch navigator
  const isTheUserAuthenticated = () => {
    let user = firebase.auth().currentUser.uid;
    if (user) {
      console.log('This is the uid taken from firebase', user);
      setAuthenticated(true);
    } else {
      console.log('User has not signed in yet');
      setAuthenticated(false);
    }
  };

  // function is called when Sign Up button is pressed
  // in this function you will check for email and password validity
  // You are also setting errors up, so that the errors display at the bottom of sign in
  const doSignUp = () => {
    if (!email) {
      // when input is empty
      setErrorMessage('* Email required');
      setError(true);
      setValid(false);
      return;
      // this block below is checking if the email is valid or not
    } else if (!isValidEmail(email)) {
      setErrorMessage('* Invalid Email');
      setError(true);
      setValid(false);
      return;
    } else if (!password) {
      setErrorMessage('* Password is required');
      setError(true);
      setValid(false);
      return;
    } else if (!password && password.trim() && password.length > 6) {
      setErrorMessage('* Weak password, minimum 5 chars');
      setError(true);
      setValid(false);
      return;
    }
    // this last line of code will pass when there arent any errors with the input
    // will pass the arguments to a function that handles the email and password, which are both valid
    // then update the firebase console
    doCreateUser(email, password);
  };

  // this is the function that updates the firebase console, and creates a user in the system
  // rememeber that this is an async function
  const doCreateUser = async (email, password) => {
    try {
      // this is the code that creates the user's profile in the system, using the createUserWithEmailAndPassword method

      let response = await auth()
        .createUserWithEmailAndPassword(email, password)
        .catch(details => {
          const errorCode = details.code;

          if (errorCode == 'auth/email-already-in-use') {
            const displayThisMessage = '* Email already in use, Log-In instead';
            setError(true);
            setErrorMessage(displayThisMessage);
          }
        });
      if (response && response.user) {
        Alert.alert('Success ✅', 'Account created successfully');
      }
    } catch (e) {
      console.error(e.message);
    }
  };

  function renderPageTitle() {
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
          Sign up page
        </Text>

        {/* i want this blue streak to come out from sign, and extend to page, as an animation */}
        <View
          style={{
            backgroundColor: COLORS.ContrastColour,
            height: 22,
            width: 160,
            position: 'absolute',
            top: SIZES.padding * 12.1,
            left: SIZES.padding * 11.5,
            zIndex: -5, // this zIndex will set if the item is at the top or the bottom
            borderTopLeftRadius: SIZES.radius,
            borderBottomRightRadius: SIZES.radius,
          }}
        />
      </View>
    );
  }

  // this function will hold the email and password TextInputs
  function renderFillIns() {
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
            value={email}
            onChangeText={input => {
              setEmail(input);
            }}
            placeholder="Email Address"
            keyboardType="email-address"
          />
        </View>

        <View
          style={{
            borderColor: COLORS.black,
            borderWidth: StyleSheet.hairlineWidth,
            borderRadius: SIZES.radius / 5,
            marginTop: SIZES.padding,
          }}>
          {/* // this will hold the textInput for the Password box */}
          <TextInput
            style={{
              fontSize: 17,
              padding: SIZES.padding,
            }}
            value={password}
            onChangeText={input => {
              setPassword(input);
            }}
            secureTextEntry // masks the entry of the inputs
            placeholder="Password"
            // passwordRules="required:upper; required:lower; required:digit; minlength:6" // setting the password requirements for this
          />
        </View>
      </View>
    );
  }

  function renderSignUpButton() {
    return (
      <View
        style={{
          position: 'absolute',
          right: SIZES.padding * 3,
          top: SIZES.padding * 37,
        }}>
        <TouchableOpacity
          onPress={() => doSignUp()}
          style={{
            backgroundColor: COLORS.baseColour,
            borderRadius: SIZES.radius,
          }}>
          <Text
            style={{
              fontSize: 15,
              paddingHorizontal: SIZES.padding * 3,
              paddingVertical: SIZES.padding * 1.3,
              fontFamily: mainFont,
              color: COLORS.white,
              fontWeight: '700',
            }}>
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function renderErrorMessage() {
    return (
      <View
        style={{
          alignSelf: 'center',
          position: 'absolute',
          top: SIZES.padding * 33.2,
        }}>
        <Text style={{fontSize: 15, color: '#ff2424'}}>{errorMessage}</Text>
      </View>
    );
  }

  function renderBottomLogInOption() {
    return (
      <View
        style={{
          position: 'absolute',
          top: SIZES.padding * 50,
          alignSelf: 'center',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 16, fontFamily: mainFont}}>
          Already have an account?
        </Text>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('ChoiceLogInScreen')}
          style={{
            paddingLeft: SIZES.padding / 1.8,
          }}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: 'bold',
              fontFamily: mainFont,
              color: COLORS.DarkerBase,
            }}>
            Log In
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ok so this returns a good check if the user is signed in or not
  function renderUserSignedIn() {
    return <Text>User is signed in</Text>;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}>
      {renderPageTitle()}
      {renderFillIns()}
      {renderSignUpButton()}
      {error && renderErrorMessage()}
      {renderBottomLogInOption()}
    </SafeAreaView>
  );
};

export default SignUpScreen;
