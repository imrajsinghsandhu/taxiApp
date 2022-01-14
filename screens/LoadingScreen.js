import React, {Component} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from 'react-native';
import {COLORS, SIZES} from '../constants';

// set up phone verification, and sign up,
// remember to add phone verification to the update phone number too.

import auth, {firebase} from '@react-native-firebase/auth';

class LoadingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
    };
  }

  componentDidMount() {
    this.checkIfLoggedIn();
  }

  componentWillUnmount() {
    this.state.loggedIn = false;
  }

  checkIfLoggedIn = () => {
    auth().onAuthStateChanged(details => {
      if (details) {
        console.log('User is already logged in');
        this.state.loggedIn = true;

        const userPhoneNumber = auth().currentUser.phoneNumber; // will return null if user has no phone number registered

        if (userPhoneNumber) {
          this.props.navigation.navigate('MainScreen');
        } else {
          this.props.navigation.navigate('PhoneSignUp'); // re-routes the user to the PhoneSignUp screen
        }
      } else {
        console.log('User is NOT logged in');
        this.props.navigation.navigate('SignUpScreen');
      }
    });
  };

  renderLoadingSign = () => {
    return <ActivityIndicator size="large" />;
  };

  render() {
    return <SafeAreaView>{this.renderLoadingSign()}</SafeAreaView>;
  }
}

export default LoadingScreen;
