import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components";
import {
  colors,
  dynamicSpacingY,
  FONTS,
  fontSizes,
  spacingX,
  spacingY,
} from "../../theme/Theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // Implement login logic
    console.log("Login:", { email, password });
  };

  const handleSignUp = () => {
    router.push("/(auth)/signup");
  };

  const handleForgotPassword = () => {
    // Navigate to forgot password
  };

  const handleSocialLogin = (provider: "facebook" | "google" | "instagram") => {
    console.log("Social login:", provider);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.primary} />
      <KeyboardAvoidingView behavior="height" style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
        >
          {/* Header with curved background */}
          <View style={styles.headerContainer}>
            <View style={styles.headerCurve} />
            <View style={styles.logoContainer}>
              <Image
                source={require("../../../assets/images/saythis-high-resolution-logo-transparent.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* Title */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Sign In</Text>
              <Text style={styles.subtitle}>SayThis AI Therapist</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={colors.secondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email..."
                    placeholderTextColor={colors.black_text}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={colors.secondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your password..."
                    placeholderTextColor={colors.black_text}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showPassword ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color={colors.black_text}
                    />
                  </Pressable>
                </View>
              </View>

              {/* Sign In Button */}
              <Button
                title="Sign In"
                onPress={handleLogin}
                size="large"
                fullWidth
                icon={
                  <Ionicons
                    name="arrow-forward"
                    size={20}
                    color={colors.white}
                  />
                }
                iconPosition="right"
                style={styles.signInButton}
              />
            </View>

            {/* Social Login */}
            <View style={styles.socialContainer}>
              <Pressable
                style={styles.socialButton}
                onPress={() => handleSocialLogin("facebook")}
              >
                <Ionicons name="logo-facebook" size={24} color={colors.black} />
              </Pressable>
              <Pressable
                style={styles.socialButton}
                onPress={() => handleSocialLogin("google")}
              >
                <Ionicons name="logo-google" size={24} color={colors.black} />
              </Pressable>
              <Pressable
                style={styles.socialButton}
                onPress={() => handleSocialLogin("instagram")}
              >
                <Ionicons
                  name="logo-instagram"
                  size={24}
                  color={colors.black}
                />
              </Pressable>
            </View>

            {/* Footer Links */}
            <View style={styles.footerContainer}>
              <View style={styles.signUpRow}>
                <Text style={styles.footerText}>Don't have an account? </Text>
                <Pressable onPress={handleSignUp}>
                  <Text style={styles.linkText}>Sign Up.</Text>
                </Pressable>
              </View>
              <Pressable onPress={handleForgotPassword}>
                <Text style={styles.forgotText}>Forgot Password</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  // Header
  headerContainer: {
    height: dynamicSpacingY(22), // Increased height for better proportions
    position: "relative",
    overflow: "hidden", // Ensure the curve doesn't bleed out
  },
  headerCurve: {
    position: "absolute",
    top: 0,
    left: "-20%", // Center the 140% width
    width: "140%", // Make it wider than screen for gentle arc
    height: "100%",
    backgroundColor: colors.secondary_20,
    borderBottomLeftRadius: SCREEN_WIDTH, // Large radius for gentle curve
    borderBottomRightRadius: SCREEN_WIDTH,
  },
  logoContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: dynamicSpacingY(2), // Move logo up slightly
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
  },
  // Content
  content: {
    flex: 1,
    paddingHorizontal: spacingX.lg,
    paddingTop: dynamicSpacingY(3),
  },
  // Title
  titleContainer: {
    alignItems: "center",
    marginBottom: dynamicSpacingY(4),
  },
  title: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xxl,
    color: colors.black,
    marginBottom: spacingY.xs,
  },
  subtitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.large,
    color: colors.black,
  },
  // Form
  form: {
    gap: dynamicSpacingY(2),
  },
  inputContainer: {
    gap: spacingY.xs,
  },
  inputLabel: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.black,
    marginLeft: spacingX.xs,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.primary10,
    paddingHorizontal: spacingX.md,
    height: dynamicSpacingY(6.5),
  },
  inputIcon: {
    marginRight: spacingX.sm,
  },
  input: {
    flex: 1,
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.black,
    paddingVertical: 0,
  },
  eyeIcon: {
    padding: spacingX.xs,
  },
  signInButton: {
    marginTop: spacingY.md,
  },
  // Social
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacingX.md,
    marginTop: dynamicSpacingY(4),
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.primary10,
  },
  // Footer
  footerContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: dynamicSpacingY(4),
    gap: spacingY.sm,
  },
  signUpRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.black,
  },
  linkText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.secondary,
  },
  forgotText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.secondary,
  },
});
