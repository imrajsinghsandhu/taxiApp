import {Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');

export const COLORS = {
  // base colors
  primary: '#001E6B', // dark blue
  secondary: '#E10E40', // magenta, for icon tint colours

  // Blue primaries
  baseColour: '#430FFF', // base/main colour (lightest)
  DarkerBase: '#3408D1', // mediumDark base
  DarkestBase: '#300BB8', // Darkest Blue base

  // grey blue f2f7ff
  LightestGreyBase: '#EBF2FF', // lightest grey blue shade
  DarkerGreyBase: '#E0EDFF', // medium grey blue shade
  DarkestGreyBase: '#8DA9F7', // darkest grey blue shade

  // contrasting colour
  ContrastColour: '#2FF7D9', // contrasting colour
  LighterContrastColour: '#2ADEC3', // less bright version

  // colors
  black: '#1E1F20',
  white: '#FFFFFF',
  green: '#17d033',

  lightGray: '#F5F5F6',
  lightGray2: '#c9c9c9',
  lightGray3: '#d9d9d9',
  lightGray4: '#F8F8F9',
  transparent: 'transparent',
  darkgray: '#898C95',
};

export const SIZES = {
  // global sizes
  base: 8,
  font: 14,
  radius: 30,
  padding: 10,
  padding2: 12,

  // font sizes
  largeTitle: 50,
  h1: 30,
  h2: 22,
  h3: 20,
  h4: 18,
  body1: 30,
  body2: 20,
  body3: 16,
  body4: 14,
  body5: 12,

  // app dimensions
  width,
  height,
};

export const FONTSTaxi = {
  button: {fontFamily: 'SFProDisplay-Regular', fontSize: SIZES.h3},
  buttonTest: {fontFamily: 'Roboto-Regular', fontSize: SIZES.h3},
};

export const mainFont = 'SFProDisplay-Regular';
export const secFont = 'Roboto-Bold';

export const FONTS = {
  largeTitle: {
    fontFamily: 'Roboto-regular',
    fontSize: SIZES.largeTitle,
    lineHeight: 55,
  },
  h1: {fontFamily: 'Roboto-Black', fontSize: SIZES.h1, lineHeight: 36},
  h2: {fontFamily: 'Roboto-Bold', fontSize: SIZES.h2, lineHeight: 30},
  h3: {fontFamily: 'Roboto-Bold', fontSize: SIZES.h3, lineHeight: 22},
  h4: {fontFamily: 'Roboto-Bold', fontSize: SIZES.h4, lineHeight: 22},
  body1: {fontFamily: 'Roboto-Regular', fontSize: SIZES.body1, lineHeight: 36},
  body2: {fontFamily: 'Roboto-Regular', fontSize: SIZES.body2, lineHeight: 30},
  body3: {fontFamily: 'Roboto-Regular', fontSize: SIZES.body3, lineHeight: 22},
  body4: {fontFamily: 'Roboto-Regular', fontSize: SIZES.body4, lineHeight: 22},
  body5: {fontFamily: 'Roboto-Regular', fontSize: SIZES.body5, lineHeight: 22},
};

export const appTheme = {COLORS, SIZES, FONTS, FONTSTaxi};

export default appTheme;
