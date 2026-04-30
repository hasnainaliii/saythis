import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Button } from "../../components";
import {
  colors,
  dynamicSpacingY,
  FONTS,
  fontSizes,
  spacingX,
  spacingY,
} from "../../theme/Theme";

interface WelcomePageProps {
  onGetStarted: () => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onGetStarted }) => {
  return (
    <>
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Ionicons name="chatbubbles" size={28} color={colors.white} />
        </View>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>Welcome to SayThis</Text>
        <Text style={styles.subtitle}>
          Your personal stuttering therapy companion{"\n"}
          for everyone, anywhere 🌱
        </Text>
      </View>

      <View style={styles.imageContainerCircle}>
        <View style={styles.imageBackground}>
          <Image
            source={require("../../assets/images/onboarding-1-personSpeaking.png")}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <Button
          title="Get Started"
          onPress={onGetStarted}
          size="large"
          fullWidth
          icon={<Ionicons name="arrow-forward" size={20} color={colors.white} />}
          iconPosition="right"
          style={styles.button}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: "center",
    marginTop: dynamicSpacingY(2),
  },
  logoCircle: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
    marginBottom: spacingY.sm,
  },
  subtitle: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.black_text,
    textAlign: "center",
    lineHeight: 24,
  },
  imageContainerCircle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: dynamicSpacingY(1),
    paddingHorizontal: spacingX.lg,
  },
  imageBackground: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 999,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  illustration: {
    width: "85%",
    height: "85%",
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

export default WelcomePage;
