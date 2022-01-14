import React, {Component} from 'react';
import {
  Image,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import MapView from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';
import {COLORS, icons, SIZES} from '../constants';
import {mainFont} from '../constants/theme';

export default class selectViaMaps extends Component {
  constructor(props) {
    super(props);
    console.log('These are the props coming in', props); // The props include navigation and route, basically the same as functional programming
    this.state = {
      loading: true,
      region: {
        latitude: 1.3547281,
        longitude: 103.8332306,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
      },
      isMapReady: false,
      marginTop: 1,
      userLocation: '',
      regionChangeProgress: false,
      coords: '', // will hold lat lng object
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      position => {
        const region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        };
        this.setState({
          region: region,
          loading: false,
          error: null,
        });
      },
      error => {
        alert(error);
        this.setState({
          error: error.message,
          loading: false,
        });
      },
      {enableHighAccuracy: false, timeout: 5000, maximumAge: 5000},
    );
  }

  onMapReady = () => {
    this.setState({isMapReady: true, marginTop: 0});
  };

  // Fetch location details as a JSON from google map API
  fetchAddress = () => {
    fetch(
      'https://maps.googleapis.com/maps/api/geocode/json?latlng=' +
        this.state.region.latitude +
        ',' +
        this.state.region.longitude +
        '&key=' +
        'AIzaSyCAjG56jcj433jlXQVcsddbmLZmw-Kxj68',
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log('This is the responseJSON data', responseJson);
        const userLocation = responseJson.results[0].formatted_address;
        const coords = responseJson.results[0].geometry.location; // this will hold an object containing lat lng
        this.setState({
          userLocation: userLocation,
          regionChangeProgress: false,
          coords: coords, // updating the coords section of the state
        });
      });
  };

  // Update state on region change
  onRegionChange = region => {
    this.setState(
      {
        region,
        regionChangeProgress: true,
      },
      () => this.fetchAddress(),
    );
  };

  // Action to be taken after select location button click
  onLocationSelect = () => {
    console.log(
      'Button pressed, this is the address?',
      this.state.userLocation,
    );

    // now i shall find a way to get the selected location's coordinates , by checking what is in the userlocation information in console.

    const address = this.state.userLocation;

    const whereFrom = this.props.route.params.from; // this will hold which page it is coming from
    console.log('The page where it is coming from ----- ', whereFrom);
    const whichSection = this.props.route.params.section; // this will hold which section of the page it is coming from
    const coords = this.state.coords; // this should hold an object of lat & lng

    if (whereFrom == 'DropOff') {
      this.props.navigation.navigate(whereFrom, {
        whereFrom, // will hold which section this data should belong to, so you can run the required codes on the DropOff page
        lat: coords.lat,
        lng: coords.lng,
        selectedAddress: address, // the displayed field of the data structure
      });
    } else {
      // this else runs for when we navigating back to 'addPlace' page
      console.log('THIS IS SUPPOSED TO WORK, COMING BACK FROM SELECTVIAMAPS');
      this.props.navigation.navigate('addPlace', {
        selectedAddress: address,
        lat: coords.lat,
        lng: coords.lng,
      });
    }
  };

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.spinnerView}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    } else {
      return (
        <SafeAreaView
          style={{
            height: '100%',
            width: '100%',
          }}>
          <View style={{flex: 2}}>
            <MapView
              style={{flex: 0.88, marginTop: this.state.marginTop}}
              initialRegion={this.state.region}
              showsUserLocation={true}
              onMapReady={this.onMapReady}
              onRegionChangeComplete={this.onRegionChange}
            />

            {/* this view represents the floating icon that indicates the centre of the map screen */}
            <View
              style={{
                left: '45%',
                position: 'absolute',
                top: '40%',
              }}>
              <Icon name="location-sharp" size={40} />
            </View>
          </View>

          {/* this block of view code indicates the bottom part of the page which displays the 
            1. location the icon pin has dropped on 
            2. button which sends the data to the next page for filling of location 
            3. information at the top as to what to do on this page 
          */}
          <View
            style={{
              position: 'absolute',
              width: '100%',
              bottom: 0,
              backgroundColor: COLORS.lightGray,
              alignSelf: 'center',
              borderTopLeftRadius: SIZES.radius / 1.2,
              borderTopRightRadius: SIZES.radius / 1.2,
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: COLORS.black,
            }}>
            <View
              style={{
                padding: SIZES.padding * 1.8,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  fontFamily: mainFont,
                  marginBottom: SIZES.padding * 1.4,
                  alignSelf: 'center',
                }}>
                Drag map to select location
              </Text>

              <View
                style={{
                  backgroundColor: COLORS.DarkerGreyBase,
                  padding: SIZES.padding * 1.5,
                  borderRadius: SIZES.radius / 1.2,
                }}>
                <Text
                  style={{
                    fontSize: 11.5,
                    color: '#999',
                    fontFamily: mainFont,
                    fontWeight: 'bold',
                  }}>
                  LOCATION
                </Text>
                <Text
                  // this numberoflines allows for the excess words to be cut off to a "..."
                  numberOfLines={1}
                  style={{
                    fontSize: 15.5,
                    paddingTop: SIZES.padding * 0.8,
                    // paddingBottom: SIZES.padding,
                    fontFamily: mainFont,
                  }}>
                  {!this.state.regionChangeProgress
                    ? this.state.userLocation
                    : 'Identifying Location...'}
                </Text>
              </View>

              <View
                style={{
                  paddingTop: SIZES.padding * 1.1,
                }}>
                <TouchableOpacity
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    alignItems: 'center',
                    backgroundColor: COLORS.DarkestBase,
                    borderRadius: SIZES.radius,
                    paddingVertical: SIZES.padding,
                  }}
                  onPress={this.onLocationSelect}>
                  <Text
                    style={{
                      fontSize: 17,
                      color: COLORS.white,
                      fontFamily: mainFont,
                      fontWeight: 'bold',
                    }}>
                    Next
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    height: Dimensions.get('screen').height,
    width: Dimensions.get('screen').width,
  },
  mapMarker: {
    fontSize: 40,
    color: 'red',
  },
  deatilSection: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    display: 'flex',
    justifyContent: 'flex-start',
  },
  spinnerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnContainer: {
    width: Dimensions.get('window').width - 20,
    position: 'absolute',
    bottom: 100,
    left: 10,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 2,
    shadowRadius: 5,
    // elevation is the effect to make an element pop out even more.
    elevation: 0,
  },
});
