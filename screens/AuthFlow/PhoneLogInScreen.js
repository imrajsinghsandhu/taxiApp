import React, {useState} from 'react';
import auth, {firebase} from '@react-native-firebase/auth';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  View,
  Alert,
  Image,
  Modal,
  FlatList,
} from 'react-native';
import {COLORS, countryCodeData, icons, SIZES} from '../../constants';
import OtpPhoneScreen from './OtpPhoneScreen';
import {mainFont} from '../../constants/theme';
import Icon from 'react-native-vector-icons/Ionicons';

const PhoneLogInScreen = props => {
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [check, setCheck] = useState(false);
  const [modal, setModal] = useState(false);
  const [selectedCode, setSelectedCode] = useState(null);
  const [joinedNums, setJoinedNums] = useState(null);
  const [verCode, setVerCode] = useState(null);
  const [CLIstate, setCLIstate] = useState(false); // state that turns true when we are coming in from choiceloginscreen

  const [currEmail, setCurrEmail] = useState(null);

  // need to have a otp resend button in the phone log in screen, for only CLI now need to do, done for the other one alr

  // the page had too many re-renders because of the CLIstate
  try {
    if (CLIstate) {
    } else {
      const comingFromScreen = props.route.params.comingFrom;
      if (comingFromScreen == 'ChoiceLogInScreen') {
        setCLIstate(true);
      }
    }
  } catch (error) {}

  // the box that holds the country code and the down arrow button
  function renderCountryCodeButton() {
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
            setModal(true);
            console.log(
              'The country code button has been pressed, opening Modal now',
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
              {selectedCode}
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
  }

  function renderModal() {
    // what to show when the list is empty, which it shouldnt be lol
    function renderEmptyShow() {
      return (
        <Text
          style={{
            alignSelf: 'center',
            justifyContent: 'center',
          }}>
          No country to pick motherfucker
        </Text>
      );
    }

    // how you are going to display each item
    function Item(props) {
      return (
        <TouchableOpacity
          onPress={() => {
            console.log('An item has been selected');
            setSelectedCode(props.dialCode); // the code you will save to the state to be shown in the previous screen
            setModal(false);
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
    }

    // the separator in between each item in the list
    function renderSeparator() {
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
    }

    // sample of what each item holds
    // {
    //   name: 'Afghanistan',
    //   dial_code: '+93',
    //   code: 'AF',
    // },

    return (
      <Modal visible={modal}>
        <FlatList
          scrollEnabled
          ListEmptyComponent={renderEmptyShow()}
          data={countryCodeData} // need to add data
          renderItem={({item}) => (
            <Item
              name={item.name} // name of the country
              dialCode={item.dial_code} // the dial code e.g. +65
              countryCode={item.code} // the short form of the country i.e. SG
            />
          )}
          keyExtractor={item => item.name}
          ItemSeparatorComponent={renderSeparator}
          style={{
            width: '100%',
            backgroundColor: COLORS.white,
            alignSelf: 'center',
            // borderRadius: SIZES.radius / 1.5,
          }}
        />
      </Modal>
    );
  }

  // regex expression to check for validity of OTP
  function isOTPValid(OTP) {
    var regex = /[0-9]{6}$/;
    console.log('This is input OTP -- ', OTP);
    return regex.test(String(OTP)); // will return true or false
  }

  // all in one checker if the OTP is valid or not
  function combinedOTPchecker(otp) {
    console.log('Running combinedOTPchecker');
    if (!otp) {
      return alert('Invalid OTP, please input the OTP you have received.');
    } else if (!isOTPValid(otp)) {
      return alert('Invalid OTP, please input the OTP you have received.');
    }

    // this code below only executes if the above errors do not pop up
    renderConfirmOTPLinking(otp);
  }

  // need to develop a regex for US phone numbers too!
  // uses regex to check if the combinedNumber is correct expression
  function isPhoneNumberValid(inputtxt) {
    var tenDigit = /^\+?[-. ]?([0-9]{10})$/; // works for both cases of +6586686144 and +65 86686144
    var elevenDigit = /^\+?[-. ]?([0-9]{11})$/;

    return tenDigit.test(String(inputtxt))
      ? true
      : elevenDigit.test(String(inputtxt)); // if tenDigit test returns false, we will run the elevenDigit test
  }

  // function that helps to combine the country code with the input number
  // then goes on to pass on to combinedChecker()
  function combineTheNumbers() {
    const combinedNumber = selectedCode + '' + phoneNumber;
    setJoinedNums(combinedNumber);
    return combinedChecker(combinedNumber);
  }

  // making an all in one validity checker for the input of the phone number, and then pushing off to another function (OTPLinking)
  function combinedChecker(number) {
    console.log('Running combined checker');
    if (!number) {
      return alert('Not a valid phone number');
    } else if (!isPhoneNumberValid(number)) {
      return alert('Not a valid phone number');
    } else if (CLIstate) {
      return CLILogIn(number);
    }
    // this block will pass when there is no error left, and into OTPLinking
    OTPLinking(number);
  }

  function renderPageTitle() {
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
  }

  function renderFillIns() {
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
            value={phoneNumber}
            onChangeText={input => {
              setPhoneNumber(input);
            }}
            placeholder="Phone number"
          />
        </View>
      </View>
    );
  }

  // button to confirm sending of verification code
  function renderSendCodeButton() {
    return (
      <TouchableOpacity
        onPress={() => {
          combineTheNumbers(); // start off by combining the number, then let the chain reaction carry on
          // console.log('Sending verification code');
        }}
        style={{
          alignSelf: 'center',
          position: 'absolute',
          top: SIZES.padding * 26,
          backgroundColor: COLORS.baseColour,
          borderRadius: SIZES.radius,
        }}>
        <Text
          style={{
            paddingHorizontal: SIZES.padding * 2.2,
            paddingVertical: SIZES.padding * 1.4,
            fontFamily: mainFont,
            color: COLORS.white,
            fontWeight: '700',
          }}>
          Send OTP
        </Text>
      </TouchableOpacity>
    );
  }

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // ~~~~~~~~~~~~~~~~~~ WHEN CLIState is true ~~~~~~~~~~~~~~~~~~~
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  const [disabledBool, setDisabledBool] = useState(true);

  // the whole log in with phone number process
  async function CLILogIn(number) {
    console.log('Running CLILogIn now');
    console.log(
      'this is the number being passed through CLILogIn ---- ',
      number,
    );
    // at the press of a button, you will call combinedNumbers() --> combinedChecker() --> CLILogIn()
    // i think if you want to resend the OTP, you just need to link a button to this signInWith shit again,
    // and it starts a new session all over
    await auth()
      .signInWithPhoneNumber(number, true)
      .then(details => {
        setConfirm(details); // the is the callback result of the promise, it is here where the OTP gets sent to the user
        setCheck(true); // setting this to true will now engage the OTP fill in page
      })
      .catch(error => {
        console.log(error);
        console.log('This is the error code ------', error.code);

        if (error.code == 'auth/invalid-verification-code') {
          Alert.alert(
            'Notice',
            'You have entered the incorrect OTP. Please click the re-send button for another OTP.',
          );
        } else if (error.code == 'auth/too-many-requests') {
          Alert.alert(
            'Notice',
            'We have blocked all requests from this device due to unusual activity. Try again later.',
          );
        }
      });
  }

  function renderCLIFillIns() {
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
            value={phoneNumber}
            onChangeText={input => {
              setPhoneNumber(input);
            }}
            placeholder="Phone number"
          />
        </View>
      </View>
    );
  }

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // ~~~~~~~~~~~~~~~~~~~~~~~~ OTPstate ~~~~~~~~~~~~~~~~~~~~~~~~~~
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // states used for OTPLinking process
  const [OTPLinkingState, setOTPLinkingState] = useState(false); // decide using this when to show what components on screen
  const [verificationId, setVerificationId] = useState(null);

  // method for resending OTP but now for linking process, as in OTPPhoneScreen, the resend OTP method was only for signin process, not link process.
  const resendOTPMethodLinking = async number => {
    // ill need this function to restart the code verification process, by sending a new code
    await auth()
      .verifyPhoneNumber(number.toString(), true)
      .on('state_changed', phoneAuthSnapshot => {
        console.log('State: ', phoneAuthSnapshot.state);

        // setOTPLinkingState(true); // this will trigger to show all the OTPLinkingState components and method .... i shouldnt need this line for re-send button
        setVerificationId(phoneAuthSnapshot.verificationId);
        console.log('We should be displaying the OTP screen now');
      })
      .catch(error => {
        console.log('Error ----- : ', error);
        console.log('This is the errorcode ---', error.code);

        if (error.code == 'auth/too-many-requests') {
          Alert.alert(
            'Notice',
            'We have blocked all requests from this device due to unusual activity. Try again later.',
          );
        }
      });
  };

  // general resend OTP button
  const resendOTPButtonLinking = () => {
    return (
      <TouchableOpacity
        disabled={disabledBool} // will go abled when we get an error message from putting in the wrong verification code
        onPress={() => {
          console.log('We are pressing the resend button');
          resendOTPMethodLinking(joinedNums);
          setDisabledBool(true);
        }}
        style={{
          alignSelf: 'center',
          position: 'absolute',
          top: SIZES.padding * 33,
          backgroundColor: disabledBool ? COLORS.lightGray2 : COLORS.baseColour,
          borderRadius: SIZES.radius,
        }}>
        <Text
          style={{
            paddingHorizontal: SIZES.padding * 2.2,
            paddingVertical: SIZES.padding * 1.4,
            color: disabledBool ? COLORS.lightGray : COLORS.white,
            fontWeight: '700',
          }}>
          Re-send OTP
        </Text>
      </TouchableOpacity>
    );
  };

  // this is triggered from pressing "send code" button above
  // this function is the one that will trigger the sending of the code, plus trigger converting the page into an OTPLinking page
  async function OTPLinking(number) {
    await auth()
      .verifyPhoneNumber(number.toString(), true)
      .on('state_changed', phoneAuthSnapshot => {
        console.log('State: ', phoneAuthSnapshot.state);

        const user = auth().currentUser;

        // console.log('ooooooo');
        // console.log(
        //   'This is the user email we are logged into now ---- ',
        //   user.email,
        // );

        if (user) {
          setCurrEmail(user.email); // this lets use remember which email we are trying to link to
        }

        setOTPLinkingState(true); // this will trigger to show all the OTPLinkingState components and method
        console.log(
          'This is the verification ID from photoAuthSnapshot ----',
          phoneAuthSnapshot.verificationId,
        );
        setVerificationId(phoneAuthSnapshot.verificationId);
        console.log('We should be displaying the OTP screen now');
      })
      .catch(error => {
        console.error('Error ----- : ', error);
        console.error('This is the errorcode ---', error.code);

        // when user makes too many OTP requests
        if (error.code == 'auth/too-many-requests') {
          setOTPLinkingState(false);
          Alert.alert(
            'Notice',
            'We have blocked all requests from this device due to unusual activity. Try again later.',
          );
        } else if (error.code == 'auth/invalid-phone-number') {
          setOTPLinkingState(false);
          Alert.alert('Notice', 'Invalid Phone Number');
        }
      });
  }

  // method for linking, which will run when the user clicks on the button to confirm OTP
  // can also be configured to automatically run when there are 6 digits in the input box for OTP
  const renderConfirmOTPLinking = async code => {
    console.log('Running renderConfirmOTPLinking ------');
    console.log('this is the otp we have input ----', code);

    const phoneCredential = auth.PhoneAuthProvider.credential(
      verificationId.toString(),
      code.toString(),
    );

    console.log('This is phoneCredential ---- ', phoneCredential);
    return await auth()
      .currentUser.linkWithCredential(phoneCredential)
      .then(details => {
        console.log('Running this shit again');
        const phoneNumber = details.user.phoneNumber;
        const userEmail =
          details.user.email === null ? 'bullshit' : details.user.email; // if i return bullshit, theres no email called bullshit so its the same shit

        console.log(
          'This will be the current users phone number --- ',
          phoneNumber,
        );
        // console.log('And this is the users email --- ', userEmail);

        // firstly, this will only trigger when i try linking my account
        // if I have a new number, then the currEmail will return A, and the userEmail will return A as well.
        // if I am using another persons number, then i will sign in to another user's account, and currEmail = A, while userEmail = B
        // which will cause the user to be logged out and we will throw an alert.

        // e.g. grotti.info@gmail.com != imrajsingh.is@gmail.com, i will not allow linking to occur
        if (currEmail != userEmail) {
          // now i will forcefully sign the user out and raise an alert
          return (
            auth().signOut(),
            Alert.alert(
              'Notice',
              'The number you have provided is attached to another email account. Please log in with the correct email account, or log in via Phone Number.',
            )
          );
        } else {
          props.navigation.navigate('MainScreen');
        }
      })

      .catch(error => {
        console.log(error);
        console.log('This is the error code ------', error.code);

        if (error.code == 'auth/invalid-verification-code') {
          setDisabledBool(false);
          Alert.alert('Notice', 'You have entered the incorrect OTP.');
        } else if (error.code == 'auth/session-expired') {
          Alert.alert(
            'Notice',
            'This session has expired, please try again later',
          );
        }
      });
  };

  // page title component for linking with OTP
  function renderLinkingPageTitle() {
    return (
      <View>
        <Text
          style={{
            position: 'absolute',
            marginTop: SIZES.padding * 13,
            fontSize: 30,
            fontWeight: 'bold',
            fontFamily: mainFont,
            left: SIZES.padding * 13.5,
          }}>
          My OTP is
        </Text>

        <View
          style={{
            backgroundColor: COLORS.ContrastColour,
            height: 17,
            width: 160,
            position: 'absolute',
            top: SIZES.padding * 15.65,
            left: SIZES.padding * 12.5,
            zIndex: -5, // this zIndex will set if the item is at the top or the bottom
            borderTopLeftRadius: SIZES.radius,
            borderBottomRightRadius: SIZES.radius,
          }}
        />
      </View>
    );
  }

  // textinput component for the OTP input box
  function renderLinkingOtpFiller() {
    return (
      <View
        style={{
          marginTop: SIZES.padding * 19,
          alignSelf: 'center',
          width: '37%',
          position: 'absolute',
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
            value={verCode}
            onChangeText={input => {
              setVerCode(input);
            }}
            placeholder="Verification code"
            maxLength={6} // 6-digit OTP
          />
        </View>
      </View>
    );
  }

  // button component for clicking to run the renderConfirmOTPLinking method
  function renderLinkingVerifyCodeButton() {
    return (
      <TouchableOpacity
        onPress={() => {
          console.log('Pressed the confirmOTP button');
          combinedOTPchecker(verCode);
          // will run the confirmVerificationCode function upon press, provided there is a 6 digit OTP typed in
        }}
        style={{
          alignSelf: 'center',
          position: 'absolute',
          top: SIZES.padding * 26.5,
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
  }

  // --------------------------------------------------------------------------------------------------- rendering process ---------------------------------------------------------------------------------------------------
  // --------------------------------------------------------------------------------------------------- rendering process ---------------------------------------------------------------------------------------------------
  // --------------------------------------------------------------------------------------------------- rendering process ---------------------------------------------------------------------------------------------------
  // --------------------------------------------------------------------------------------------------- rendering process ---------------------------------------------------------------------------------------------------

  // choiceLogIn is sorted already so we dont worry about that, we worry about the linking process
  if (CLIstate) {
    if (check) {
      return (
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: COLORS.white,
          }}>
          <OtpPhoneScreen confirmData={confirm} combinedNumbers={joinedNums} />
        </SafeAreaView>
      );
    } else {
      return (
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: COLORS.white,
          }}>
          {renderPageTitle()}
          {renderCountryCodeButton()}
          {renderCLIFillIns()}
          {renderSendCodeButton()}
          {renderModal()}
        </SafeAreaView>
      );
    }
  } else if (OTPLinkingState && verificationId) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: COLORS.white,
        }}>
        {renderLinkingPageTitle()}
        {renderLinkingOtpFiller()}
        {renderLinkingVerifyCodeButton()}
        {resendOTPButtonLinking()}
        {/* <OtpPhoneScreen
          confirmData={confirm}
          combinedNumbers={joinedNums}
          comingFrom={'linking'}
          verificationId={verificationId}
        /> */}
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: COLORS.white,
        }}>
        {renderFillIns()}
        {renderPageTitle()}
        {renderSendCodeButton()}
        {renderCountryCodeButton()}
        {renderModal()}
      </SafeAreaView>
    );
  }
};

export default PhoneLogInScreen;
