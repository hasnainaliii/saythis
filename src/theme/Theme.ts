import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

export const colors = {
  // Primary palette
  primary: "#FAF3EB",
  primary10: "#e1dbd4",
  primary20: "#c8c2bc",
  primary_10: "#fbf4ed",
  primary_20: "#fbf5ef",

  // Secondary palette
  secondary: "#ff9b85",
  secondary10: "#e68c78",
  secondary20: "#cc7c6a",
  secondary_10: "#ffa591",
  secondary_20: "#ffaf9d",

  // Neutrals
  white: "#FFFFFF",
  black: "#000000",
  black_text: "#00000073",
  gray: "#F4F4F4",

  // Semantic text
  textDark: "#1A2B49",
  textMuted: "#5A6B89",
  textDisabled: "#A0A0A0",

  // Status / feedback
  error: "#FF4444",
  errorLight: "#FF6B6B",
  success: "#50C878",
  successBg: "#E8F5E9",
  successText: "#4CAF50",
  warning: "#FFB347",
  star: "#FFB800",

  // Category colors (exercise types)
  categoryEducation: "#4A90D9",
  categorySelfAwareness: "#7B68EE",
  categoryCBT: "#50C878",
  categorySelfAdvocacy: "#FF8C42",

  // Borders & decorative
  border: "#D0D0D0",
  overlay: "rgba(255,255,255,0.3)",

  // Library light palette
  libraryBg: "#FAF3EB",
  librarySurface: "#fbf4ed",
  libraryCard: "#FFFFFF",
  libraryCardAlt: "#fbf5ef",
  libraryBorder: "#e1dbd4",
  libraryText: "#1A2B49",
  libraryMuted: "#5A6B89",
  librarySoft: "#00000073",
  libraryAccent: "#ff9b85",
  libraryAccentSoft: "#ffa591",
  libraryOverlay: "rgba(250,243,235,0.75)",
  libraryOverlayClear: "rgba(250,243,235,0)",

  // Library tag colors
  tagSpeechBg: "#fbf5ef",
  tagSpeechText: "#1A2B49",
  tagBreathingBg: "#ffaf9d",
  tagBreathingText: "#1A2B49",
  tagDrillsBg: "#FFB347",
  tagDrillsText: "#1A2B49",
  tagModificationBg: "#e1dbd4",
  tagModificationText: "#1A2B49",
  tagBiofeedbackBg: "#ffa591",
  tagBiofeedbackText: "#1A2B49",
  tagGamificationBg: "#FFB800",
  tagGamificationText: "#1A2B49",
  tagSimulationBg: "#fbf4ed",
  tagSimulationText: "#1A2B49",
  tagProgressBg: "#ff9b85",
  tagProgressText: "#1A2B49",
  tagRelaxationBg: "#FAF3EB",
  tagRelaxationText: "#1A2B49",

  // Library gradients
  gradSpeechStart: "#fbf5ef",
  gradSpeechEnd: "#FAF3EB",
  gradBreathingStart: "#ffa591",
  gradBreathingEnd: "#ffaf9d",
  gradDrillsStart: "#FFB347",
  gradDrillsEnd: "#ffa591",
  gradModificationStart: "#fbf4ed",
  gradModificationEnd: "#e1dbd4",
  gradBiofeedbackStart: "#ff9b85",
  gradBiofeedbackEnd: "#ffa591",
  gradGamificationStart: "#FFB800",
  gradGamificationEnd: "#FFB347",
  gradSimulationStart: "#FAF3EB",
  gradSimulationEnd: "#fbf5ef",
  gradProgressStart: "#ffaf9d",
  gradProgressEnd: "#ffa591",
  gradRelaxationStart: "#fbf4ed",
  gradRelaxationEnd: "#fbf5ef",
};

export const FONTS = {
  primary: "MyFont-Regular",
  primaryBold: "MyFont-Bold",
  primaryBlack: "MyFont-Black",
  primaryThin: "MyFont-Thin",
};

export const fontSizes = {
  tiny: hp("1.2%"),
  small: hp("1.5%"),
  medium: hp("2%"),
  large: hp("2.5%"),
  xl: hp("3%"),
  xxl: hp("4%"),
};

export const spacingX = {
  xxs: wp("1"),
  xs: wp("2"),
  sm: wp("3"),
  md: wp("4"),
  lg: wp("5"),
  xl: wp("6"),
  xxl: wp("7"),
};

export const spacingY = {
  xxs: hp("0.5"),
  xs: hp("1"),
  sm: hp("1.5"),
  md: hp("2"),
  lg: hp("3"),
  xl: hp("4"),
  xxl: hp("5"),
};

export const radii = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  pill: 999,
};

export const dynamicFont = (percent: number) => hp(`${percent}`);

export const dynamicSpacingX = (percent: number) => wp(`${percent}`);

export const dynamicSpacingY = (percent: number) => hp(`${percent}`);
