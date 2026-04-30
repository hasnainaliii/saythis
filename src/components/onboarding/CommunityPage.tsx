import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Button } from "../../components";
import {
  colors,
  dynamicSpacingX,
  dynamicSpacingY,
  FONTS,
  fontSizes,
  spacingX,
  spacingY,
} from "../../theme/Theme";

interface CommunityPageProps {
  onSkip: () => void;
  onNext: () => void;
}

const CommunityPage: React.FC<CommunityPageProps> = ({ onSkip, onNext }) => {
  return (
    <>
      <View style={styles.header}>
        <View style={{ flex: 1 }} />
        <Pressable onPress={onSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>SKIP</Text>
        </Pressable>
      </View>

      <View style={styles.avatarsContainer}>
        <View style={styles.avatarSmall}>
          <Image
            source={require("../../assets/images/onboarding-4-yournotalone-pic1.png")}
            style={styles.avatarImage}
            resizeMode="cover"
          />
        </View>
        <View style={styles.avatarLarge}>
          <Image
            source={require("../../assets/images/onboarding-4-yournotalone-pic2.png")}
            style={styles.avatarImage}
            resizeMode="cover"
          />
        </View>
        <View style={styles.avatarSmall}>
          <Image
            source={require("../../assets/images/onboarding-4-yournotalone-pic3.png")}
            style={styles.avatarImage}
            resizeMode="cover"
          />
        </View>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>You Are Not Alone</Text>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={16} color={colors.star} />
          <Ionicons name="star" size={16} color={colors.star} />
          <Ionicons name="star" size={16} color={colors.star} />
          <Ionicons name="star" size={16} color={colors.star} />
          <Ionicons name="star-half" size={16} color={colors.star} />
          <Text style={styles.ratingText}>4.9/5</Text>
        </View>
        <Text style={styles.subtitle}>
          Join <Text style={styles.highlightText}>50,000+ others</Text> finding
          their voice in our community.
        </Text>
      </View>

      <View style={styles.testimonialCard}>
        <Text style={styles.testimonialText}>
          "This app completely changed how I approach my presentations at work.
          I feel in control again."
        </Text>
        <View style={styles.testimonialAuthor}>
          <Image
            source={require("../../assets/images/onboarding-4-yournotalone-pic1.png")}
            style={styles.testimonialAvatar}
            resizeMode="cover"
          />
          <View>
            <Text style={styles.authorName}>Sarah J.</Text>
            <Text style={styles.authorSince}>Member since 2024</Text>
          </View>
        </View>
      </View>

      <View style={{ flex: 1 }} />

      <View style={styles.bottomContainer}>
        <Button
          title="Next"
          onPress={onNext}
          size="large"
          fullWidth
          style={styles.button}
        />
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
  avatarsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: dynamicSpacingY(4),
  },
  avatarSmall: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.white,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: colors.primary,
    marginHorizontal: -10,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarLarge: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.white,
    overflow: "hidden",
    borderWidth: 4,
    borderColor: colors.primary,
    zIndex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    alignItems: "center",
    marginTop: dynamicSpacingY(3),
    paddingHorizontal: spacingX.lg,
  },
  title: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xxl,
    color: colors.black,
    textAlign: "center",
    marginBottom: spacingY.xs,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginBottom: spacingY.sm,
  },
  ratingText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.black_text,
    marginLeft: spacingX.xs,
  },
  subtitle: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.black_text,
    textAlign: "center",
    lineHeight: 24,
  },
  highlightText: {
    fontFamily: FONTS.primaryBold,
    color: colors.secondary,
  },
  testimonialCard: {
    marginHorizontal: spacingX.lg,
    marginTop: dynamicSpacingY(6),
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: dynamicSpacingX(5),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  testimonialText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.black,
    lineHeight: 24,
    marginBottom: spacingY.md,
  },
  testimonialAuthor: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX.sm,
  },
  testimonialAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  authorName: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.black,
  },
  authorSince: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.tiny,
    color: colors.secondary,
  },
  bottomContainer: {
    paddingBottom: dynamicSpacingY(2),
    paddingHorizontal: spacingX.lg,
  },
  button: {
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});

export default CommunityPage;
