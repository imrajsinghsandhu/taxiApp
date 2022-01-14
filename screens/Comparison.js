import React, {useState, useEffect} from 'react';
import {
  Image,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  FlatList,
} from 'react-native';
import {COLORS, icons, SIZES} from '../constants';
import MapView, {Callout, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import googleAPIKey from '../config';

// this is what you need for linking to another app
import AppLink from 'react-native-app-link';

// UI stuff
import Icon from 'react-native-vector-icons/Ionicons';
import {FONTS, mainFont} from '../constants/theme';

// I just need to set initial region
// Show suggested route
// Confine the route view area like the food delivery app
// Add tiles that show pickUp && dropOff points, label indicating "Suggested Route"
// Link the choices to the respective applications!
// Copy the destination to clipboard when selecting a choice
// Add cheapest sorting button! THE WHOLE POINT OF THE APP LOLZZ

const GOOGLE_MAPS_APIKEY = googleAPIKey;

const Comparison = ({route, navigation}) => {
  // const mapView = React.useRef();

  const [originPlace, setOriginPlace] = useState(null);
  const [destinationPlace, setDestinationPlace] = useState(null);
  const [pickupTitle, setPickupTitle] = useState('');
  const [dropoffTitle, setDropoffTitle] = useState('');

  const [routeDistance, setRouteDistance] = useState(null);
  const [routeDuration, setRouteDuration] = useState(null);

  const [grabPrice, setGrabPrice] = useState(null);
  const [gojekPrice, setGojekPrice] = useState(null);
  const [rydePrice, setRydePrice] = useState(null);
  const [comfortdelgroPrice, setComfortdelgroPrice] = useState(null);
  const [tadaPrice, setTadaPrice] = useState(null);

  const [fromLat, setFromLat] = useState(null);
  const [fromLng, setFromLng] = useState(null);
  const [toLat, setToLat] = useState(null);
  const [toLng, setToLng] = useState(null);

  const [region, setRegion] = useState(null);

  // OKAY SO THE PROBLEM WAS THE NAMING CONVENTIONS OF THE DATA PASSING IN BETWEEN STACKS!!! HAS TO FOLLOW A NAMING CONVENTION
  // FROM PREV SCREEN AND THEN COPY OVER TO THIS SCREEN!!!
  // console.log('################ Outside origin:', originPlace);

  // configuring the values upon the starting of the Comparison screen
  // am getting originPlace, and destinationPlace as incoming parameters, from DropOff page! ^^^^^^^impt
  // i guess if you follow this format too, then you wouldnt need to configure the initial region to bishan in Home?
  useEffect(() => {
    let {originPlace, destinationPlace} = route.params;

    // console.log('************** This is the origin data:', originPlace);

    // this brilliant and simple function allows for you to now have a motherList
    // data structure that can access "data.description" HURRAYYYY!!! :D
    function titleCheck(item) {
      try {
        return item.data.structured_formatting.main_text;
      } catch (error) {
        return item.data.description;
      }
    }

    let fromLat = originPlace.details.geometry.location.lat;
    let fromLng = originPlace.details.geometry.location.lng;
    let toLat = destinationPlace.details.geometry.location.lat;
    let toLng = destinationPlace.details.geometry.location.lng;
    let pickupTitle = titleCheck(originPlace);
    let dropoffTitle = titleCheck(destinationPlace);

    let region = {
      latitude: (fromLat + toLat) / 2.055,
      longitude: (fromLng + toLng) / 2,
      latitudeDelta: Math.abs(fromLat - toLat) * 2,
      longitudeDelta: Math.abs(fromLng - toLng) * 1.15,
    };

    setOriginPlace(originPlace);
    setDestinationPlace(destinationPlace);
    setFromLat(fromLat);
    setFromLng(fromLng);
    setToLat(toLat);
    setToLng(toLng);
    setRegion(region);
    setPickupTitle(pickupTitle);
    setDropoffTitle(dropoffTitle);
  }, []);

  // now from here you can set the prices! wonderful!
  useEffect(() => {
    function JustGrab() {
      const minimum_fare = 6.0;
      const base_fare = 2.5;
      const platform_fee = 0.7;
      const per_km_rate = 0.5;
      const per_min_fare = 0.16;

      let final_price =
        base_fare +
        platform_fee +
        per_km_rate * routeDistance +
        per_min_fare * routeDuration;

      return final_price < minimum_fare
        ? `$ ${minimum_fare + platform_fee}`
        : `$ ${final_price.toFixed(2)}`;
    }

    function gojek() {
      const minimum_fare = 6;
      const base_fare = 2.7;
      const platform_fee = 0.7;
      const per_km_rate = 0.7;
      const per_min_fare = 0.0;

      let final_price =
        base_fare +
        platform_fee +
        per_km_rate * routeDistance +
        per_min_fare * routeDuration;

      return final_price < minimum_fare
        ? `$ ${minimum_fare + platform_fee}`
        : `$ ${final_price.toFixed(2)}`;
    }

    function rydeX() {
      const minimum_fare = 6;
      const base_fare = 2.5;
      const platform_fee = 0.3;
      const per_km_rate = 0.55;
      const per_min_fare = 0.14;

      let final_price =
        base_fare +
        platform_fee +
        per_km_rate * routeDistance +
        per_min_fare * routeDuration;

      return final_price < minimum_fare
        ? `$ ${minimum_fare + platform_fee}`
        : `$ ${final_price.toFixed(2)}`;
    }

    function ComfortRIDE() {
      const minimum_fare = 6;
      const base_fare = 2.8;
      const platform_fee = 0.0;
      const per_km_rate = 0.5;
      const per_min_fare = 0.15;

      let final_price =
        base_fare +
        platform_fee +
        per_km_rate * routeDistance +
        per_min_fare * routeDuration;

      return final_price < minimum_fare
        ? `$ ${minimum_fare + platform_fee}`
        : `$ ${final_price.toFixed(2)}`;
    }

    function Tada() {
      const minimum_fare = 5;
      const base_fare = 2.5;
      const platform_fee = 0.6;
      const per_km_rate = 0.5;
      const per_min_fare = 0.0;

      let final_price =
        base_fare +
        platform_fee +
        per_km_rate * routeDistance +
        per_min_fare * routeDuration;

      return final_price < minimum_fare
        ? `$ ${minimum_fare + platform_fee}`
        : `$ ${final_price.toFixed(2)}`;
    }

    let grabPrice = JustGrab();
    let gojekPrice = gojek();
    let rydePrice = rydeX();
    let comfortdelgroPrice = ComfortRIDE();
    let tadaPrice = Tada();

    setGrabPrice(grabPrice);
    setGojekPrice(gojekPrice);
    setComfortdelgroPrice(comfortdelgroPrice);
    setRydePrice(rydePrice);
    setTadaPrice(tadaPrice);
  }, [routeDistance, setRouteDuration]);

  function renderMap() {
    const fromCoords = {
      latitude: fromLat,
      longitude: fromLng,
    };

    console.log('This is the fromCoords value ----- ', fromCoords);

    const toCoords = {
      latitude: toLat,
      longitude: toLng,
    };

    return (
      <MapView
        style={{
          flex: 1,
        }}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        initialRegion={region}>
        <MapViewDirections
          origin={{
            latitude: fromLat,
            longitude: fromLng,
          }}
          destination={{
            latitude: toLat,
            longitude: toLng,
          }}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeColor="blue"
          strokeWidth={5}
          onReady={info => {
            console.log('~~~~~~~~~~~~~~~ Data from onReady ~~~~~~~~~~~~~~~');
            console.log(`Distance: ${info.distance} km `);
            console.log(`Duration: ${info.duration} mins `);

            let routeDistance = info.distance;
            let routeDuration = info.duration;

            setRouteDistance(routeDistance);
            setRouteDuration(routeDuration);

            // // assignment statements for the variables in the higher environment
            // routeDistance = info.distance;
            // routeDuration = info.duration;
          }}
        />

        <Marker coordinate={fromCoords}>
          {/* this is how you make the floaty bubble thing, wellllll not quite! REMEMBER!! */}
          <Callout tooltip>
            <View
              style={{
                backgroundColor: COLORS.white,
                borderRadius: SIZES.radius,
                ...styles.shadow,
                flexDirection: 'row',
                padding: SIZES.padding,
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
              }}>
              <Text>{pickupTitle}</Text>
            </View>
          </Callout>
        </Marker>

        <Marker coordinate={toCoords} title={dropoffTitle}>
          <Callout tooltip>
            <View
              style={{
                backgroundColor: COLORS.white,
                borderRadius: SIZES.radius,
                ...styles.shadow,
                flexDirection: 'row',
                padding: SIZES.padding,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text>{dropoffTitle}</Text>
            </View>
          </Callout>
        </Marker>
      </MapView>
    );
  }

  function renderBackButton() {
    return (
      <View
        style={{
          position: 'absolute',
          left: SIZES.padding * 2,
          top: SIZES.padding * 2,
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={29} color={COLORS.black} />
        </TouchableOpacity>
      </View>
    );
  }

  function renderSelection() {
    return (
      <View style={styles.floatingSelection}>
        <Text
          style={{
            // top:SIZES.padding / 2.5,
            // position:'absolute',
            paddingBottom: SIZES.padding,
            paddingTop: SIZES.padding / 4.5,
          }}>
          Take your pick!
        </Text>

        <View
          style={{
            backgroundColor: COLORS.black,
            width: '20%',
            height: 0.3,
            position: 'absolute',
            top: SIZES.padding * 2.5,
          }}
        />

        <TouchableOpacity style={styles.comparisonListBox}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: SIZES.padding * 1.25,
            }}>
            <Image source={icons.car} style={{height: 25, width: 25}} />
            <Text style={{paddingLeft: SIZES.padding * 1.5, fontSize: 20}}>
              Gojek
            </Text>
          </View>

          <Text style={{fontSize: 15}}>$ 9.40</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.comparisonListBox}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: SIZES.padding * 1.25,
            }}>
            <Image source={icons.car} style={{height: 25, width: 25}} />
            <Text style={{paddingLeft: SIZES.padding * 1.5, fontSize: 20}}>
              Grab
            </Text>
          </View>

          <Text style={{fontSize: 15}}>$ 9.40</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.comparisonListBox}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: SIZES.padding * 1.25,
            }}>
            <Image source={icons.car} style={{height: 25, width: 25}} />
            <Text style={{paddingLeft: SIZES.padding * 1.5, fontSize: 20}}>
              ComfortDelgro
            </Text>
          </View>

          <Text style={{fontSize: 15}}>$ 9.20</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.comparisonListBox}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: SIZES.padding * 1.25,
            }}>
            <Image source={icons.car} style={{height: 25, width: 25}} />
            <Text style={{paddingLeft: SIZES.padding * 1.5, fontSize: 20}}>
              Ryde
            </Text>
          </View>

          <Text style={{fontSize: 15}}>$ 9.40</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.comparisonListBox}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: SIZES.padding * 1.25,
            }}>
            <Image source={icons.car} style={{height: 25, width: 25}} />
            <Text style={{paddingLeft: SIZES.padding * 1.5, fontSize: 20}}>
              Tada
            </Text>
          </View>

          <Text style={{fontSize: 15}}>$ 10.50</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const dummyData = [
    {
      id: 1,
      name: 'Grab',
      URI: 'grab://open', // doesnt work on Android systems, but URI2 does work on both platforms, just that android will be redirected to chrome search
      URI2: 'https://grab.onelink.me/2695613898?pid=website&c=SG_NA_PAX_AG_ACQ_LOC__NA_Broad&is_retargeting=true&af_dp=grab%3A%2F%2Fopen&af_force_deeplink=true&af_sub5=organic&af_ad=&af_web_dp=https%3A%2F%2Fwww.grab.com%2Fsg%2Fdownload%2F',
      playStoreId: 'com.grabtaxi.passenger',
    },
    {
      id: 2,
      name: 'GoJek',
      URI: 'gojek://open', // works on both systems
      URI2: 'https://gojek.onelink.me/2351932542?af_banner=true&amp;pid=Go-Jek_Web&amp;c=WebToAppBanner&amp;af_adset=bottom-banner&amp;af_ad=%2Fsg%2F&amp;af_dp=gojek%3A%2F%2Fhome',
      URI3: 'gojek://gojek.page.link',
      URI4: 'https://gojek.link',
      playStoreId: 'com.gojek.app',
    },
    {
      id: 3,
      name: 'Ryde',
      URI: 'ryde://open', // works on both systems
      URI2: 'ryde://open',
      playStoreId: 'com.rydesharing.ryde',
    },
    {
      id: 4,
      name: 'ComfortDelgro',
      URI: 'https://comfortdelgro.onelink.me/1fTR/4b218de6', // works on both systems
      playStoreId: 'com.codigo.comfort',
    },
    {
      id: 5,
      name: 'Tada',
      URI2: 'tada://open', // works only on iOS, for android URI2 works, but will be redirected to chrome page first
      URI3: 'https://tada-rider.app.link',
      URI: 'https://tada-rider-alternate.app.link',
      playStoreId: 'io.mvlchain.tada',
    },
  ];

  function getPrice({name, routeDistance, routeDuration}) {
    if (name === 'Grab') {
      return grabPrice;
    } else if (name === 'GoJek') {
      return gojekPrice;
    } else if (name === 'Ryde') {
      return rydePrice;
    } else if (name === 'ComfortDelgro') {
      return comfortdelgroPrice;
    } else if (name === 'Tada') {
      return tadaPrice;
    }
  }

  // how to render each item in the FlatList

  // just put their playstore addresses into their individual dummyDatas, then create an onPress function that directs them that path. BOOMZ.
  function Item({name, URI, playStoreId}) {
    return (
      <TouchableOpacity
        onPress={() =>
          AppLink.maybeOpenURL(URI, {
            playStoreId: playStoreId,
          }).then(() => {
            console.log(URI);
          })
        }
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginVertical: SIZES.padding * 1.4,
          marginHorizontal: SIZES.padding * 2,
        }}>
        {/* name of taxiCompany */}
        <Text
          style={{
            fontSize: 17,
            fontFamily: mainFont,
          }}>
          {name}
        </Text>

        {/* price of ride */}
        <Text style={{fontSize: 16}}>{getPrice({name})}</Text>
      </TouchableOpacity>
    );
  }

  const renderSeparator = () => {
    return (
      <View
        style={{
          width: '90%',
          // remember this hairlinewidth, meant to make the separators all consistent!!
          height: 0.8,
          backgroundColor: COLORS.DarkestGreyBase,
          alignSelf: 'center',
        }}
      />
    );
  };

  const renderListHeader = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          paddingTop: SIZES.padding / 2,
        }}>
        <Text>Take your pick!</Text>
      </View>
    );
  };

  function renderFlatList() {
    return (
      <FlatList
        data={dummyData}
        renderItem={({item}) => (
          <Item
            name={item.name}
            URI={item.URI}
            playStoreId={item.playStoreId}
          />
        )}
        keyExtractor={item => item.id.toString()}
        ItemSeparatorComponent={renderSeparator}
        ListHeaderComponent={renderListHeader}
        style={{
          position: 'absolute',
          bottom: SIZES.padding,
          width: '95%',
          backgroundColor: COLORS.white,
          alignSelf: 'center',
          borderRadius: SIZES.radius / 1.5,
          ...styles.shadow,
        }}></FlatList>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {fromLat && toLat && renderMap()}
      {renderBackButton()}
      {renderFlatList()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backNavArrow: {
    width: 20,
    height: 20,
    tintColor: COLORS.white,
    marginLeft: SIZES.padding * 1.3,
    marginTop: SIZES.padding * 1.3,
  },
  backNavCircle: {
    backgroundColor: COLORS.primary,
    height: 45,
    width: 45,
    borderRadius: SIZES.radius,
    marginLeft: SIZES.padding * 1.8,
    marginTop: SIZES.padding * 2,
  },
  comparisonListBox: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '95%',
    paddingHorizontal: SIZES.padding * 2,
    justifyContent: 'space-between',
    borderWidth: 0.5,
    borderColor: COLORS.primary,
    borderRadius: SIZES.radius / 2.5,
    marginBottom: SIZES.padding / 1.8,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  floatingSelection: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
    // elevation is the effect to make an element pop out even more.
    elevation: 5,
    position: 'absolute',
    bottom: SIZES.padding / 1.2,
    left: SIZES.padding,
    right: SIZES.padding,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    // height:350,
    borderRadius: SIZES.radius / 1.5,
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
    elevation: 4.5,
  },
});

export default Comparison;
