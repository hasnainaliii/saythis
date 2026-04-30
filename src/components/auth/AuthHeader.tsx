import React from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { colors, dynamicSpacingY } from "../../theme/Theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface AuthHeaderProps {
  logoSize?: number;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ logoSize = 100 }) => {
  return (
    <View style={styles.container}>
      <View style={styles.curve} />
      <View style={styles.logoContainer}>
        <Image
          source={require("../../../assets/images/saythis-high-resolution-logo-transparent.png")}
          style={{ width: logoSize, height: logoSize }}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: dynamicSpacingY(22),
    position: "relative",
    overflow: "hidden",
  },
  curve: {
    position: "absolute",
    top: 0,
    left: "-20%",
    width: "140%",
    height: "100%",
    backgroundColor: colors.secondary_20,
    borderBottomLeftRadius: SCREEN_WIDTH,
    borderBottomRightRadius: SCREEN_WIDTH,
  },
  logoContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: dynamicSpacingY(2),
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AuthHeader;
