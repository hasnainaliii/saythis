import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { colors, FONTS, fontSizes, spacingY } from "../theme/Theme";
import { BackButton } from "./BackButton";

interface ScreenHeaderProps {
  title: string;
  onBackPress?: () => void;
  rightSlot?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  onBackPress,
  rightSlot,
  containerStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <BackButton onPress={onBackPress} style={styles.backButton} />
      <Text style={styles.title}>{title}</Text>
      {rightSlot ? <View style={styles.rightSlot}>{rightSlot}</View> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacingY.xs,
    marginBottom: spacingY.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 0,
  },
  rightSlot: {
    position: "absolute",
    right: 0,
  },
  title: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.large,
    color: colors.black,
    textAlign: "center",
  },
});
