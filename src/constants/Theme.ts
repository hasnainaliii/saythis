import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';


export const colors = {
  // Primary shades (greenish)
  primary: '#FAF3EB', // 0%
  primary10: '#e1dbd4', // 20%
  primary20: '#c8c2bc', // 40%
  primary_10: '#fbf4ed', // 60%
  primary_20: '#fbf5ef', // 80%

  // Secondary shades (salmon)
  secondary: '#ff9b85', // 0%
  secondary10: '#e68c78', // 20%
  secondary20: '#cc7c6a', // 40%
  secondary_10: '#ffa591', // 60%
  secondary_20: '#ffaf9d', // 80%

  // Neutrals
  white: '#FFFFFF',
  black: '#000000',
  black_text: '#00000073',
  gray: '#F4F4F4',
};

export const FONTS = {
  primary: 'MyFont-Regular',     
  primaryBold: 'MyFont-Bold',  
  primaryBlack: 'MyFont-Black', 
  primaryThin: 'MyFont-Thin', 

};

export const fontSizes = {
  tiny: hp('1.2%'),
  small: hp('1.5%'),
  medium: hp('2%'),
  large: hp('2.5%'),
  xl: hp('3%'),
  xxl: hp('4%'),
};

export const spacingX = {
  xxs: wp('1'),
  xs: wp('2'),
  sm: wp('3'),
  md: wp('4'),
  lg: wp('5'),
  xl: wp('6'),
  xxl: wp('7'),
};


export const spacingY = {
  xxs: hp('0.5'),
  xs: hp('1'),
  sm: hp('1.5'),
  md: hp('2'),
  lg: hp('3'),
  xl: hp('4'),
  xxl: hp('5'),
};


export const dynamicFont = (percent: number) => hp(`${percent}`);


export const dynamicSpacingX = (percent: number) => wp(`${percent}`);


export const dynamicSpacingY = (percent: number) => hp(`${percent}`);