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

const EmailLogInScreen = props => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isValid, setValid] = useState(true);

  // heres the function that validates the email
  const isValidEmail = email => {
    var re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  // function is called when Log In button is pressed
  // in this function you will check for email and password validity
  // You are also setting errors up, so that the errors display at the bottom of sign in.
  const doLogIn = async () => {
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

    // this block of code shall execute when there arent any mistakes with the email & password inputs
    let response = await auth()
      .signInWithEmailAndPassword(email, password)
      .catch(errorReceived => {
        let errorCode = errorReceived.code;
        console.log(
          'This is the errorCode we have received ----------',
          errorCode,
        );

        if (errorCode == 'auth/wrong-password') {
          const displayThisMessage = '* You have entered the wrong password';
          setError(true);
          setErrorMessage(displayThisMessage);
        } else if (errorCode == 'auth/user-not-found') {
          const displayThisMessage =
            '* Email is not registered, create a new account.';
          setError(true);
          setErrorMessage(displayThisMessage);
        }
      }); // this response will only be non-empty when there is actually a user with the typed in email & password

    // console.log('This is the response for wrong password', response);
    if (response && response.user) {
      // on left of commma, will be the TITLE of the alert,
      // on right of comma will be the MESSAGE in the alert
      Alert.alert('Success ✅', 'Authenticated successfully');
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
          }}>
          Login page
        </Text>

        {/* i want this blue streak to come out from log, and extend to page, as an animation */}
        <View
          style={{
            backgroundColor: COLORS.ContrastColour,
            height: 22,
            width: 138,
            position: 'absolute',
            top: SIZES.padding * 12.1,
            left: SIZES.padding * 13.5,
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
            passwordRules="required:upper; required:lower; required:digit; minlength:6" // setting the password requirements for this
          />
        </View>
      </View>
    );
  }

  function renderLogInButton() {
    return (
      <View
        style={{
          position: 'absolute',
          right: SIZES.padding * 3,
          top: SIZES.padding * 37,
        }}>
        <TouchableOpacity
          onPress={() => doLogIn()}
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
            Log In
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
        <Text style={{fontSize: 15, fontFamily: mainFont}}>
          Don't have an account?
        </Text>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('SignUpScreen')}
          style={{
            paddingLeft: SIZES.padding / 1.8,
          }}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: 'bold',
              fontFamily: mainFont,
            }}>
            Create one now
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function renderForgotPasswordLink() {
    return (
      <View
        style={{
          position: 'absolute',
          top: SIZES.padding * 56,
          alignSelf: 'center',
        }}>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('ForgotPasswordScreen');
          }}>
          <Text style={{fontSize: 16, color: '#0267e3'}}>Forgot Password</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}>
      {renderPageTitle()}
      {renderFillIns()}
      {renderLogInButton()}
      {error && renderErrorMessage()}
      {renderBottomLogInOption()}
      {renderForgotPasswordLink()}
    </SafeAreaView>
  );
};

export default EmailLogInScreen;

const styles = StyleSheet.create({
  container: {},
});
