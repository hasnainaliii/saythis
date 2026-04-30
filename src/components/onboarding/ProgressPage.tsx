import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import {
  colors,
  dynamicSpacingX,
  dynamicSpacingY,
  FONTS,
  fontSizes,
  spacingX,
  spacingY,
} from "../../theme/Theme";

interface ProgressPageProps {
  onSkip: () => void;
}

const ProgressPage: React.FC<ProgressPageProps> = ({ onSkip }) => {
  return (
    <>
      <View style={styles.header}>
        <View style={{ flex: 1 }} />
        <Pressable onPress={onSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>See Your Progress</Text>
        <Text style={styles.subtitle}>
          Visualize your journey from anxiety to{"\n"}confidence.
        </Text>
      </View>

      <View style={styles.progressCard}>
        <View style={styles.scoreHeader}>
          <View>
            <Text style={styles.scoreLabel}>CONFIDENCE SCORE</Text>
            <View style={styles.scoreRow}>
              <Text style={styles.scoreValue}>92%</Text>
              <Ionicons name="trending-up" size={24} color={colors.white} />
            </View>
          </View>
          <View style={styles.weekBadge}>
            <Text style={styles.weekBadgeText}>+14% this week</Text>
          </View>
        </View>

        <View style={styles.illustrationContainer}>
          <Image
            source={require("../../assets/images/onboarding-3-progress.png")}
            style={styles.progressIllustration}
            resizeMode="contain"
          />
        </View>
      </View>

      <View style={styles.featuresContainer}>
        <View style={styles.featureButton}>
          <View style={styles.featureIcon}>
            <Ionicons name="mic-outline" size={24} color={colors.white} />
          </View>
          <Text style={styles.featureText}>Record</Text>
        </View>

        <View style={styles.featureButton}>
          <View style={styles.featureIcon}>
            <Ionicons name="stats-chart" size={24} color={colors.white} />
          </View>
          <Text style={styles.featureText}>Track</Text>
        </View>

        <View style={styles.featureButton}>
          <View style={styles.featureIcon}>
            <MaterialCommunityIcons name="yoga" size={24} color={colors.white} />
          </View>
          <Text style={styles.featureText}>Grow</Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacingX.lg,
    paddingTop: spacingY.sm,
  },
  skipButton: {
    paddingVertical: spacingY.xs,
    paddingHorizontal: spacingX.md,
  },
  skipText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.secondary,
  },
  titleContainer: {
    paddingHorizontal: spacingX.lg,
    marginTop: dynamicSpacingY(2),
  },
  title: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xxl,
    color: colors.black,
    textAlign: "center",
    marginBottom: spacingY.sm,
  },
  subtitle: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.black_text,
    textAlign: "center",
    lineHeight: 24,
  },
  progressCard: {
    flex: 1,
    marginHorizontal: spacingX.lg,
    marginTop: dynamicSpacingY(2),
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: dynamicSpacingX(5),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  scoreHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  scoreLabel: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.tiny,
    color: colors.black_text,
    letterSpacing: 1,
    marginBottom: spacingY.xxs,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX.xs,
  },
  scoreValue: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xxl,
    color: colors.secondary,
  },
  weekBadge: {
    backgroundColor: colors.successBg,
    paddingVertical: spacingY.xxs,
    paddingHorizontal: spacingX.sm,
    borderRadius: 20,
  },
  weekBadgeText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.successText,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  progressIllustration: {
    width: "100%",
    height: "100%",
  },
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: spacingX.lg,
    marginVertical: dynamicSpacingY(2),
  },
  featureButton: {
    alignItems: "center",
    backgroundColor: colors.white,
    paddingVertical: spacingY.sm,
    paddingHorizontal: dynamicSpacingX(5),
    borderRadius: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.secondary_20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacingY.xs,
  },
  featureText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.black,
  },
});

export default ProgressPage;
