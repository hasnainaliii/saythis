import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, FONTS, fontSizes, spacingX, spacingY } from "../../../../theme/Theme";

export default function StatisticsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.content}>
        <Text style={styles.title}>Statistics</Text>
        <Text style={styles.subtitle}>Your progress and insights will appear here soon.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
    padding: spacingX.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xxl,
    color: colors.textDark,
    marginBottom: spacingY.sm,
  },
  subtitle: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.textMuted,
    textAlign: "center",
  },
});
