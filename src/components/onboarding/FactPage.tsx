import { Ionicons } from "@expo/vector-icons";
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

interface FactPageProps {
  onSkip: () => void;
}

const FactPage: React.FC<FactPageProps> = ({ onSkip }) => {
  return (
    <>
      <View style={styles.header}>
        <View style={{ flex: 1 }} />
        <Pressable onPress={onSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={require("../../assets/images/onboarding-2-strongmind.png")}
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="bulb-outline" size={20} color={colors.secondary} />
          <Text style={styles.cardLabel}>DID YOU KNOW?</Text>
        </View>
        <Text style={styles.cardTitle}>Fluency is a Muscle</Text>
        <Text style={styles.cardDescription}>
          Just like going to the gym, daily micro-practices rewire neural
          pathways. 85% of our users feel more confident after just 2 weeks.
        </Text>
      </View>

      <View style={styles.bottomSection}>
        <Text style={styles.bottomTitle}>Proven Techniques</Text>
        <Text style={styles.bottomSubtitle}>
          Backed by speech pathology research.
        </Text>
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
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacingX.lg,
  },
  illustration: {
    width: "80%",
    height: "80%",
  },
  card: {
    marginHorizontal: spacingX.lg,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: dynamicSpacingX(5),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX.xs,
    marginBottom: spacingY.sm,
  },
  cardLabel: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.secondary,
    letterSpacing: 1,
  },
  cardTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xl,
    color: colors.black,
    marginBottom: spacingY.xs,
  },
  cardDescription: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.black_text,
    lineHeight: 22,
  },
  bottomSection: {
    alignItems: "center",
    paddingVertical: dynamicSpacingY(3),
    paddingHorizontal: spacingX.lg,
  },
  bottomTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.large,
    color: colors.black,
    marginBottom: spacingY.xxs,
  },
  bottomSubtitle: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.black_text,
    marginBottom: spacingY.md,
  },
});

export default FactPage;
