import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Sparkles } from "lucide-react-native";
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from "../../theme/Theme";

export function FeedbackLoading() {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Sparkles size={32} color={colors.categorySelfAwareness} />
      </View>
      <Text style={styles.title}>Analyzing your progress...</Text>
      <Text style={styles.subtitle}>
        Our AI is reviewing your therapy data to craft personalized feedback
      </Text>
      <ActivityIndicator
        size="large"
        color={colors.categorySelfAwareness}
        style={styles.spinner}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: spacingY.xxl,
    paddingHorizontal: spacingX.lg,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.categorySelfAwareness + "18",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacingY.lg,
  },
  title: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.large,
    color: colors.textDark,
    textAlign: "center",
    marginBottom: spacingY.sm,
  },
  subtitle: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: fontSizes.medium * 1.5,
    marginBottom: spacingY.xl,
  },
  spinner: {
    marginTop: spacingY.md,
  },
});
