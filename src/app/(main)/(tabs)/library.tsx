import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, FONTS, fontSizes } from "../../../theme/Theme";

export default function LibraryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Library - Coming Soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xl,
    color: colors.black,
  },
});
