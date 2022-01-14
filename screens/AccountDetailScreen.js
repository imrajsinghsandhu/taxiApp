// in this screen i will hold the information of the user
// and the log out button
// and the delete button

import React, {Component} from 'react';
import {
  Alert,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from 'react-native';
import {COLORS, SIZES} from '../constants';
import auth, {firebase} from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';
import {FONTS, mainFont} from '../constants/theme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

class AccountDetailScreen extends Component {
  constructor(props) {
    super(props);
  }

  renderHeader = () => {
    return (
      <View
        style={{
          position: 'absolute',
          top: SIZES.padding * 2.3,
          left: SIZES.padding * 2.5,
        }}>
        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
          <Icon name="arrow-back" size={30} color={COLORS.black} />
        </TouchableOpacity>
      </View>
    );
  };

  // the page title
  renderPageTitle = () => {
    return (
      <Text
        style={{
          alignSelf: 'center',
          position: 'absolute',
          marginTop: SIZES.padding * 2,
          fontSize: 18,
          fontFamily: mainFont,
          //   fontWeight: 'bold',
        }}>
        Profile Details
      </Text>
    );
  };

  renderSignOutButton = () => {
    return (
      <TouchableOpacity
        onPress={async () => {
          await auth()
            .signOut()
            .then(() => {
              console.log('User has been signed out');
            });
        }}
        style={{
          alignSelf: 'center',
          position: 'absolute',
          top: SIZES.padding * 5,
          backgroundColor: COLORS.lightGray2,
          borderRadius: SIZES.radius / 2,
        }}>
        <Text style={{padding: SIZES.padding * 2}}>Sign Out</Text>
      </TouchableOpacity>
    );
  };

  deleteAccount = () => {
    const user = firebase.auth().currentUser;

    user
      .delete()
      .then(() => {
        console.log('Account has been deleted');
      })
      .catch(error => {
        console.log('Error while trying to delete account ----- ', error);
        // it is probably an error which requires the user to sign in again to delete the account successfully
        const errorCode = error.code;

        if (errorCode == 'auth/requires-recent-login') {
          Alert.alert(
            'Notice',
            'Please log-out, then log-in again, and then proceed with deleting your account.',
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
        }
      });
  };

  // button
  renderDeleteButton = () => {
    return (
      <TouchableOpacity
        style={{
          alignSelf: 'center',
          position: 'absolute',
          bottom: SIZES.padding * 5,
          backgroundColor: COLORS.lightGray2,
          borderRadius: SIZES.radius,
          width: '90%',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          color: COLORS.secondary,
        }}
        onPress={() => {
          Alert.alert(
            'Notice',
            'Are you sure you want to delete your account? You cannot undo this action.',
            [
              {
                text: 'Confirm',
                onPress: () => {
                  console.log(
                    'Confirm Button pressed, user has chosen to delete their account, fucking cheebai dog',
                  );
                  this.deleteAccount();
                },
              },
              {
                text: 'Cancel',
                onPress: () => {
                  console.log('Cancel Button pressed');
                },
                style: 'cancel',
              },
            ],
            {
              cancelable: true,
              onDismiss: () => {
                console.log(
                  'Deletion dismissed by tapping on other areas of the screen',
                );
              },
            },
          );
        }}>
        <Text
          style={{
            padding: SIZES.padding,
            color: COLORS.secondary,
            fontWeight: 'bold',
            fontSize: 16,
          }}>
          Delete Account
        </Text>
        <MaterialIcons
          name="keyboard-arrow-right"
          size={30}
          color={COLORS.primary}
          style={{
            position: 'absolute',
            right: SIZES.padding,
          }}
        />
      </TouchableOpacity>
    );
  };

  sendEmailtoResetPassword = async () => {
    const user = auth().currentUser;

    console.log('These are the logged-in user email ------', user.email);

    try {
      await auth().sendPasswordResetEmail(user.email);
      console.log('Password reset email sent to ------', user.email);
    } catch (error) {
      console.error(error);
    }
  };

  // button
  renderContactUsButton = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          Linking.openURL('mailto:imrajsingh.is@gmail.com?subject=Inquiry');
        }}
        style={{
          alignSelf: 'center',
          position: 'absolute',
          top: SIZES.padding * 26,
          backgroundColor: COLORS.lightGray2,
          borderRadius: SIZES.radius,
          width: '90%',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{padding: SIZES.padding}}>Contact Us</Text>
        <MaterialIcons
          name="keyboard-arrow-right"
          size={30}
          color={COLORS.primary}
          style={{
            position: 'absolute',
            right: SIZES.padding,
          }}
        />
      </TouchableOpacity>
    );
  };

  // button and method
  renderChangePassword = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.sendEmailtoResetPassword().then(() => {
            Alert.alert(
              'Notice',
              'Password reset email has been sent to the email registered to this account.',
            );
          });
        }}
        style={{
          alignSelf: 'center',
          position: 'absolute',
          top: SIZES.padding * 20.5,
          backgroundColor: COLORS.lightGray2,
          borderRadius: SIZES.radius,
          width: '90%',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{padding: SIZES.padding}}>Change Password</Text>
        <MaterialIcons
          name="keyboard-arrow-right"
          size={30}
          color={COLORS.primary}
          style={{
            position: 'absolute',
            right: SIZES.padding,
          }}
        />
      </TouchableOpacity>
    );
  };

  renderChangeEmail = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate('UpdateEmailScreen');
        }}
        style={{
          alignSelf: 'center',
          position: 'absolute',
          top: SIZES.padding * 15,
          backgroundColor: COLORS.lightGray2,
          borderRadius: SIZES.radius,
          width: '90%',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{padding: SIZES.padding}}>Change Email</Text>
        <MaterialIcons
          name="keyboard-arrow-right"
          size={30}
          color={COLORS.primary}
          style={{
            position: 'absolute',
            right: SIZES.padding,
          }}
        />
      </TouchableOpacity>
    );
  };

  // not shown
  renderChangePhoneNumber = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate('UpdatePhoneNumber');
        }}
        style={{
          alignSelf: 'center',
          position: 'absolute',
          top: SIZES.padding * 22,
          backgroundColor: COLORS.lightGray2,
          borderRadius: SIZES.radius / 2,
        }}>
        <Text style={{padding: SIZES.padding * 2}}>Change Phone Number</Text>
      </TouchableOpacity>
    );
  };

  renderVerifyEmail = async () => {
    await auth()
      .currentUser.sendEmailVerification()
      .then(() => {
        console.log('Email Verification has been sent!');
        Alert.alert(
          'Notice',
          'Email verification has been sent to registered email address',
          [
            {
              title: 'Ok',
              style: 'cancel',
            },
          ],
        );
      });
  };

  renderVerifyEmailButton = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.renderVerifyEmail();
        }}
        style={{
          alignSelf: 'center',
          position: 'absolute',
          top: SIZES.padding * 9.5,
          backgroundColor: COLORS.lightGray2,
          borderRadius: SIZES.radius,
          width: '90%',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{padding: SIZES.padding}}>Verify Email</Text>
        <MaterialIcons
          name="keyboard-arrow-right"
          size={30}
          color={COLORS.primary}
          style={{
            position: 'absolute',
            right: SIZES.padding,
          }}
        />
      </TouchableOpacity>
    );
  };

  // not used
  getPhoneNumber = () => {
    const user = auth().currentUser;

    console.log("This is the user's number =====", user.phoneNumber);
    console.log("And this is the user's email ====", user.email);
    console.log(
      'The users names and shit ---- ',
      user.displayName,
      user.toJSON(),
    );
  };

  // not shown
  renderPhoneNumberButton = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.getPhoneNumber();
        }}
        style={{
          // alignSelf: 'center',
          position: 'absolute',
          top: SIZES.padding * 11,
          right: SIZES.padding * 3,
          backgroundColor: COLORS.lightGray2,
          borderRadius: SIZES.radius / 2,
        }}>
        <Text style={{padding: SIZES.padding * 2}}>Get User phoneNumber</Text>
      </TouchableOpacity>
    );
  };

  renderTitle = () => {
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
          Your Profile
        </Text>
      </View>
    );
  };

  render() {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: COLORS.white,
        }}>
        {/* {this.renderSignOutButton()} */}
        {/* {this.renderPhoneNumberButton()} */}
        {/* {this.renderChangePhoneNumber()} */}
        {this.renderContactUsButton()}
        {/* {this.renderPageTitle()} */}
        {this.renderTitle()}
        {this.renderDeleteButton()}
        {this.renderChangePassword()}
        {this.renderChangeEmail()}
        {this.renderVerifyEmailButton()}
        {this.renderHeader()}
      </SafeAreaView>
    );
  }
}

export default AccountDetailScreen;
