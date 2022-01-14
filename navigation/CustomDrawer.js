import React from 'react';
import {View, StyleSheet, Linking} from 'react-native';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {Drawer} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS, SIZES} from '../constants';
import Icons from 'react-native-vector-icons/Ionicons';
import auth, {firebase} from '@react-native-firebase/auth';

// here you can style your drawer navigator and customise it to your liking
const CustomDrawer = props => {
  // this is the message you will get users to share on whatsapp!
  const textMessage = 'Hey, I think you will like this app, give it a try!';

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props}>
        <Drawer.Section style={styles.drawerSection}>
          <DrawerItem
            icon={({color, size}) => (
              <Icon name="home-outline" color={COLORS.primary} size={size} />
            )}
            label="Home"
            onPress={() => {
              props.navigation.navigate('StartScreen');
            }}
            style={{
              paddingTop: SIZES.padding * 0.5,
            }}
          />
          <DrawerItem
            icon={({color, size}) => (
              <Icon
                name="bookmark-outline"
                color={COLORS.primary}
                size={size}
              />
            )}
            label="Favourite Places"
            onPress={() => {
              props.navigation.navigate('Saved Places');
            }}
            style={{
              paddingTop: SIZES.padding * 0.5,
            }}
          />
          <DrawerItem
            icon={({color, size}) => (
              <Icon name="account-outline" color={COLORS.primary} size={size} />
            )}
            label="Profile"
            style={{
              paddingTop: SIZES.padding * 0.5,
            }}
            onPress={() => {
              props.navigation.navigate('Account');
            }}
          />
          <DrawerItem
            icon={({color, size}) => (
              <Icons name="share-social" color={COLORS.primary} size={size} />
            )}
            label="Share"
            onPress={() => {
              Linking.openURL(`https://wa.me/send?text=%${textMessage}`);
            }}
            style={{
              paddingTop: SIZES.padding * 0.5,
            }}
          />
          <DrawerItem
            icon={({color, size}) => (
              <Icons
                name="information-circle-outline"
                color={COLORS.primary}
                size={size}
              />
            )}
            label="About Us"
            onPress={() => {
              props.navigation.navigate('AboutUs');
            }}
            style={{
              paddingVertical: SIZES.padding * 0.5,
            }}
          />
        </Drawer.Section>
      </DrawerContentScrollView>

      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({color, size}) => (
            <Icon name="exit-to-app" color={COLORS.primary} size={size} />
          )}
          label="Sign Out"
          onPress={async () => {
            await auth()
              .signOut()
              .then(() => {
                console.log('User has signed out');
              });
          }}
        />
      </Drawer.Section>
    </View>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 4.5,
    borderBottomColor: COLORS.primary,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#f4f4f4',
    // borderTopColor: COLORS.primary,
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
